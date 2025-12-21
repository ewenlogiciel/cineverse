<template>
  <div class="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 transform hover:-translate-y-2">
    <div class="relative aspect-[2/3] bg-black overflow-hidden flex items-center justify-center">
      <img
          v-if="posterUrl"
          :src="posterUrl"
          :alt="film.title"
          class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          @error="imageError = true"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
        <span class="text-gray-600 text-7xl">Pas de poster trouvé</span>
      </div>

      <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>

    </div>

    <div class="p-6">
      <h3 class="text-2xl font-bold text-white mb-3 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
        {{ film.title }}
      </h3>

      <p v-if="film.description" class="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed h-10">
        {{ film.description }}
      </p>

      <div class="flex items-center flex-wrap gap-2 mb-4 h-14 overflow-hidden">
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
          <span class="truncate max-w-[100px]">{{ film.author.username || film.author.email }}</span>
        </span>
      </div>

      <div v-if="film.ratingsCount" class="text-xs text-gray-500 mb-4">
        {{ film.ratingsCount }} avis
      </div>

      <router-link
          :to="`/films/${film.id}`"
          class="block w-full text-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-red-900/20"
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
  displayCategories.value = props.film.categories?.slice(0, 3) || []

  // Ignorer les URLs placeholder et les URLs invalides
  const hasValidPoster = props.film.poster &&
                        !props.film.poster.includes('placeholder') &&
                        !props.film.poster.includes('via.placeholder')

  if (hasValidPoster) {
    posterUrl.value = props.film.poster
    return
  }

  // Chercher sur TMDB
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
    month: 'short',
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