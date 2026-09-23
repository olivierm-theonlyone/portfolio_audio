# Portfolio minimal — Olivier Mur

Site statique one-page, prêt pour Netlify.

## Fichiers
- `index.html` : toute la page (HTML + CSS + JavaScript)
- `merci.html` : confirmation du formulaire
- `assets/olivier-mur-cv.pdf` : CV téléchargeable

## Mise en ligne sur Netlify
1. Connectez-vous à Netlify.
2. Ouvrez la page de déploiement manuel / Netlify Drop.
3. Glissez-déposez **le dossier décompressé** `olivier-mur-portfolio-minimal`.
4. Le formulaire est déjà configuré pour Netlify Forms.
5. Dans Netlify, activez une notification e-mail pour les nouvelles soumissions de formulaire.

## Modifications rapides
Le site tient presque entièrement dans `index.html`.
- Couleur principale : variable CSS `--blue` en haut du fichier.
- E-mail : rechercher `mur.olivier@yahoo.fr`.
- Téléphone : rechercher `0677962788` / `06 77 96 27 88`.
- Vidéos : rechercher `data-youtube=` et remplacer les IDs YouTube si besoin.
- Texte : modifier directement les sections `Services`, `Réalisations`, `À propos`, `Contact`.

Le bouton CV est fixe à l'écran et le CV est également accessible depuis le menu, le hero, la section À propos et la section Contact.


## Réalisations
La page contient actuellement 8 vidéos YouTube. Pour en ajouter, dupliquez une carte `.work-card` dans la section `#realisations`, remplacez l’identifiant YouTube, le titre et le rôle. Le lecteur est chargé uniquement au clic.
