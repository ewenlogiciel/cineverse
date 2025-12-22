<template>
  <router-link
      :to="`/films/${film.id}`"
      class="group block relative bg-gray-900 rounded-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-900/20 hover:ring-2 hover:ring-red-500/50"
  >
    <div class="relative aspect-[2/3] w-full bg-gray-800">

      <img
          v-if="posterUrl"
          :src="posterUrl"
          :alt="film.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:contrast-110"
          @error="imageError = true"
      />

      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-700">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
      </div>

      <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>

      <div class="absolute bottom-0 left-0 right-0 p-4">
        <h3 class="text-white font-bold text-sm md:text-base leading-tight text-center drop-shadow-md group-hover:text-red-400 transition-colors line-clamp-2">
          {{ film.title }}
        </h3>
      </div>

    </div>
  </router-link>
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

onMounted(async () => {
  // Ignorer les URLs placeholder et les URLs invalides de base
  const hasValidPoster = props.film.poster &&
      !props.film.poster.includes('placeholder') &&
      !props.film.poster.includes('via.placeholder')

  if (hasValidPoster) {
    posterUrl.value = props.film.poster
    return
  }

  // Chercher le poster sur TMDB si on ne l'a pas
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
</script>