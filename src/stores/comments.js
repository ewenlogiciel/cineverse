import { defineStore } from 'pinia'
import { ref } from 'vue'
import commentService from '@/services/commentService'

export const useCommentsStore = defineStore('comments', () => {
  const comments = ref([])
  const currentComment = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchComments = async () => {
    loading.value = true
    error.value = null
    try {
      comments.value = await commentService.getAllComments()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchComment = async (id) => {
    loading.value = true
    error.value = null
    try {
      currentComment.value = await commentService.getComment(id)
      return currentComment.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createComment = async (commentData) => {
    loading.value = true
    error.value = null
    try {
      const newComment = await commentService.createComment(commentData)
      comments.value.unshift(newComment)
      return newComment
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateComment = async (id, commentData) => {
    loading.value = true
    error.value = null
    try {
      const updatedComment = await commentService.updateComment(id, commentData)
      const index = comments.value.findIndex(c => c.id === id || c['@id'] === id)
      if (index !== -1) {
        comments.value[index] = updatedComment
      }
      if (currentComment.value?.id === id || currentComment.value?.['@id'] === id) {
        currentComment.value = updatedComment
      }
      return updatedComment
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteComment = async (id) => {
    loading.value = true
    error.value = null
    try {
      await commentService.deleteComment(id)
      comments.value = comments.value.filter(c => c.id !== id && c['@id'] !== id)
      if (currentComment.value?.id === id || currentComment.value?.['@id'] === id) {
        currentComment.value = null
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    comments,
    currentComment,
    loading,
    error,
    fetchComments,
    fetchComment,
    createComment,
    updateComment,
    deleteComment,
  }
})
