# Cineverse - Application de Gestion de Films

Application frontend Vue.js 3 pour la gestion et consultation de films, avec authentification JWT et système de rôles.

## Fonctionnalités

### Partie Publique
- Consultation de la liste des films
- Recherche de films par mots-clés
- Filtrage par auteur et date
- Consultation des détails d'un film

### Utilisateurs Authentifiés
- Création de compte / Connexion
- Ajout de commentaires sur les films
- Attribution de notes aux films (1 à 5 étoiles)

### Administrateurs (ROLE_ADMIN)
- CRUD complet sur les films (Créer, Lire, Modifier, Supprimer)
- Gestion des contenus
- Suppression de commentaires

## Technologies Utilisées

- **Vue.js 3** - Framework JavaScript progressif
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS utility-first
- **Pinia** - Gestion d'état pour Vue 3
- **Vue Router** - Routing officiel pour Vue.js
- **Axios** - Client HTTP pour les appels API
- **JWT** - Authentification par tokens

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Installation

1. Cloner le projet et installer les dépendances:
```sh
npm install
```

2. Configurer les variables d'environnement:
```sh
cp .env.example .env
```

3. Modifier le fichier `.env` avec l'URL de votre API Symfony:
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

## Configuration Backend Symfony

L'application s'attend à ce que votre API Symfony expose les endpoints suivants:

### Authentification
- `POST /api/login` - Connexion (body: `{email, password}`)
  - Retour: `{token, user: {id, email, username, roles}}`
- `POST /api/register` - Inscription (body: `{email, password, username}`)
  - Retour: `{token, user: {id, email, username, roles}}`
- `GET /api/user` - Récupérer l'utilisateur connecté

### Films
- `GET /api/films` - Liste des films (params: `author`, `sort`)
- `GET /api/films/{id}` - Détail d'un film
- `POST /api/films` - Créer un film (ADMIN)
- `PUT /api/films/{id}` - Modifier un film (ADMIN)
- `DELETE /api/films/{id}` - Supprimer un film (ADMIN)
- `GET /api/films/search?q={query}` - Rechercher des films

### Commentaires
- `GET /api/films/{id}/comments` - Commentaires d'un film
- `POST /api/films/{id}/comments` - Ajouter un commentaire
- `DELETE /api/comments/{id}` - Supprimer un commentaire

### Notes
- `POST /api/films/{id}/rate` - Noter un film (body: `{rating: 1-5}`)
- `GET /api/films/{id}/my-rating` - Récupérer sa note

## Structure des Données

### Film
```json
{
  "id": 1,
  "title": "Titre du film",
  "description": "Description...",
  "director": "Nom du réalisateur",
  "genre": "Action",
  "releaseDate": "2024-01-01",
  "duration": 120,
  "poster": "https://...",
  "averageRating": 4.5,
  "ratingsCount": 42,
  "author": {
    "id": 1,
    "username": "john",
    "email": "john@example.com"
  }
}
```

### Rôles Utilisateurs
- `ROLE_USER` - Utilisateur standard (peut commenter et noter)
- `ROLE_EDITOR` - Éditeur
- `ROLE_ADMIN` - Administrateur (CRUD complet)

## Structure du Projet

```
src/
├── assets/          # Fichiers CSS et assets statiques
├── components/      # Composants Vue réutilisables
│   ├── Navbar.vue
│   └── FilmCard.vue
├── views/           # Pages/Vues de l'application
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── FilmsListView.vue
│   ├── FilmDetailView.vue
│   └── admin/
│       ├── AdminFilmsView.vue
│       └── FilmFormView.vue
├── stores/          # Stores Pinia pour la gestion d'état
│   ├── auth.js
│   └── films.js
├── services/        # Services pour les appels API
│   ├── api.js
│   ├── authService.js
│   ├── filmService.js
│   ├── commentService.js
│   └── ratingService.js
├── router/          # Configuration Vue Router
│   └── index.js
├── App.vue
└── main.js
```

## Routes Disponibles

- `/` - Liste des films (public)
- `/films/:id` - Détail d'un film (public)
- `/login` - Connexion
- `/register` - Inscription
- `/admin` - Gestion des films (ADMIN uniquement)
- `/admin/films/new` - Créer un film (ADMIN uniquement)
- `/admin/films/:id/edit` - Modifier un film (ADMIN uniquement)

## Tests

### Tests unitaires avec Cypress
```sh
npm run test:unit:dev # ou npm run test:unit pour headless
```

### Tests E2E avec Cypress
```sh
npm run test:e2e:dev
```
