# Installation de /budget et synchronisation /edt

Cette version ajoute :
- `/budget/` protégé par le même mot de passe que `/edt/` (`EDT_PASSWORD`)
- synchronisation multi-appareils pour `/budget/` et `/edt/`
- stockage persistant dans Cloudflare D1
- copie locale de secours dans le navigateur
- export/import JSON manuel
- sauvegarde serveur automatique au maximum toutes les 6 heures, 120 versions conservées par outil

## Étape Cloudflare unique

1. Cloudflare > Workers & Pages > D1 > Create database
2. Nom conseillé : `olivier-private-data`
3. Ouvrir `Workers & Pages > portfolio-audio > Settings > Bindings`
4. Ajouter une liaison **D1 database**
5. Variable name : `PRIVATE_DB`
6. Sélectionner la base `olivier-private-data`
7. Enregistrer puis **redéployer** le projet Pages

Aucune migration SQL à lancer : les Functions créent automatiquement les tables au premier accès.

Le secret `EDT_PASSWORD` existant est réutilisé tel quel. Il n'y a pas de nouveau mot de passe à créer.

## GitHub

Copier le contenu de ce dossier à la racine du dépôt, comme pour les versions précédentes. La structure utile est :

- `public/edt/index.html`
- `public/budget/index.html`
- `functions/edt/_middleware.js`
- `functions/edt/api/state.js`
- `functions/budget/_middleware.js`
- `functions/budget/api/state.js`
- `public/_routes.json`

## Première ouverture

- Si `/edt/` contient déjà un état dans le localStorage du navigateur et que D1 est vide, il est envoyé automatiquement dans D1.
- Pour le budget, si tu as déjà un JSON de sauvegarde, utilise **Importer JSON** une fois après la mise en ligne.
- Après synchronisation, le badge doit afficher `Synchronisé`.

## URLs

- `https://www.oliviermursound.fr/edt/`
- `https://www.oliviermursound.fr/budget/`

Les deux utilisent la même session privée et le même mot de passe.
