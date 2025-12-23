import { graphqlRequest } from './api'

export default {
  /**
   * Récupère la liste de tous les utilisateurs
   */
  async getUsers(params = {}) {
    const query = `
      query {
        users {
          edges {
            node {
              id
              email
              roles
              apiRateLimit
              apiRateLimitInterval
            }
          }
        }
      }
    `

    const data = await graphqlRequest(query)
    return data.users.edges.map(edge => {
      const idMatch = edge.node.id.match(/\/(\d+)$/)
      const numericId = idMatch ? idMatch[1] : edge.node.id

      return {
        id: numericId,
        iriId: edge.node.id,
        email: edge.node.email,
        roles: edge.node.roles,
        apiRateLimit: edge.node.apiRateLimit,
        apiRateLimitInterval: edge.node.apiRateLimitInterval,
      }
    })
  },

  /**
   * Récupère un utilisateur spécifique par son ID
   */
  async getUser(id) {
    if (!id) return null

    const query = `
      query getUser($id: ID!) {
        user(id: $id) {
          id
          email
          roles
          apiRateLimit
          apiRateLimitInterval
        }
      }
    `

    const iriId = id.startsWith('/api/') ? id : `/api/users/${id}`
    const data = await graphqlRequest(query, { id: iriId })
    const user = data.user

    const idMatch = user.id.match(/\/(\d+)$/)
    const numericId = idMatch ? idMatch[1] : user.id

    return {
      id: numericId,
      iriId: user.id,
      email: user.email,
      roles: user.roles,
      apiRateLimit: user.apiRateLimit,
      apiRateLimitInterval: user.apiRateLimitInterval,
    }
  },

// src/services/userService.js

  async createUser(userData) {
    const mutation = `
    mutation createUser($input: createUserInput!) {
      createUser(input: $input) {
        user {
          id
          email
          roles
        }
      }
    }
  `;

    const variables = {
      input: {
        email: userData.email,
        // On envoie les deux pour satisfaire GraphQL ET le processeur PHP
        password: userData.password,
        plainPassword: userData.password,
        roles: userData.roles || ["ROLE_USER"],
        apiRateLimit: parseInt(userData.apiRateLimit) || 5000,
        apiRateLimitInterval: userData.apiRateLimitInterval || '1 hour'
      }
    };

    const data = await graphqlRequest(mutation, variables);
    const user = data.createUser.user;

    const idMatch = user.id.match(/\/(\d+)$/);
    return {
      id: idMatch ? idMatch[1] : user.id,
      iriId: user.id,
      email: user.email,
      roles: user.roles,
      apiRateLimit: user.apiRateLimit,
      apiRateLimitInterval: user.apiRateLimitInterval,
    }
  },

  /**
   * Met à jour un utilisateur existant
   */
  async updateUser(id, userData) {
    const mutation = `
      mutation updateUser($id: ID!, $email: String, $roles: Iterable, $apiRateLimit: Int, $apiRateLimitInterval: String) {
        updateUser(input: {
          id: $id,
          email: $email,
          roles: $roles,
          apiRateLimit: $apiRateLimit,
          apiRateLimitInterval: $apiRateLimitInterval
        }) {
          user {
            id
            email
            roles
            apiRateLimit
            apiRateLimitInterval
          }
        }
      }
    `

    const iriId = id.startsWith('/api/') ? id : `/api/users/${id}`

    const variables = {
      id: iriId,
      email: userData.email,
      roles: userData.roles,
      apiRateLimit: parseInt(userData.apiRateLimit),
      apiRateLimitInterval: userData.apiRateLimitInterval,
    }

    const data = await graphqlRequest(mutation, variables)
    const user = data.updateUser.user

    const idMatch = user.id.match(/\/(\d+)$/)
    return {
      id: idMatch ? idMatch[1] : user.id,
      iriId: user.id,
      email: user.email,
      roles: user.roles,
      apiRateLimit: user.apiRateLimit,
      apiRateLimitInterval: user.apiRateLimitInterval,
    }
  },

  /**
   * Supprime un utilisateur
   */
  async deleteUser(id) {
    const mutation = `
      mutation deleteUser($input: deleteUserInput!) {
        deleteUser(input: $input) {
          clientMutationId
        }
      }
    `

    const iriId = id.startsWith('/api/') ? id : `/api/users/${id}`

    try {
      const data = await graphqlRequest(mutation, {
        input: { id: iriId }
      })
      return data.deleteUser
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error)
      throw error
    }
  }
}