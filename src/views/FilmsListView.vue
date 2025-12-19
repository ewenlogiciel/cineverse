<template>
  <div>
    <div class="mb-12">
      <h1 class="text-5xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent mb-8">
        Découvrez nos Films
      </h1>

      <!-- Barre de recherche et filtres -->
      <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl p-6 mb-8 backdrop-blur-sm">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Recherche -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Rechercher un film
            </label>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Titre, description..."
              class="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
              @input="handleSearch"
            />
          </div>

          <!-- Filtre par auteur -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Auteur
            </label>
            <select
              v-model="filters.author"
              class="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white transition-all"
              @change="applyFilters"
            >
              <option value="" class="bg-gray-900">Tous les auteurs</option>
              <option v-for="author in authors" :key="author.id" :value="author.id" class="bg-gray-900">
                {{ author.username || author.email }}
              </option>
            </select>
          </div>

          <!-- Tri par date -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Trier par
            </label>
            <select
              v-model="filters.sortBy"
              class="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white transition-all"
              @change="applyFilters"
            >
              <option value="recent" class="bg-gray-900">Plus récents</option>
              <option value="oldest" class="bg-gray-900">Plus anciens</option>
              <option value="rating" class="bg-gray-900">Meilleures notes</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="filmsStore.loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        <div class="text-gray-400 text-lg">Chargement des films...</div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="filmsStore.error" class="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg backdrop-blur-sm">
      {{ filmsStore.error }}
    </div>

    <!-- Films grid -->
    <div v-else-if="filmsStore.films.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <FilmCard v-for="film in filmsStore.films" :key="film.id" :film="film" />
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-20">
      <div class="text-6xl mb-4">🎬</div>
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
