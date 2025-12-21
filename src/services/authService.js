import { restClient } from './api'

export default {
  async login(credentials) {
    const response = await restClient.post('/auth', credentials)
    return response.data
  },

  async register(userData) {
    // TODO: Créer l'endpoint /register côté backend Symfony
    const response = await restClient.post('/register', userData)
    return response.data
  },

  async getCurrentUser() {
    const response = await restClient.get('/user')
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}
