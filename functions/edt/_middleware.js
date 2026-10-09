const COOKIE = "edt_session";
const MAX_AGE = 60 * 60 * 24;

async function sha256Hex(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function cookieValue(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const item of raw.split(";")) {
    const [k, ...v] = item.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return null;
}

function loginPage(error = "", status = 401) {
  return new Response(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Planning privé</title><style>:root{--bg:#f6f7f9;--text:#1d2430;--muted:#667085;--line:#d9dee7;--accent:#2f6fed}*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:22px;background:var(--bg);color:var(--text);font-family:Inter,system-ui,sans-serif}.card{width:min(440px,100%);background:#fff;border:1px solid var(--line);border-radius:20px;padding:28px;box-shadow:0 12px 34px rgba(18,28,45,.10)}h1{margin:0 0 8px}p{color:var(--muted);line-height:1.5}label{display:block;font-size:13px;font-weight:700;margin:18px 0 7px}input{width:100%;height:48px;border:1px solid var(--line);border-radius:11px;padding:0 13px;font:inherit}button{width:100%;height:48px;margin-top:12px;border:0;border-radius:11px;background:var(--accent);color:#fff;font:inherit;font-weight:800}.err{color:#b42318;font-weight:700}</style></head><body><main class="card"><h1>Planning privé</h1><p>Entre le mot de passe pour accéder à ton emploi du temps.</p>${error ? `<p class="err">${error}</p>` : ""}<form method="post"><label for="password">Mot de passe</label><input id="password" name="password" type="password" autocomplete="current-password" required autofocus><button type="submit">Accéder au planning</button></form></main></body></html>`, {status,headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store","x-robots-tag":"noindex, nofollow, noarchive"}});
}

export async function onRequest(context) {
  const { request, env } = context;
  if (!env.EDT_PASSWORD) return loginPage("Accès non configuré.", 503);

  const url = new URL(request.url);
  if (url.searchParams.get("logout") === "1") {
    return new Response(null,{status:303,headers:{Location:"/edt/","Set-Cookie":`${COOKIE}=; Path=/edt; HttpOnly; Secure; SameSite=Strict; Max-Age=0`}});
  }

  const expected = await sha256Hex(`olivier-edt-v1:${env.EDT_PASSWORD}`);
  const session = cookieValue(request, COOKIE);
  if (session === expected) {
    const response = await context.next();
    const h = new Headers(response.headers);
    h.set("cache-control","no-store, private");
    h.set("x-robots-tag","noindex, nofollow, noarchive");
    return new Response(response.body,{status:response.status,statusText:response.statusText,headers:h});
  }

  if (request.method === "POST") {
    const form = await request.formData();
    const submitted = String(form.get("password") || "");
    if (submitted === env.EDT_PASSWORD) {
      return new Response(null,{status:303,headers:{Location:"/edt/","Set-Cookie":`${COOKIE}=${expected}; Path=/edt; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE}`}});
    }
    return loginPage("Mot de passe incorrect.", 401);
  }

  return loginPage();
}
