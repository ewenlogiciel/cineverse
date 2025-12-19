import api from './api'

export default {
  async getComments(filmId) {
    const response = await api.get(`/films/${filmId}/comments`)
    return response.data
  },

  async createComment(filmId, commentData) {
    const response = await api.post(`/films/${filmId}/comments`, commentData)
    return response.data
  },

  async updateComment(commentId, commentData) {
    const response = await api.put(`/comments/${commentId}`, commentData)
    return response.data
  },

  async deleteComment(commentId) {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
  },
}
