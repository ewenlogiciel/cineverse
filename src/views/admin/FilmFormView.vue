<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-5xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent mb-8">
      {{ isEditMode ? 'Modifier le film' : 'Nouveau film' }}
    </h1>

    <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg backdrop-blur-sm">
          {{ error }}
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-300 mb-2">
            Titre *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
            placeholder="Titre du film"
          />
        </div>

        <div>
          <label for="categories" class="block text-sm font-medium text-gray-300 mb-2">
            Catégories (IRI des catégories)
          </label>
          <input
            id="categories"
            v-model="categoriesInput"
            type="text"
            class="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
            placeholder="Ex: /api/categories/1, /api/categories/2"
          />
          <p class="text-xs text-gray-500 mt-1">Séparez les IRI par des virgules</p>
        </div>

        <div>
          <label for="releaseDate" class="block text-sm font-medium text-gray-300 mb-2">
            Date de création *
          </label>
          <input
            id="releaseDate"
            v-model="form.releaseDate"
            type="datetime-local"
            required
            class="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white transition-all"
          />
        </div>

        <div class="flex space-x-4 pt-4">
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            {{ loading ? 'Enregistrement...' : (isEditMode ? 'Mettre à jour' : 'Créer le film') }}
          </button>

          <router-link
            to="/admin"
            class="flex-1 bg-white/5 hover:bg-white/10 border border-gray-700 text-white py-3 px-4 rounded-lg font-medium text-center transition-all"
          >
            Annuler
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFilmsStore } from '@/stores/films'

const route = useRoute()
const router = useRouter()
const filmsStore = useFilmsStore()

const isEditMode = computed(() => !!route.params.id && route.params.id !== 'new')

const form = ref({
  title: '',
  categories: [],
  releaseDate: '',
})

const categoriesInput = ref('')

const loading = ref(false)
const error = ref(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    // Convertir l'input des catégories en tableau
    const categories = categoriesInput.value
      ? categoriesInput.value.split(',').map(cat => cat.trim()).filter(cat => cat)
      : []

    const filmData = {
      ...form.value,
      categories,
      // Convertir la date au format attendu par l'API
      releaseDate: form.value.releaseDate.replace('T', ' ') + ':00',
    }

    if (isEditMode.value) {
      await filmsStore.updateFilm(route.params.id, filmData)
    } else {
      await filmsStore.createFilm(filmData)
    }
    router.push('/admin')
  } catch (err) {
    console.error('Error:', err)
    error.value = err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const film = await filmsStore.fetchFilm(route.params.id)
      form.value = {
        title: film.title || '',
        categories: film.categories || [],
        releaseDate: film.releaseDate ? film.releaseDate.split(' ').join('T').substring(0, 16) : '',
      }

      // Afficher les catégories comme IRIs
      if (film.categories && Array.isArray(film.categories)) {
        categoriesInput.value = film.categories.map(cat => cat.id || cat).join(', ')
      }
    } catch (err) {
      error.value = 'Erreur lors du chargement du film'
    }
  }
})
</script>
