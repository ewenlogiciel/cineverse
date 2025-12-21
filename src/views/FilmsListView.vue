<template>
  <div class="max-w-[90rem] mx-auto px-4 py-8">

    <div v-if="filmsStore.loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        <div class="text-gray-400 text-lg">Chargement des films...</div>
      </div>
    </div>

    <div v-else-if="filmsStore.error" class="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg backdrop-blur-sm">
      {{ filmsStore.error }}
    </div>

    <div v-else-if="filmsStore.films.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <FilmCard v-for="film in filmsStore.films" :key="film.id" :film="film" />
    </div>

    <div v-else class="text-center py-20">
      <p class="text-gray-400 text-2xl mb-2">Aucun film trouvé</p>
      <p class="text-gray-500">Essayez de modifier vos critères de recherche</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFilmsStore } from '@/stores/films'
import FilmCard from '@/components/FilmCard.vue'

const filmsStore = useFilmsStore()
const searchQuery = ref('')
const filters = ref({
  author: '',
  sortBy: 'recent',
})

const authors = ref([])

let searchTimeout = null

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (searchQuery.value.trim()) {
      filmsStore.searchFilms(searchQuery.value)
    } else {
      applyFilters()
    }
  }, 500)
}

const applyFilters = () => {
  const params = {}

  if (filters.value.author) {
    params.author = filters.value.author
  }

  if (filters.value.sortBy) {
    params.sort = filters.value.sortBy
  }

  filmsStore.fetchFilms(params)
}

onMounted(async () => {
  await filmsStore.fetchFilms()
  // TODO: Fetch authors list for filter
  // authors.value = await authService.getAuthors()
})
</script>
