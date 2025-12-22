import { defineStore } from 'pinia'
import { ref } from 'vue'
import filmService from '@/services/filmService'

export const useFilmsStore = defineStore('films', () => {
  const films = ref([])
  const currentFilm = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /**
   * Fonction principale pour récupérer les films.
   * Elle gère à la fois le chargement initial, la recherche et les filtres.
   * @param {Object} params - { search: string, director: string|int, sort: 'asc'|'desc' }
   */
  const fetchFilms = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      // On appelle le service qui va construire la requête GraphQL
      // avec les bons filtres (name, director, order)
      films.value = await filmService.getFilms(params)
    } catch (err) {
      error.value = err.message || "Une erreur est survenue lors du chargement des films."
      // On log l'erreur pour le débogage mais on évite de faire planter l'app
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Alias pour la recherche textuelle simple.
   * Redirige vers fetchFilms pour utiliser la même logique centrale.
   */
  const searchFilms = async (query) => {
    return fetchFilms({ search: query })
  }

  const fetchFilm = async (id) => {
    loading.value = true
    error.value = null
    try {
      currentFilm.value = await filmService.getFilm(id)
      return currentFilm.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createFilm = async (filmData) => {
    loading.value = true
    error.value = null
    try {
      const newFilm = await filmService.createFilm(filmData)
      films.value.unshift(newFilm)
      return newFilm
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateFilm = async (id, filmData) => {
    loading.value = true
    error.value = null
    try {
      const updatedFilm = await filmService.updateFilm(id, filmData)
      // Mise à jour locale de la liste pour éviter de recharger
      const index = films.value.findIndex(f => f.id === id)
      if (index !== -1) {
        films.value[index] = updatedFilm
      }
      // Mise à jour du film courant s'il est affiché
      if (currentFilm.value?.id === id) {
        currentFilm.value = updatedFilm
      }
      return updatedFilm
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteFilm = async (id) => {
    loading.value = true
    error.value = null
    try {
      await filmService.deleteFilm(id)
      // Suppression locale
      films.value = films.value.filter(f => f.id !== id)
      if (currentFilm.value?.id === id) {
        currentFilm.value = null
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    films,
    currentFilm,
    loading,
    error,
    fetchFilms,
    searchFilms, // Gardé pour compatibilité, mais utilise fetchFilms en interne
    fetchFilm,
    createFilm,
    updateFilm,
    deleteFilm,
  }
})