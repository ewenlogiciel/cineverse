import api from './api'

export default {
  async rateFilm(filmId, rating) {
    const response = await api.post(`/films/${filmId}/rate`, { rating })
    return response.data
  },

  async getUserRating(filmId) {
    const response = await api.get(`/films/${filmId}/my-rating`)
    return response.data
  },
}
