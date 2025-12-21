import { graphqlRequest } from './api'

export default {
  async getDirectors(params = {}) {
    const query = `
      query {
        directors {
          edges {
            node {
              id
              lastname
              firstname
              dob
              dod
            }
          }
        }
      }
    `

    const data = await graphqlRequest(query)
    return data.directors.edges.map(edge => {
      const idMatch = edge.node.id.match(/\/(\d+)$/)
      const numericId = idMatch ? idMatch[1] : edge.node.id

      return {
        id: numericId,
        iriId: edge.node.id,
        lastname: edge.node.lastname,
        firstname: edge.node.firstname,
        dob: edge.node.dob,
        dod: edge.node.dod,
      }
    })
  },

  async getDirector(id) {
    const query = `
      query getDirector($id: ID!) {
        director(id: $id) {
          id
          lastname
          firstname
          dob
          dod
        }
      }
    `

    const iriId = id.startsWith('/api/') ? id : `/api/directors/${id}`
    const data = await graphqlRequest(query, { id: iriId })
    const director = data.director

    const idMatch = director.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : director.id

    return {
      id: numericId,
      iriId: director.id,
      lastname: director.lastname,
      firstname: director.firstname,
      dob: director.dob,
      dod: director.dod,
    }
  },

  async createDirector(directorData) {
    // Note: Ajout de createdAt si votre entité l'exige comme pour les Acteurs
    const mutation = `
      mutation createDirector($lastname: String!, $firstname: String!, $dob: String!, $dod: String, $createdAt: String!) {
        createDirector(input: {
          lastname: $lastname,
          firstname: $firstname,
          dob: $dob,
          dod: $dod,
          createdAt: $createdAt
        }) {
          director {
            id
            lastname
            firstname
            dob
            dod
          }
        }
      }
    `

    const variables = {
      lastname: directorData.lastname,
      firstname: directorData.firstname,
      dob: directorData.dob,
      dod: directorData.dod || null,
      createdAt: new Date().toISOString()
    }

    const data = await graphqlRequest(mutation, variables)
    const director = data.createDirector.director

    const idMatch = director.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : director.id

    return {
      id: numericId,
      iriId: director.id,
      lastname: director.lastname,
      firstname: director.firstname,
      dob: director.dob,
      dod: director.dod,
    }
  },

  async updateDirector(id, directorData) {
    const mutation = `
      mutation updateDirector($id: ID!, $lastname: String, $firstname: String, $dob: String, $dod: String) {
        updateDirector(input: {
          id: $id,
          lastname: $lastname,
          firstname: $firstname,
          dob: $dob,
          dod: $dod
        }) {
          director {
            id
            lastname
            firstname
            dob
            dod
          }
        }
      }
    `

    const iriId = id.startsWith('/api/') ? id : `/api/directors/${id}`

    const variables = {
      id: iriId,
      lastname: directorData.lastname,
      firstname: directorData.firstname,
      dob: directorData.dob,
      dod: directorData.dod || null,
    }

    const data = await graphqlRequest(mutation, variables)
    const director = data.updateDirector.director

    const idMatch = director.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : director.id

    return {
      id: numericId,
      iriId: director.id,
      lastname: director.lastname,
      firstname: director.firstname,
      dob: director.dob,
      dod: director.dod,
    }
  },

  // --- FONCTION CORRIGÉE ---
  async deleteDirector(id) {
    const mutation = `
      mutation deleteDirector($input: deleteDirectorInput!) {
        deleteDirector(input: $input) {
          clientMutationId
        }
      }
    `

    const iriId = id.startsWith('/api/') ? id : `/api/directors/${id}`

    try {
      const data = await graphqlRequest(mutation, {
        input: { id: iriId }
      })
      return data.deleteDirector
    } catch (error) {
      console.error("Erreur lors de la suppression du réalisateur:", error)
      throw error
    }
  }
}