import axios from 'axios'

const GRAPHQL_ENDPOINT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8319/api/graphql'

// Client GraphQL
const graphqlClient = axios.create({
  baseURL: GRAPHQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token JWT à chaque requête
graphqlClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs de réponse
graphqlClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Fonction helper pour faire des requêtes GraphQL
export const graphqlRequest = async (query, variables = {}) => {
  try {
    console.log('GraphQL Request:', { query, variables })

    const response = await graphqlClient.post('', {
      query,
      variables,
    })

    console.log('GraphQL Response:', response.data)

    if (response.data.errors) {
      console.error('GraphQL Errors:', response.data.errors)
      throw new Error(response.data.errors[0].message)
    }

    return response.data.data
  } catch (error) {
    console.error('GraphQL Error:', error)
    if (error.response) {
      console.error('Error Response:', error.response.data)
    }
    throw error
  }
}

export default graphqlClient
