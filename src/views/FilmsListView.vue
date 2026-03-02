<template>
  <div class="min-h-screen bg-black text-white pb-20">

    <div v-if="filmsStore.loading && !filmsStore.films.length" class="pt-8 px-4">
      <h1 class="text-3xl md:text-4xl font-bold text-white mb-8">Films</h1>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        <SkeletonFilmCard v-for="n in 12" :key="n" />
      </div>
    </div>

    <div v-else-if="filmsStore.error" class="pt-24 px-8">
      <div class="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg">
        {{ filmsStore.error }}
      </div>
    </div>

    <div v-else class="pt-8 px-4">

      <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">
        Films
      </h1>

      <!-- Filtres actifs (chips) -->
      <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2 mb-6">
        <span class="text-sm text-gray-400">Filtres actifs :</span>

        <span v-if="route.query.search" class="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-sm text-red-400">
          Recherche : {{ route.query.search }}
          <button @click="removeFilter('search')" class="ml-1 hover:text-white transition-colors">&times;</button>
        </span>

        <span v-if="route.query.director" class="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-sm text-red-400">
          Réalisateur : {{ directorName }}
          <button @click="removeFilter('director')" class="ml-1 hover:text-white transition-colors">&times;</button>
        </span>

        <span v-if="route.query.sort" class="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-sm text-red-400">
          Tri : {{ route.query.sort === 'asc' ? 'Plus ancien' : 'Plus récent' }}
          <button @click="removeFilter('sort')" class="ml-1 hover:text-white transition-colors">&times;</button>
        </span>

        <button @click="clearAllFilters" class="text-sm text-gray-500 hover:text-white transition-colors underline ml-2">
          Effacer les filtres
        </button>
      </div>

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
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFilmsStore } from '@/stores/films'
import { useDirectorsStore } from '@/stores/directors'
import FilmCard from '@/components/FilmCard.vue'
import SkeletonFilmCard from '@/components/SkeletonFilmCard.vue'

const filmsStore = useFilmsStore()
const directorsStore = useDirectorsStore()
const route = useRoute()
const router = useRouter()

const hasActiveFilters = computed(() => {
  return route.query.search || route.query.director || route.query.sort
})

const directorName = computed(() => {
  if (!route.query.director) return ''
  const director = directorsStore.directors.find(d => String(d.id) === String(route.query.director))
  return director ? `${director.firstname} ${director.lastname}` : `#${route.query.director}`
})

const removeFilter = (key) => {
  const query = { ...route.query }
  delete query[key]
  router.push({ path: '/films', query })
}

const clearAllFilters = () => {
  router.push({ path: '/films' })
}

onMounted(async () => {
  if (directorsStore.directors.length === 0) {
    directorsStore.fetchDirectors()
  }
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
