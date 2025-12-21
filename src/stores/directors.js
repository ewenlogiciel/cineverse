import { defineStore } from 'pinia'
import { ref } from 'vue'
import directorService from '@/services/directorService'

export const useDirectorsStore = defineStore('directors', () => {
  const directors = ref([])
  const currentDirector = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchDirectors = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      directors.value = await directorService.getDirectors(params)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchDirector = async (id) => {
    loading.value = true
    error.value = null
    try {
      currentDirector.value = await directorService.getDirector(id)
      return currentDirector.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createDirector = async (directorData) => {
    loading.value = true
    error.value = null
    try {
      const newDirector = await directorService.createDirector(directorData)
      directors.value.unshift(newDirector)
      return newDirector
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDirector = async (id, directorData) => {
    loading.value = true
    error.value = null
    try {
      const updatedDirector = await directorService.updateDirector(id, directorData)
      const index = directors.value.findIndex(d => d.id === id)
      if (index !== -1) {
        directors.value[index] = updatedDirector
      }
      if (currentDirector.value?.id === id) {
        currentDirector.value = updatedDirector
      }
      return updatedDirector
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteDirector = async (id) => {
    loading.value = true
    error.value = null
    try {
      await directorService.deleteDirector(id)
      directors.value = directors.value.filter(d => d.id !== id)
      if (currentDirector.value?.id === id) {
        currentDirector.value = null
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    directors,
    currentDirector,
    loading,
    error,
    fetchDirectors,
    fetchDirector,
    createDirector,
    updateDirector,
    deleteDirector,
  }
})
