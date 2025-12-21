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

    const data = await graphqlRequest(query)
    return data.movies.edges.map(edge => {
      const idMatch = edge.node.id.match(/\/(\d+)$/)
      const numericId = idMatch ? idMatch[1] : edge.node.id

      return {
        id: numericId,
        iriId: edge.node.id,
        title: edge.node.name,
        name: edge.node.name,
        description: edge.node.description,
        duration: edge.node.duration,
        poster: edge.node.image,
        image: edge.node.image,
        createdAt: edge.node.createdAt,
        releaseDate: edge.node.releaseData,
        director: edge.node.director,
        categories: edge.node.categories?.edges.map(cat => cat.node) || [],
        nbEntries: edge.node.nbEntries,
        url: edge.node.url,
        budget: edge.node.budget,
      }
    })
  },

  async getFilm(id) {
    const query = `
      query getMovie($id: ID!) {
        movie(id: $id) {
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
    `

    const iriId = id.startsWith('/api/') ? id : `/api/movies/${id}`
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
    const mutation = `
      mutation createMovie($name: String!, $description: String, $duration: Int, $image: String, $releaseData: String, $director: String, $nbEntries: Int, $url: String, $budget: Float, $createdAt: String!) {
        createMovie(input: {
          name: $name,
          description: $description,
          duration: $duration,
          image: $image,
          releaseData: $releaseData,
          director: $director,
          nbEntries: $nbEntries,
          url: $url,
          budget: $budget,
          createdAt: $createdAt
        }) {
          movie {
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
    `

    const variables = {
      name: filmData.name,
      createdAt: new Date().toISOString(),
    }

    if (filmData.description) variables.description = filmData.description
    if (filmData.duration && filmData.duration >= 30) variables.duration = parseInt(filmData.duration)
    if (filmData.image) variables.image = filmData.image
    if (filmData.releaseDate) variables.releaseData = filmData.releaseDate

    if (filmData.director && filmData.director !== 'null' && filmData.director !== null) {
      variables.director = filmData.director
    }

    if (filmData.nbEntries && filmData.nbEntries > 0) variables.nbEntries = parseInt(filmData.nbEntries)
    if (filmData.url) variables.url = filmData.url
    if (filmData.budget && filmData.budget > 0) variables.budget = parseFloat(filmData.budget)

    const data = await graphqlRequest(mutation, variables)
    const movie = data.createMovie.movie

    const idMatch = movie.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : movie.id

    let finalMovie = movie
    if (filmData.categories && filmData.categories.length > 0) {
      const validCategories = filmData.categories.filter(cat => cat && cat !== 'null' && cat !== '' && cat !== null)
      if (validCategories.length > 0) {
        const updateData = await this.updateFilm(movie.id, { categories: validCategories })
        finalMovie = updateData
      }
    }

    return {
      id: numericId,
      iriId: finalMovie.iriId || movie.id,
      title: finalMovie.name || movie.name,
      name: finalMovie.name || movie.name,
      description: finalMovie.description || movie.description,
      duration: finalMovie.duration || movie.duration,
      poster: finalMovie.image || movie.image,
      image: finalMovie.image || movie.image,
      createdAt: finalMovie.createdAt || movie.createdAt,
      releaseDate: finalMovie.releaseData || movie.releaseData,
      director: finalMovie.director || movie.director,
      categories: finalMovie.categories || [],
      nbEntries: finalMovie.nbEntries || movie.nbEntries,
      url: finalMovie.url || movie.url,
      budget: finalMovie.budget || movie.budget,
    }
  },

  async updateFilm(id, filmData) {
    const mutation = `
      mutation updateMovie($id: ID!, $name: String, $description: String, $duration: Int, $image: String, $releaseData: String, $director: String, $categories: [String], $nbEntries: Int, $url: String, $budget: Float) {
        updateMovie(input: {
          id: $id,
          name: $name,
          description: $description,
          duration: $duration,
          image: $image,
          releaseData: $releaseData,
          director: $director,
          categories: $categories,
          nbEntries: $nbEntries,
          url: $url,
          budget: $budget
        }) {
          movie {
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
    `

    const iriId = id.startsWith('/api/') ? id : `/api/movies/${id}`

    const variables = {
      id: iriId,
      name: filmData.name,
      description: filmData.description || null,
      duration: filmData.duration ? parseInt(filmData.duration) : null,
      image: filmData.image || null,
      releaseData: filmData.releaseDate || null,
      director: filmData.director || null,
      categories: filmData.categories || [],
      nbEntries: filmData.nbEntries ? parseInt(filmData.nbEntries) : null,
      url: filmData.url || null,
      budget: filmData.budget ? parseFloat(filmData.budget) : null,
    }

    const data = await graphqlRequest(mutation, variables)
    const movie = data.updateMovie.movie

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

  async deleteFilm(id) {
    // On ne demande rien d'autre que clientMutationId
    const mutation = `
      mutation deleteMovie($input: deleteMovieInput!) {
        deleteMovie(input: $input) {
          clientMutationId
        }
      }
    `;

    const iriId = id.startsWith('/api/') ? id : `/api/movies/${id}`;

    try {
      const data = await graphqlRequest(mutation, {
        input: { id: iriId }
      });
      return data.deleteMovie;
    } catch (error) {
      // Si l'erreur "Cannot query field id" persiste, c'est que le code
      // exécuté n'est pas celui-ci. Vérifiez la sauvegarde du fichier.
      console.error("Erreur suppression film:", error);
      throw error;
    }
  },

  async searchFilms(query) {
    const films = await this.getFilms()
    return films.filter(film =>
        film.title.toLowerCase().includes(query.toLowerCase())
    )
  },
}