import { graphqlRequest } from './api'

export default {
  async getFilms(params = {}) {
    const query = `
      query {
        movies {
          edges {
            node {
              id
              name
              categories {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
              createdAt
            }
          }
        }
      }
    `

    const data = await graphqlRequest(query)
    // Transformer les données de GraphQL vers le format attendu par le frontend
    return data.movies.edges.map(edge => {
      // Extraire l'ID numérique de l'IRI (ex: /api/movies/602 -> 602)
      const idMatch = edge.node.id.match(/\/(\d+)$/)
      const numericId = idMatch ? idMatch[1] : edge.node.id

      return {
        id: numericId,
        iriId: edge.node.id, // Garder l'IRI complet pour les mutations
        title: edge.node.name,
        categories: edge.node.categories?.edges.map(cat => cat.node) || [],
        releaseDate: edge.node.createdAt,
      }
    })
  },

  async getFilm(id) {
    const query = `
      query getMovie($id: ID!) {
        movie(id: $id) {
          id
          name
          categories {
            edges {
              node {
                id
                name
              }
            }
          }
          createdAt
        }
      }
    `

    // Si l'ID est juste un numéro, le convertir en IRI
    const iriId = id.startsWith('/api/') ? id : `/api/movies/${id}`

    const data = await graphqlRequest(query, { id: iriId })
    const movie = data.movie

    const idMatch = movie.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : movie.id

    return {
      id: numericId,
      iriId: movie.id,
      title: movie.name,
      categories: movie.categories?.edges.map(cat => cat.node) || [],
      releaseDate: movie.createdAt,
    }
  },

  async createFilm(filmData) {
    const mutation = `
      mutation createMovie($name: String!, $categories: [String], $createdAt: String!) {
        createMovie(input: {
          name: $name,
          categories: $categories,
          createdAt: $createdAt
        }) {
          movie {
            id
            name
            categories {
              edges {
                node {
                  id
                  name
                }
              }
            }
            createdAt
          }
        }
      }
    `

    // Convertir les données du formulaire vers le format GraphQL
    const variables = {
      name: filmData.title,
      categories: filmData.categories || [],
      createdAt: filmData.releaseDate || new Date().toISOString(),
    }

    const data = await graphqlRequest(mutation, variables)
    const movie = data.createMovie.movie

    const idMatch = movie.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : movie.id

    return {
      id: numericId,
      iriId: movie.id,
      title: movie.name,
      categories: movie.categories?.edges.map(cat => cat.node) || [],
      releaseDate: movie.createdAt,
    }
  },

  async updateFilm(id, filmData) {
    const mutation = `
      mutation updateMovie($id: ID!, $name: String, $categories: [String]) {
        updateMovie(input: {
          id: $id,
          name: $name,
          categories: $categories
        }) {
          movie {
            id
            name
            categories {
              edges {
                node {
                  id
                  name
                }
              }
            }
            createdAt
          }
        }
      }
    `

    // Si l'ID est juste un numéro, le convertir en IRI
    const iriId = id.startsWith('/api/') ? id : `/api/movies/${id}`

    const variables = {
      id: iriId,
      name: filmData.title,
      categories: filmData.categories || [],
    }

    const data = await graphqlRequest(mutation, variables)
    const movie = data.updateMovie.movie

    const idMatch = movie.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : movie.id

    return {
      id: numericId,
      iriId: movie.id,
      title: movie.name,
      categories: movie.categories?.edges.map(cat => cat.node) || [],
      releaseDate: movie.createdAt,
    }
  },

  async deleteFilm(id) {
    const mutation = `
      mutation deleteMovie($id: ID!) {
        deleteMovie(input: { id: $id }) {
          id
        }
      }
    `

    // Si l'ID est juste un numéro, le convertir en IRI
    const iriId = id.startsWith('/api/') ? id : `/api/movies/${id}`

    const data = await graphqlRequest(mutation, { id: iriId })
    return data.deleteMovie
  },

  async searchFilms(query) {
    // Pour l'instant, on récupère tous les films et on filtre côté client
    // À adapter selon les capacités de recherche de votre API GraphQL
    const films = await this.getFilms()
    return films.filter(film =>
      film.title.toLowerCase().includes(query.toLowerCase())
    )
  },
}
