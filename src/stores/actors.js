import { defineStore } from 'pinia'
import { ref } from 'vue'
import actorService from '@/services/actorService'

export const useActorsStore = defineStore('actors', () => {
  const actors = ref([])
  const currentActor = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchActors = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      actors.value = await actorService.getActors(params)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchActor = async (id) => {
    loading.value = true
    error.value = null
    try {
      currentActor.value = await actorService.getActor(id)
      return currentActor.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createActor = async (actorData) => {
    loading.value = true
    error.value = null
    try {
      const newActor = await actorService.createActor(actorData)
      actors.value.unshift(newActor)
      return newActor
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateActor = async (id, actorData) => {
    loading.value = true
    error.value = null
    try {
      const updatedActor = await actorService.updateActor(id, actorData)
      const index = actors.value.findIndex(a => a.id === id)
      if (index !== -1) {
        actors.value[index] = updatedActor
      }
      if (currentActor.value?.id === id) {
        currentActor.value = updatedActor
      }
      return updatedActor
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteActor = async (id) => {
    loading.value = true
    error.value = null
    try {
      await actorService.deleteActor(id)
      actors.value = actors.value.filter(a => a.id !== id)
      if (currentActor.value?.id === id) {
        currentActor.value = null
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    actors,
    currentActor,
    loading,
    error,
    fetchActors,
    fetchActor,
    createActor,
    updateActor,
    deleteActor,
  }
})
