# Portfolio Olivier Mur — v22

Cette version protège uniquement `/edt/` avec une Netlify Edge Function.

## Déploiement

Le dossier `public/` est le contenu public servi par Netlify.
Le code de protection se trouve dans `netlify/edge-functions/` et n'est pas publié comme fichier statique.

## Mot de passe à configurer dans Netlify

1. Ouvrir le projet Netlify.
2. Aller dans **Project configuration > Environment variables**.
3. Ajouter la variable : `PROTECTED_PAGE_PASSWORD`
4. Lui donner un mot de passe fort.
5. Vérifier que la portée inclut **Functions** si Netlify propose le choix de portée.
6. Relancer un déploiement du site.

Le mot de passe ne doit jamais être écrit dans GitHub, `netlify.toml` ou le HTML.

URL privée : `/edt/`

La page :
- n'est pas liée depuis le portfolio ;
- est marquée `noindex` / `nofollow` ;
- exige le mot de passe ;
- garde la session 24 h via un cookie `HttpOnly`, `Secure`, `SameSite=Strict` ;
- propose un bouton Déconnexion ;
- reste bloquée si la variable d'environnement n'est pas définie.


## Version v23 — services + voix off
- « Prise de son en tournage » remplace « Prise de son tournage ».
- « Mixage broadcast » et « Montage & mixage » sont fusionnés en « Montage, mixage & broadcast ».
- La mise aux normes EBU R128 et les livrables broadcast restent explicitement mis en avant.
- La rubrique Voix off indique clairement qu’Olivier propose sa propre voix et intègre une démo audio locale.
- La protection /edt/ par Edge Function est conservée.


## v24 — nouvelle sélection réalisations
- Hero : STIHL — Équipe de France Timber Sports (prise de son en tournage)
- Miléade — Villages Clubs & Hôtels (prise de son en tournage + mixage)
- Sultan Achour — Saison 1, épisode 1 (montage son + mixage)
- Embassy of Ireland — Saint Patrick’s Day (prise de son en tournage + mixage)
- France Pare-Brise — Paquito (prise de son en tournage + mixage broadcast)
- Le Prochain — court-métrage (prise de son en tournage)

Les anciennes cartes Help us, Parions Sport et Farrah El Dibany ont été retirées de la page principale.


## v25 final gallery
- Hero : STIHL — C’est dans ma nature
- Galerie : Miléade, STIHL Timber Sports, Sultan Achour, Embassy of Ireland, France Pare-Brise, Farrah El Dibany


## v26
- Remplacement de toutes les mentions « Prise de son en tournage » par « Prise de son ».

## v27 — Cloudflare Pages
- Migration depuis Netlify vers Cloudflare Pages.
- Vrai formulaire de contact via Pages Function + Resend.
- Protection `/edt/` réécrite pour Cloudflare Pages.
- Les secrets restent dans les variables chiffrées Cloudflare et ne sont pas committés.
- Voir `README-CLOUDFLARE.md`.


## v28
- Adresse publique : contact@oliviermursound.fr
- Formulaire destiné à la boîte professionnelle IONOS, avec redirection Gmail en copie.
- Guide Cloudflare actualisé.


## v29
- Nouveau CV intégré : olivier-mur-cv-2026-v2.pdf
- Tous les liens CV du portfolio pointent vers cette nouvelle version.
