import { graphqlRequest } from './api'

export default {
  async getFilms(params = {}) {
    // 1. On demande TOUS les films à l'API sans aucun filtre pour éviter l'erreur "Unknown argument"
    const query = `
      query {
        movies {
          edges {
            node {
              id
              name
              description
              duration
              image
              createdAt
              releaseData
              director {
                id
                lastname
                firstname
              }
              categories {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              nbEntries
              url
              budget
            }
          }
        }
      }
    `

    // On récupère les données brutes
    const data = await graphqlRequest(query)

    // 2. On transforme les données (Mapping)
    let films = data.movies.edges.map(edge => {
      const node = edge.node
      const idMatch = node.id.match(/\/(\d+)$/)
      const numericId = idMatch ? idMatch[1] : node.id

      // Extraction de l'ID du réalisateur pour le filtrage
      const directorIdMatch = node.director?.id?.match(/\/(\d+)$/)
      const directorNumericId = directorIdMatch ? directorIdMatch[1] : node.director?.id

      return {
        id: numericId,
        iriId: node.id,
        title: node.name,
        name: node.name,
        description: node.description,
        duration: node.duration,
        poster: node.image,
        image: node.image,
        createdAt: node.createdAt,
        releaseDate: node.releaseData,
        director: {
          ...node.director,
          numericId: directorNumericId // Ajouté pour faciliter le filtre
        },
        categories: node.categories?.edges.map(cat => cat.node) || [],
        nbEntries: node.nbEntries,
        url: node.url,
        budget: node.budget,
      }
    })

    // 3. APPLICATION DES FILTRES EN JAVASCRIPT (Frontend)

    // A. Filtre Recherche (Search)
    if (params.search) {
      const lowerSearch = params.search.toLowerCase()
      films = films.filter(film =>
          film.name.toLowerCase().includes(lowerSearch)
      )
    }

    // B. Filtre Réalisateur (Director)
    if (params.director) {
      // On nettoie l'ID reçu (au cas où ce serait un IRI /api/directors/5)
      const searchDirectorId = params.director.toString().replace('/api/directors/', '')

      films = films.filter(film =>
          film.director && film.director.numericId == searchDirectorId
      )
    }

    // C. Tri (Sort)
    if (params.sort) {
      films.sort((a, b) => {
        const dateA = new Date(a.releaseDate)
        const dateB = new Date(b.releaseDate)

        if (params.sort === 'recent' || params.sort === 'desc') {
          return dateB - dateA // Du plus récent au plus vieux
        } else {
          return dateA - dateB // Du plus vieux au plus récent
        }
      })
    }

    return films
  },

  // ... GARDE TOUT LE RESTE DE TES FONCTIONS (getFilm, createFilm, etc.) INCHANGÉ ...
  async getFilm(id) {
    // ... (ton code existant pour getFilm) ...
    const query = `query getMovie($id: ID!) { movie(id: $id) { id name description duration image createdAt releaseData director { id lastname firstname } categories { edges { node { id name } } } nbEntries url budget } }`
    const iriId = id.toString().startsWith('/api/') ? id : `/api/movies/${id}`
    const data = await graphqlRequest(query, { id: iriId })
    const movie = data.movie
    const idMatch = movie.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : movie.id
    return {
      id: numericId,
      iriId: movie.id,
      title: movie.name,
      name: movie.name,
      description: movie.description,
      duration: movie.duration,
      poster: movie.image,
      image: movie.image,
      createdAt: movie.createdAt,
      releaseDate: movie.releaseData,
      director: movie.director,
      categories: movie.categories?.edges.map(cat => cat.node) || [],
      nbEntries: movie.nbEntries,
      url: movie.url,
      budget: movie.budget,
    }
  },

  async createFilm(filmData) {
    // ... Copie ton code createFilm existant ici ...
    // Pour gagner de la place je ne le remets pas, mais il est vital !
    const mutation = `mutation createMovie($name: String!, $description: String, $duration: Int, $image: String, $releaseData: String, $director: String, $nbEntries: Int, $url: String, $budget: Float, $createdAt: String!) { createMovie(input: { name: $name, description: $description, duration: $duration, image: $image, releaseData: $releaseData, director: $director, nbEntries: $nbEntries, url: $url, budget: $budget, createdAt: $createdAt }) { movie { id name description duration image createdAt releaseData director { id lastname firstname } categories { edges { node { id name } } } nbEntries url budget } } }`
    const variables = { name: filmData.name, createdAt: new Date().toISOString() }
    if (filmData.description) variables.description = filmData.description
    if (filmData.duration) variables.duration = parseInt(filmData.duration)
    if (filmData.image) variables.image = filmData.image
    if (filmData.releaseDate) variables.releaseData = filmData.releaseDate
    if (filmData.director) variables.director = filmData.director
    if (filmData.nbEntries) variables.nbEntries = parseInt(filmData.nbEntries)
    if (filmData.url) variables.url = filmData.url
    if (filmData.budget) variables.budget = parseFloat(filmData.budget)

    const data = await graphqlRequest(mutation, variables)
    // ... suite de ta logique ...
    return { id: 1 } // placeholder
  },

  async updateFilm(id, filmData) {
    // ... Copie ton code updateFilm existant ici ...
    const mutation = `mutation updateMovie($id: ID!, $name: String, $description: String, $duration: Int, $image: String, $releaseData: String, $director: String, $categories: [String], $nbEntries: Int, $url: String, $budget: Float) { updateMovie(input: { id: $id, name: $name, description: $description, duration: $duration, image: $image, releaseData: $releaseData, director: $director, categories: $categories, nbEntries: $nbEntries, url: $url, budget: $budget }) { movie { id } } }`
    const iriId = id.toString().startsWith('/api/') ? id : `/api/movies/${id}`
    const variables = { id: iriId, name: filmData.name }
    // ... variables ...
    await graphqlRequest(mutation, variables)
    return { id: 1 } // placeholder
  },

  async deleteFilm(id) {
    const mutation = `mutation deleteMovie($input: deleteMovieInput!) { deleteMovie(input: $input) { clientMutationId } }`;
    const iriId = id.toString().startsWith('/api/') ? id : `/api/movies/${id}`;
    try { await graphqlRequest(mutation, { input: { id: iriId } }); return true; } catch (error) { throw error; }
  },

  async searchFilms(query) {
    return this.getFilms({ search: query })
  },
}