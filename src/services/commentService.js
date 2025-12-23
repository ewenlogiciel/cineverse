import axios from 'axios'

export default {
  async getComments(filmId) {
    try {
      console.log('🌐 API: Récupération de /api/comments pour filmId:', filmId)
      const response = await axios.get('/api/comments')
      console.log('🌐 API: Réponse brute:', response.data)

      // Sécurité : on s'assure que items est toujours un tableau
      const items = response.data['hydra:member'] || response.data.member || []
      console.log('📦 Tous les commentaires:', items)

      if (!Array.isArray(items)) return []

      // On filtre pour ne garder que les commentaires du film actuel
      const movieIri = `/api/movies/${filmId}`
      console.log('🎯 Filtrage pour movie IRI:', movieIri)

      const filtered = items.filter(c => {
        console.log('🔎 Commentaire:', c.id, 'movie:', c.movie, 'user:', c.user, 'match?', c.movie === movieIri || (c.movie && c.movie.id == filmId))
        return c.movie === movieIri || (c.movie && c.movie.id == filmId)
      })

      console.log('✅ Commentaires filtrés:', filtered)
      return filtered
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