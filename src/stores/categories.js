import { defineStore } from 'pinia'
import { ref } from 'vue'
import categoryService from '@/services/categoryService'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])
  const currentCategory = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchCategories = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      categories.value = await categoryService.getCategories(params)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCategory = async (id) => {
    loading.value = true
    error.value = null
    try {
      currentCategory.value = await categoryService.getCategory(id)
      return currentCategory.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (categoryData) => {
    loading.value = true
    error.value = null
    try {
      const newCategory = await categoryService.createCategory(categoryData)
      categories.value.unshift(newCategory)
      return newCategory
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id, categoryData) => {
    loading.value = true
    error.value = null
    try {
      const updatedCategory = await categoryService.updateCategory(id, categoryData)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
      if (currentCategory.value?.id === id) {
        currentCategory.value = updatedCategory
      }
      return updatedCategory
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id) => {
    loading.value = true
    error.value = null
    try {
      await categoryService.deleteCategory(id)
      categories.value = categories.value.filter(c => c.id !== id)
      if (currentCategory.value?.id === id) {
        currentCategory.value = null
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    currentCategory,
    loading,
    error,
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
