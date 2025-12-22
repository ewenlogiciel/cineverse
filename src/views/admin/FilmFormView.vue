<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-8">
      {{ isEditing ? 'Modifier le film' : 'Nouveau film' }}
    </h1>

    <form @submit.prevent="handleSubmit" class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Nom *</label>
        <input
            v-model="formData.name"
            type="text"
            required
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
            v-model="formData.description"
            rows="4"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Durée (minutes) *</label>
          <input
              v-model.number="formData.duration"
              type="number"
              min="30"
              required
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <p class="text-xs text-gray-500 mt-1">Minimum 30 minutes</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Budget (€)</label>
          <input
              v-model.number="formData.budget"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Date de sortie</label>
        <input
            v-model="formData.releaseDate"
            type="date"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Réalisateur</label>
        <select
            v-model="formData.director"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option :value="null">Aucun</option>
          <option v-for="director in directors" :key="director.id" :value="`/api/directors/${director.id}`">
            {{ director.firstname }} {{ director.lastname }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Catégories</label>
        <div class="space-y-2 max-h-48 overflow-y-auto bg-gray-800/50 p-4 rounded-lg">
          <label v-for="category in categories" :key="category.id" class="flex items-center space-x-2">
            <input
                type="checkbox"
                :value="`/api/categories/${category.id}`"
                v-model="formData.categories"
                class="rounded bg-gray-800 border-gray-700 text-red-600 focus:ring-red-500"
            />
            <span class="text-gray-300">{{ category.name }}</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Nombre d'entrées</label>
        <input
            v-model.number="formData.nbEntries"
            type="number"
            min="0"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div class="flex space-x-4">
        <button
            type="submit"
            :disabled="filmsStore.loading"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
        >
          {{ filmsStore.loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
        </button>
        <router-link
            to="/admin"
            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all text-center"
        >
          Annuler
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFilmsStore } from '@/stores/films'
import { useDirectorsStore } from '@/stores/directors'
import { useCategoriesStore } from '@/stores/categories'

const route = useRoute()
const router = useRouter()
const filmsStore = useFilmsStore()
const directorsStore = useDirectorsStore()
const categoriesStore = useCategoriesStore()

const isEditing = computed(() => !!route.params.id)

const directors = computed(() => directorsStore.directors)
const categories = computed(() => categoriesStore.categories)

const formData = ref({
  name: '',
  description: '',
  duration: null,
  budget: null,
  releaseDate: '',
  director: null,
  categories: [],
  nbEntries: null,
})

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await filmsStore.updateFilm(route.params.id, formData.value)
    } else {
      await filmsStore.createFilm(formData.value)
    }
    router.push('/admin')
  } catch (err) {
    alert('Erreur lors de l\'enregistrement du film')
  }
}

onMounted(async () => {
  // Charger les réalisateurs et catégories
  await Promise.all([
    directorsStore.fetchDirectors(),
    categoriesStore.fetchCategories()
  ])

  // Si mode édition, charger le film
  if (isEditing.value) {
    const film = await filmsStore.fetchFilm(route.params.id)
    formData.value = {
      name: film.name || '',
      description: film.description || '',
      duration: film.duration,
      budget: film.budget,
      releaseDate: film.releaseDate || '',
      director: film.director?.id || null,
      categories: film.categories?.map(cat => cat.id) || [],
      nbEntries: film.nbEntries,
    }
  }
})
</script>
