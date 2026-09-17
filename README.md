# GymTracker

Application web mobile first (React + TypeScript + Vite).

## Stack

- React 19 (React Compiler activé) + TypeScript
- Vite 8
- React Router (mode data router)
- react-i18next (textes en `fr`, aucun texte en dur dans les composants)
- Sass (pas de CSS Modules, pas de nesting, nommage BEM)
- Oxlint (JS/TS) + Stylelint (SCSS/BEM) + Prettier

## Architecture (DDD + Atomic Design)

```
src/
  app/            Racine de composition : router, agrégation i18n
  domains/        Un dossier par domaine métier
    <domaine>/
      atoms|molecules|organisms|blocks/
      pages/
      hooks/
      translations/
  shared/         Ce qui est commun à plusieurs domaines
    atoms|molecules|organisms|blocks/
    templates/    Logique commune aux pages
    hooks/
    utils/
    types/
    i18n/
    styles/
      abstracts/  Variables et mixins (couleurs, fonts, breakpoints)
      base/       Reset + styles de base
```

Règles à respecter (voir `instructions.md`) :

- Pas de fichier de plus de 150 lignes : découper en sous-composants et hooks.
- `return` JSX le plus court possible ; toute condition est calculée dans une variable au-dessus.
- Un hook n'est utilisé que si nécessaire ; la logique lourde va dans un hook custom.
- Sémantique HTML correcte (`<button>` pour les actions, etc.).
- SCSS : BEM, pas de nesting, aucune couleur/police en dur (variables dans `shared/styles/abstracts`).
- Données stockées en JSON local (pas de base de données).
- Fichiers nommés en kebab-case.

## Alias de chemins

`@app/*`, `@domains/*`, `@shared/*` pointent vers `src/app`, `src/domains`, `src/shared`.

## Scripts

```bash
npm run dev           # serveur de dev
npm run build          # typecheck + build production
npm run lint            # oxlint (JS/TS)
npm run lint:style   # stylelint (SCSS)
npm run format         # prettier --write
npm run format:check   # prettier --check
```
