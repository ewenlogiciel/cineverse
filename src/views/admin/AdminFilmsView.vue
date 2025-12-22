<template>
  <div class="max-w-[90rem] mx-auto px-4 py-8">

    <div class="flex justify-between items-center mb-8">
      <h1 class="text-5xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
        Gestion des Films
      </h1>
      <router-link
          to="/admin/films/new"
          class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
      >
        + Nouveau Film
      </router-link>
    </div>

    <div v-if="filmsStore.loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        <div class="text-gray-400 text-lg">Chargement...</div>
      </div>
    </div>

    <div v-else-if="filmsStore.films.length > 0" class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-800">
          <thead class="bg-black/40">
          <tr>
            <th class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
              #
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Nom
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Réalisateur
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Durée
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date de sortie
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Budget
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
          <tr v-for="(film, index) in filmsStore.films" :key="film.id" class="hover:bg-white/5 transition-colors">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 font-medium">{{ index + 1 }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-white">{{ film.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-400">
                {{ film.director ? `${film.director.firstname} ${film.director.lastname}` : 'N/A' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-400">
                {{ film.duration ? `${film.duration} min` : 'N/A' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-400">
                {{ film.releaseDate ? formatDate(film.releaseDate) : 'N/A' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-400">
                {{ film.budget ? `${formatBudget(film.budget)}` : 'N/A' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex space-x-4">
                <router-link
                    :to="`/films/${film.id}`"
                    class="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Voir
                </router-link>
                <router-link
                    :to="`/admin/films/${film.id}/edit`"
                    class="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Modifier
                </router-link>
                <button
                    @click="confirmDelete(film)"
                    class="text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="text-center py-20 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl">
      <div class="text-6xl mb-4">🎬</div>
      <p class="text-gray-400 text-2xl mb-4">Aucun film trouvé</p>
      <router-link
          to="/admin/films/new"
          class="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105"
      >
        Créer le premier film
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useFilmsStore } from '@/stores/films'
import { useRouter } from 'vue-router'

const filmsStore = useFilmsStore()
const router = useRouter()

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatBudget = (budget) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(budget)
}

const confirmDelete = async (film) => {
  if (!confirm(`Voulez-vous vraiment supprimer "${film.name}"?`)) return

  try {
    await filmsStore.deleteFilm(film.id)
  } catch (err) {
    alert('Erreur lors de la suppression du film')
  }
}

onMounted(() => {
  filmsStore.fetchFilms()
})
</script>
