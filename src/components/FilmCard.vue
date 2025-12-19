<template>
  <div class="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 transform hover:-translate-y-2">
    <div class="relative h-80 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
      <img
        v-if="posterUrl"
        :src="posterUrl"
        :alt="film.title"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        @error="imageError = true"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <span class="text-gray-600 text-7xl">🎬</span>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>

      <!-- Rating badge -->
      <div v-if="film.averageRating" class="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-1">
        <span class="text-yellow-400 text-lg">⭐</span>
        <span class="text-white font-bold">
          {{ film.averageRating ? film.averageRating.toFixed(1) : 'N/A' }}
        </span>
      </div>
    </div>

    <div class="p-6">
      <h3 class="text-2xl font-bold text-white mb-3 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
        {{ film.title }}
      </h3>

      <p v-if="film.description" class="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">
        {{ film.description }}
      </p>

      <div class="flex items-center flex-wrap gap-2 mb-4">
        <span
          v-for="category in displayCategories"
          :key="category.id"
          class="px-2 py-1 bg-white/5 border border-gray-700 rounded text-xs text-gray-400"
        >
          {{ category.name }}
        </span>
      </div>

      <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span v-if="film.releaseDate" class="flex items-center space-x-1">
          <span>{{ formatDate(film.releaseDate) }}</span>
        </span>
        <span v-if="film.author" class="flex items-center space-x-1">
          <span>✍️</span>
          <span>{{ film.author.username || film.author.email }}</span>
        </span>
      </div>

      <div v-if="film.ratingsCount" class="text-xs text-gray-500 mb-4">
        {{ film.ratingsCount }} avis
      </div>

      <router-link
        :to="`/films/${film.id}`"
        class="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105"
      >
        Voir les détails
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue'
import tmdbService from '@/services/tmdbService'

const props = defineProps({
  film: {
    type: Object,
    required: true,
  },
})

const posterUrl = ref(null)
const imageError = ref(false)

const displayCategories = ref([])

onMounted(async () => {
  // Limiter à 3 catégories max pour l'affichage
  displayCategories.value = props.film.categories?.slice(0, 3) || []

  // Si le film a déjà un poster, l'utiliser
  if (props.film.poster) {
    posterUrl.value = props.film.poster
    return
  }

  // Sinon, chercher sur TMDB
  try {
    const results = await tmdbService.searchMovie(props.film.title)
    if (results && results.length > 0) {
      const tmdbPoster = tmdbService.getPosterUrl(results[0].poster_path)
      if (tmdbPoster) {
        posterUrl.value = tmdbPoster
      }
    }
  } catch (error) {
    console.error('Error fetching TMDB poster:', error)
  }
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
