import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  // Initialiser depuis le localStorage au chargement
  const initAuth = () => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser && savedUser !== 'undefined') {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
      } catch (error) {
        console.error('Erreur lors de la lecture du localStorage:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  }

  const isAuthenticated = computed(() => !!token.value)

  const isAdmin = computed(() => {
    return user.value?.roles?.includes('ROLE_ADMIN') || false
  })

  const isEditor = computed(() => {
    return user.value?.roles?.includes('ROLE_EDITOR') ||
           user.value?.roles?.includes('ROLE_ADMIN') || false
  })

  const hasRole = (role) => {
    return user.value?.roles?.includes(role) || false
  }

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = response.user

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      token.value = response.token
      user.value = response.user

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))

      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    token.value = null
    user.value = null
  }

  const fetchUser = async () => {
    try {
      const userData = await authService.getCurrentUser()
      user.value = userData
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error) {
      logout()
      throw error
    }
  }

  // Initialiser au chargement du store
  initAuth()

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isEditor,
    hasRole,
    login,
    register,
    logout,
    fetchUser,
  }
})
