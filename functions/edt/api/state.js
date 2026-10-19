const STATE_NAME = "edt";
const BACKUP_INTERVAL_SECONDS = 6 * 60 * 60;
const MAX_BACKUPS = 120;
const ITEM_COUNT = 24;

function json(data, status = 200) {
  return Response.json(data, {status, headers:{"cache-control":"no-store"}});
}

async function ensureSchema(db) {
  await db.prepare(`CREATE TABLE IF NOT EXISTS app_state (
    name TEXT PRIMARY KEY,
    json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`).run();
  await db.prepare(`CREATE TABLE IF NOT EXISTS app_backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    json TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`).run();
  await db.prepare(`CREATE INDEX IF NOT EXISTS idx_app_backups_name_created ON app_backups(name, created_at DESC)`).run();
}

function validatePayload(data) {
  const checks = Array.isArray(data?.checks) && data.checks.length === ITEM_COUNT ? data.checks.map(Boolean) : Array(ITEM_COUNT).fill(false);
  const comments = Array.isArray(data?.comments) && data.comments.length === ITEM_COUNT ? data.comments.map(v=>String(v ?? "").slice(0,2000)) : Array(ITEM_COUNT).fill("");
  const cycleNum = Number(data?.cycle);
  const cycle = Number.isFinite(cycleNum) && cycleNum >= 1 ? Math.floor(cycleNum) : 1;
  return {checks,comments,cycle};
}

async function maybeBackup(db, currentJson) {
  if (!currentJson) return;
  const last = await db.prepare(`SELECT created_at FROM app_backups WHERE name=? ORDER BY id DESC LIMIT 1`).bind(STATE_NAME).first();
  const lastMs = last?.created_at ? Date.parse(last.created_at) : 0;
  if (Date.now() - lastMs < BACKUP_INTERVAL_SECONDS * 1000) return;
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO app_backups(name,json,created_at) VALUES(?,?,?)`).bind(STATE_NAME,currentJson,now).run();
  await db.prepare(`DELETE FROM app_backups WHERE name=? AND id NOT IN (SELECT id FROM app_backups WHERE name=? ORDER BY id DESC LIMIT ?)`).bind(STATE_NAME,STATE_NAME,MAX_BACKUPS).run();
}

export async function onRequestGet({env}) {
  if (!env.PRIVATE_DB) return json({error:"database_not_configured"},503);
  await ensureSchema(env.PRIVATE_DB);
  const row = await env.PRIVATE_DB.prepare(`SELECT json,updated_at FROM app_state WHERE name=?`).bind(STATE_NAME).first();
  if (!row) return json({exists:false,data:null});
  try { return json({exists:true,data:JSON.parse(row.json),updated_at:row.updated_at}); }
  catch { return json({error:"corrupt_state"},500); }
}

export async function onRequestPost({request,env}) {
  if (!env.PRIVATE_DB) return json({error:"database_not_configured"},503);
  await ensureSchema(env.PRIVATE_DB);
  let payload;
  try { payload = await request.json(); } catch { return json({error:"invalid_json"},400); }
  const clean = validatePayload(payload);
  const nextJson = JSON.stringify(clean);
  const current = await env.PRIVATE_DB.prepare(`SELECT json FROM app_state WHERE name=?`).bind(STATE_NAME).first();
  await maybeBackup(env.PRIVATE_DB,current?.json || null);
  const now = new Date().toISOString();
  await env.PRIVATE_DB.prepare(`INSERT INTO app_state(name,json,updated_at) VALUES(?,?,?) ON CONFLICT(name) DO UPDATE SET json=excluded.json, updated_at=excluded.updated_at`).bind(STATE_NAME,nextJson,now).run();
  return json({ok:true,saved_at:now});
}
