import { graphqlRequest } from './api'

export default {
  async getActors(params = {}) {
    const query = `
      query {
        actors {
          edges {
            node {
              id
              lastname
              firstname
              dob
              dod
              bio
              photo
              createdAt
            }
          }
        }
      }
    `

    const data = await graphqlRequest(query)
    return data.actors.edges.map(edge => {
      const idMatch = edge.node.id.match(/\/(\d+)$/)
      const numericId = idMatch ? idMatch[1] : edge.node.id

      return {
        id: numericId,
        iriId: edge.node.id,
        lastname: edge.node.lastname,
        firstname: edge.node.firstname,
        dob: edge.node.dob,
        dod: edge.node.dod,
        bio: edge.node.bio,
        photo: edge.node.photo,
        createdAt: edge.node.createdAt,
      }
    })
  },

  async getActor(id) {
    const query = `
      query getActor($id: ID!) {
        actor(id: $id) {
          id
          lastname
          firstname
          dob
          dod
          bio
          photo
          createdAt
        }
      }
    `

    const iriId = id.startsWith('/api/') ? id : `/api/actors/${id}`
    const data = await graphqlRequest(query, { id: iriId })
    const actor = data.actor

    const idMatch = actor.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : actor.id

    return {
      id: numericId,
      iriId: actor.id,
      lastname: actor.lastname,
      firstname: actor.firstname,
      dob: actor.dob,
      dod: actor.dod,
      bio: actor.bio,
      photo: actor.photo,
      createdAt: actor.createdAt,
    }
  },

  async createActor(actorData) {
    const mutation = `
      mutation createActor($lastname: String!, $firstname: String, $dob: String, $dod: String, $bio: String, $createdAt: String!) {
        createActor(input: {
          lastname: $lastname,
          firstname: $firstname,
          dob: $dob,
          dod: $dod,
          bio: $bio,
          createdAt: $createdAt
        }) {
          actor {
            id
            lastname
            firstname
            dob
            dod
            bio
            createdAt
          }
        }
      }
    `

    const variables = {
      lastname: actorData.lastname,
      firstname: actorData.firstname || null,
      dob: actorData.dob || null,
      dod: actorData.dod || null,
      bio: actorData.bio || null,
      // On génère la date ici pour satisfaire l'obligation String! du schéma
      createdAt: new Date().toISOString()
    }

    const data = await graphqlRequest(mutation, variables)
    const actor = data.createActor.actor

    const idMatch = actor.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : actor.id

    return {
      id: numericId,
      iriId: actor.id,
      lastname: actor.lastname,
      firstname: actor.firstname,
      dob: actor.dob,
      dod: actor.dod,
      bio: actor.bio,
      createdAt: actor.createdAt,
    }
  },

  async updateActor(id, actorData) {
    const mutation = `
      mutation updateActor($id: ID!, $lastname: String, $firstname: String, $dob: String, $dod: String, $bio: String) {
        updateActor(input: {
          id: $id,
          lastname: $lastname,
          firstname: $firstname,
          dob: $dob,
          dod: $dod,
          bio: $bio
        }) {
          actor {
            id
            lastname
            firstname
            dob
            dod
            bio
            createdAt
          }
        }
      }
    `

    const iriId = id.startsWith('/api/') ? id : `/api/actors/${id}`

    const variables = {
      id: iriId,
      lastname: actorData.lastname,
      firstname: actorData.firstname || null,
      dob: actorData.dob || null,
      dod: actorData.dod || null,
      bio: actorData.bio || null
    }

    const data = await graphqlRequest(mutation, variables)
    const actor = data.updateActor.actor

    const idMatch = actor.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : actor.id

    return {
      id: numericId,
      iriId: actor.id,
      lastname: actor.lastname,
      firstname: actor.firstname,
      dob: actor.dob,
      dod: actor.dod,
      bio: actor.bio,
      createdAt: actor.createdAt,
    }
  },

  async deleteActor(id) {
    const mutation = `
      mutation deleteActor($input: deleteActorInput!) {
        deleteActor(input: $input) {
          clientMutationId
        }
      }
    `

    const iriId = id.startsWith('/api/') ? id : `/api/actors/${id}`

    try {
      const data = await graphqlRequest(mutation, {
        input: { id: iriId }
      })
      return data.deleteActor
    } catch (error) {
      console.error("Erreur lors de la suppression de l'acteur:", error)
      throw error
    }
  },
}