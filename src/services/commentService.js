import axios from 'axios'

export default {
  // Récupère TOUS les commentaires (pour l'admin)
  async getAllComments() {
    try {
      const response = await axios.get('/api/comments')
      const items = response.data['hydra:member'] || response.data.member || []
      return Array.isArray(items) ? items : []
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires", error)
      return []
    }
  },

  // Récupère les commentaires d'un film spécifique (pour la page film)
  async getComments(filmId) {
    try {
      const response = await axios.get('/api/comments')
      const items = response.data['hydra:member'] || response.data.member || []

      if (!Array.isArray(items)) return []

      // Filtre pour ne garder que les commentaires du film actuel
      const movieIri = `/api/movies/${filmId}`
      return items.filter(c => {
        return c.movie === movieIri || (c.movie && c.movie.id == filmId)
      })
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires", error)
      return []
    }
  },

  // Récupère un commentaire spécifique
  async getComment(id) {
    try {
      const commentId = id.toString().split('/').pop()
      const response = await axios.get(`/api/comments/${commentId}`)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération du commentaire", error)
      throw error
    }
  },

  // Crée un nouveau commentaire
  async createComment(commentData) {
    const response = await axios.post('/api/comments', commentData, {
      headers: {
        'Content-Type': 'application/ld+json'
      }
    })
    return response.data
  },

  // Met à jour un commentaire
  async updateComment(id, commentData) {
    const commentId = id.toString().split('/').pop()
    const response = await axios.patch(`/api/comments/${commentId}`, commentData, {
      headers: {
        'Content-Type': 'application/merge-patch+json'
      }
    })
    return response.data
  },

  // Supprime un commentaire
  async deleteComment(id) {
    const commentId = id.toString().split('/').pop()
    await axios.delete(`/api/comments/${commentId}`)
  }
}