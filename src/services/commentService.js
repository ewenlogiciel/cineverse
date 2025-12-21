import axios from 'axios'

export default {
  async getComments(filmId) {
    try {
      const response = await axios.get('/api/comments')
      // Sécurité : on s'assure que items est toujours un tableau
      const items = response.data['hydra:member'] || response.data || []

      if (!Array.isArray(items)) return []

      // On filtre pour ne garder que les commentaires du film actuel
      return items.filter(c => {
        const movieIri = `/api/movies/${filmId}`
        return c.movie === movieIri || (c.movie && c.movie.id == filmId)
      })
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires", error)
      return []
    }
  },

  async createComment(commentData) {
    const response = await axios.post('/api/comments', commentData, {
      headers: {
        'Content-Type': 'application/ld+json'
      }
    })
    return response.data
  },

  async deleteComment(id) {
    const commentId = id.toString().split('/').pop()
    await axios.delete(`/api/comments/${commentId}`)
  }
}