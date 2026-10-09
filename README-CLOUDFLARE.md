# Déploiement Cloudflare Pages — Olivier Mur v28

## Structure
- `public/` : site statique
- `functions/api/contact.js` : vrai formulaire de contact
- `functions/edt/_middleware.js` : protection par mot de passe de `/edt/`

## 1. Créer le projet Cloudflare Pages
Dans Cloudflare : Workers & Pages → Create → Pages → Connect to Git.
Sélectionner le dépôt GitHub du portfolio.

Réglages :
- Framework preset : None
- Build command : `exit 0`
- Build output directory : `public`
- Root directory : racine du dépôt

## 2. Configurer le planning privé
Dans Workers & Pages → projet → Settings → Variables and Secrets :
- `EDT_PASSWORD` → secret (mot de passe du planning)

## 3. Configurer le vrai formulaire de contact
Le formulaire est traité côté serveur par Cloudflare Pages Functions puis envoyé par Resend.

Créer un compte Resend et vérifier de préférence le sous-domaine `forms.oliviermursound.fr` afin de ne pas toucher aux enregistrements mail IONOS du domaine principal.
Puis ajouter dans Cloudflare Pages → Settings → Variables and Secrets :
- `RESEND_API_KEY` → secret
- `CONTACT_TO` → `contact@oliviermursound.fr`
- `CONTACT_FROM` → `Portfolio Olivier Mur <site@forms.oliviermursound.fr>`

Le domaine utilisé dans CONTACT_FROM doit être vérifié chez Resend.

Le visiteur remplit le formulaire du site → `/api/contact` → Pages Function → Resend → le message arrive à `contact@oliviermursound.fr`, puis IONOS en garde une copie et le transfère aussi vers Gmail. L'adresse du visiteur est placée en Reply-To.

## 4. Domaine personnalisé
Dans Cloudflare Pages → Custom domains → Set up a custom domain.
Ajouter `oliviermursound.fr`, puis suivre les instructions DNS. Pour le domaine racine, Cloudflare doit gérer la zone DNS et les nameservers. Vérifier avant la bascule que les enregistrements MX/SPF/DKIM IONOS sont présents dans Cloudflare.

## 5. Sécurité / anti-spam
- Honeypot intégré au formulaire.
- Validation serveur des champs.
- Secrets jamais stockés dans GitHub.
- `/edt/` protégé par cookie HttpOnly/Secure.

Si le spam devient significatif, ajouter Cloudflare Turnstile au formulaire.


CV public actuel : `public/assets/olivier-mur-cv-2026-v2.pdf`
