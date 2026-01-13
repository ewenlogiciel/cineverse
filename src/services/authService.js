import { restClient } from './api'

export default {
  async login(credentials) {
    const response = await restClient.post('https://mmi23f04.mmi-troyes.fr/wr506d/auth', credentials)
    return response.data
  },

  async register(userData) {
    // TODO: Créer l'endpoint /register côté backend Symfony
    const response = await restClient.post('https://mmi23f04.mmi-troyes.fr/wr506d/register', userData)
    return response.data
  },

  async getCurrentUser() {
    const response = await restClient.get('https://mmi23f04.mmi-troyes.fr/wr506d/user')
    return response.data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}
