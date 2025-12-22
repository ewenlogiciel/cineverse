<template>
  <div class="min-h-screen bg-black text-white pb-20 max-w-[90rem] mx-auto">

    <div v-if="filmsStore.loading && !filmsStore.films.length" class="flex justify-center items-center h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
    </div>

    <div v-else-if="filmsStore.error" class="pt-24 px-8">
      <div class="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
        {{ filmsStore.error }}
      </div>
    </div>

    <div v-else>

      <div v-if="featuredFilm" class="relative h-[80vh] w-full mb-8 group rounded-2xl overflow-hidden">

        <div class="absolute inset-0">
          <img
              v-if="heroBackdrop"
              :src="heroBackdrop"
              class="w-full h-full object-cover object-center"
              alt="Featured Film"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        </div>

        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <div class="absolute bottom-[20%] left-4 md:left-12 max-w-2xl z-10 space-y-4 px-4">
          <h1 class="text-4xl md:text-6xl font-bold text-white mb-3 truncate drop-shadow-lg leading-tight">
            {{ featuredFilm.name }}
          </h1>

          <div class="flex items-center space-x-4 text-sm md:text-base text-gray-300 font-medium">
      <span v-if="featuredFilm.releaseData" class="text-green-400">
        {{ new Date(featuredFilm.releaseData).getFullYear() }}
      </span>
            <span v-if="featuredFilm.duration">{{ featuredFilm.duration }} min</span>
          </div>

          <p class="text-gray-300 text-sm md:text-lg line-clamp-3 drop-shadow-md max-w-xl">
            {{ featuredFilm.description }}
          </p>

          <div class="flex flex-wrap gap-4 pt-4">
            <router-link
                :to="`/films/${featuredFilm.id}`"
                class="flex items-center bg-white/5 border border-gray-700 rounded text-sm text-gray-400 py-3 px-6 font-medium transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            >
              <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Plus d'infos
            </router-link>
          </div>
        </div>
      </div>

      <div class=" -mt-24 relative z-20 space-y-12">

        <div>
          <h2 class="text-xl md:text-2xl font-bold text-white mb-4">
            Films à l'affiche
          </h2>

          <div class="flex overflow-x-auto space-x-4 pb-12 pt-4 px-2 no-scrollbar snap-x snap-mandatory">
            <div
                v-for="film in filmsStore.films"
                :key="film.id"
                class="flex-none w-[160px] md:w-[220px] snap-start"
            >
              <FilmCard :film="film" class="h-full" />
            </div>
          </div>
        </div>

        <div v-if="filmsStore.films.length === 0" class="text-center py-20">
          <p class="text-gray-400 text-2xl mb-2">Aucun film trouvé</p>
          <p class="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useFilmsStore } from '@/stores/films'
import tmdbService from '@/services/tmdbService'
import FilmCard from '@/components/FilmCard.vue'

const filmsStore = useFilmsStore()
const featuredFilm = ref(null)
const heroBackdrop = ref(null)

onMounted(async () => {
  if (filmsStore.films.length === 0) {
    await filmsStore.fetchFilms()
  }
  setFeaturedFilm()
})

watch(() => filmsStore.films, () => {
  setFeaturedFilm()
})

const setFeaturedFilm = async () => {
  if (filmsStore.films.length > 0) {
    featuredFilm.value = filmsStore.films[0]

    try {
      if (featuredFilm.value.name) {
        const results = await tmdbService.searchMovie(featuredFilm.value.name)
        if (results && results.length > 0 && results[0].backdrop_path) {
          heroBackdrop.value = `https://image.tmdb.org/t/p/original${results[0].backdrop_path}`
        } else {
          heroBackdrop.value = null
        }
      }
    } catch (e) {
      console.error("Erreur récupération backdrop TMDB", e)
      heroBackdrop.value = null
    }
  } else {
    featuredFilm.value = null
  }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>