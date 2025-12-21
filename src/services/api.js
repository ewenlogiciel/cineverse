import axios from 'axios'

// Utilise les chemins relatifs car Vite proxy redirige automatiquement vers le backend
const API_BASE_URL = ''
const GRAPHQL_ENDPOINT = import.meta.env.VITE_API_BASE_URL || '/api/graphql'

// Client REST pour l'authentification
export const restClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Client GraphQL pour les requêtes GraphQL
const graphqlClient = axios.create({
  baseURL: GRAPHQL_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Fonction pour gérer les erreurs d'authentification
const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
  return Promise.reject(error)
}

// Intercepteur pour ajouter le token JWT à chaque requête REST
restClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercepteur pour gérer les erreurs de réponse REST
restClient.interceptors.response.use(
  (response) => response,
  handleAuthError
)

// Intercepteur pour ajouter le token JWT à chaque requête GraphQL
graphqlClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Intercepteur pour gérer les erreurs de réponse GraphQL
graphqlClient.interceptors.response.use(
  (response) => response,
  handleAuthError
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
