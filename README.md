# Ewen D'Avanzo

# Cineverse - Application de Gestion de Films

Application frontend Vue.js 3 pour la gestion et consultation de films, avec authentification JWT et système de rôles.


## Backend (API)

Ce projet frontend nécessite le backend Symfony pour fonctionner.

* **Lien du dépôt :** [https://github.com/ewenlogiciel/wr506d](https://github.com/ewenlogiciel/wr506d)
* ⚠️ **Important :** Veuillez vous placer sur la branche **`develop`** du dépôt backend.

## Installation

1. Cloner le projet et installer les dépendances:
```sh
npm install
```

2. Configurer les variables d'environnement:
```sh
cp .env.example .env
```

3. Modifier le fichier `.env` avec l'URL de l'API Symfony:
```
VITE_API_BASE_URL=http://localhost:8319/api
```

## Démarrage

### Mode développement
```sh
npm run dev
```
L'application sera accessible sur `http://localhost:5173`

### Build de production
```sh
npm run build
```

### Preview du build de production
```sh
npm run preview
```


## Tests

### Tests unitaires avec Cypress
```sh
npm run test:unit:dev # ou npm run test:unit pour headless
```

### Tests E2E avec Cypress
```sh
npm run test:e2e:dev
```
