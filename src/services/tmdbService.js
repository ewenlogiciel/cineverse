import axios from 'axios'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'fr-FR',
  },
})

// Désactiver TMDB si pas de clé API
const isTMDBEnabled = () => !!TMDB_API_KEY

export default {
  /**
   * Rechercher un film sur TMDB
   */
  async searchMovie(query) {
    if (!isTMDBEnabled()) {
      console.warn('TMDB API key not configured')
      return []
    }

    try {
      const response = await tmdbClient.get('/search/movie', {
        params: { query },
      })
      return response.data.results
    } catch (error) {
      console.error('TMDB Search Error:', error)
      return []
    }
  },

  /**
   * Récupérer les détails d'un film TMDB
   */
  async getMovieDetails(tmdbId) {
    try {
      const response = await tmdbClient.get(`/movie/${tmdbId}`)
      return response.data
    } catch (error) {
      console.error('TMDB Details Error:', error)
      return null
    }
  },

  /**
   * Obtenir l'URL complète d'une affiche
   * @param {string} posterPath - Le chemin de l'affiche retourné par TMDB
   * @param {string} size - Taille (w92, w154, w185, w342, w500, w780, original)
   */
  getPosterUrl(posterPath, size = 'w500') {
    if (!posterPath) return null
    return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`
  },

  /**
   * Obtenir l'URL complète d'un backdrop
   */
  getBackdropUrl(backdropPath, size = 'w1280') {
    if (!backdropPath) return null
    return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`
  },
}
