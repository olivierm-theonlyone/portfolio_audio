function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function errorPage(message, status = 400) {
  return new Response(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Message non envoyé</title><style>body{font-family:system-ui,sans-serif;background:#f5f1ea;color:#111;margin:0;display:grid;place-items:center;min-height:100vh;padding:24px}.box{max-width:560px;background:#fff;padding:28px;border-radius:18px;border:1px solid #ddd}a{color:#1900a8;font-weight:700}</style></head><body><main class="box"><h1>Le message n’a pas été envoyé.</h1><p>${escapeHtml(message)}</p><p><a href="/#contact">Retour au formulaire</a></p></main></body></html>`, {
    status,
    headers: {"content-type":"text/html; charset=utf-8","cache-control":"no-store"}
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return errorPage("Le formulaire n’est pas encore configuré côté serveur.", 503);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/x-www-form-urlencoded") && !contentType.includes("multipart/form-data")) {
    return errorPage("Format de formulaire invalide.", 415);
  }

  const form = await request.formData();
  const honeypot = String(form.get("website") || "").trim();
  if (honeypot) {
    return Response.redirect(new URL("/merci.html", request.url), 303);
  }

  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const subject = String(form.get("subject") || "").trim();
  const message = String(form.get("message") || "").trim();

  if (!name || !email || !subject || !message) {
    return errorPage("Merci de remplir tous les champs.");
  }
  if (name.length > 120 || email.length > 200 || subject.length > 180 || message.length > 6000) {
    return errorPage("Un des champs est trop long.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return errorPage("L’adresse e-mail semble invalide.");
  }

  const plain = `Nouveau message depuis le portfolio\n\nNom : ${name}\nE-mail : ${email}\nObjet : ${subject}\n\n${message}`;
  const html = `<h2>Nouveau message depuis le portfolio</h2><p><strong>Nom :</strong> ${escapeHtml(name)}</p><p><strong>E-mail :</strong> ${escapeHtml(email)}</p><p><strong>Objet :</strong> ${escapeHtml(subject)}</p><hr><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `Portfolio — ${subject}`,
      text: plain,
      html
    })
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return errorPage("Une erreur technique empêche l’envoi pour le moment. Tu peux aussi écrire directement à contact@oliviermursound.fr.", 502);
  }

  return Response.redirect(new URL("/merci.html", request.url), 303);
}

export function onRequestGet() {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
}
