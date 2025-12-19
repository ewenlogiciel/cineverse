import { defineStore } from 'pinia'
import { ref } from 'vue'
import filmService from '@/services/filmService'

export const useFilmsStore = defineStore('films', () => {
  const films = ref([])
  const currentFilm = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchFilms = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      films.value = await filmService.getFilms(params)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
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
      const index = films.value.findIndex(f => f.id === id)
      if (index !== -1) {
        films.value[index] = updatedFilm
      }
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

  const searchFilms = async (query) => {
    loading.value = true
    error.value = null
    try {
      films.value = await filmService.searchFilms(query)
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
    fetchFilm,
    createFilm,
    updateFilm,
    deleteFilm,
    searchFilms,
  }
})
