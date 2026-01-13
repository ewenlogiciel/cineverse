<template>
  <div class="min-h-screen bg-black text-white pb-20">

    <div v-if="filmsStore.loading && !filmsStore.films.length" class="flex justify-center items-center h-screen">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
    </div>

    <div v-else-if="filmsStore.error" class="pt-24 px-8">
      <div class="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
        {{ filmsStore.error }}
      </div>
    </div>

    <div v-else class="pt-8 px-4">

      <h1 class="text-3xl md:text-4xl font-bold text-white mb-8">
        Films
      </h1>

      <div v-if="filmsStore.films.length > 0" data-test="movies-list" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <FilmCard v-for="film in filmsStore.films" :key="film.id" :film="film" />
      </div>

      <div v-if="filmsStore.films.length === 0" data-test="no-results" class="text-center py-20">
        <p class="text-gray-400 text-2xl mb-2">Aucun film trouvé</p>
        <p class="text-gray-500">Essayez de modifier vos critères de recherche</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useFilmsStore } from '@/stores/films'
import FilmCard from '@/components/FilmCard.vue'

const filmsStore = useFilmsStore()
const route = useRoute()

onMounted(async () => {
  await fetchFilmsWithParams()
})

// Observer les changements de paramètres dans l'URL
watch(() => route.query, async () => {
  await fetchFilmsWithParams()
}, { deep: true })

const fetchFilmsWithParams = async () => {
  const params = {
    search: route.query.search,
    director: route.query.director,
    sort: route.query.sort
  }
  await filmsStore.fetchFilms(params)
}
</script>
