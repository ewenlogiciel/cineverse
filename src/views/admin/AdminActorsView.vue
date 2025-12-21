<template>
  <div class="max-w-[90rem] mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-5xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
        Gestion des Acteurs
      </h1>
      <router-link
          to="/admin/actors/new"
          class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
      >
        + Nouvel Acteur
      </router-link>
    </div>

    <div v-if="actorsStore.loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        <div class="text-gray-400 text-lg">Chargement...</div>
      </div>
    </div>

    <div v-else-if="actorsStore.actors.length > 0" class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
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
              Prénom
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date de naissance
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
          <tr v-for="(actor, index) in actorsStore.actors" :key="actor.id" class="hover:bg-white/5 transition-colors">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 font-medium">{{ index + 1 }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-white">{{ actor.lastname }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-400">{{ actor.firstname || 'N/A' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-400">
                {{ actor.dob ? formatDate(actor.dob) : 'N/A' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex space-x-4">
                <router-link
                    :to="`/admin/actors/${actor.id}/edit`"
                    class="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Modifier
                </router-link>
                <button
                    @click="confirmDelete(actor)"
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
      <div class="text-6xl mb-4">🎭</div>
      <p class="text-gray-400 text-2xl mb-4">Aucun acteur trouvé</p>
      <router-link
          to="/admin/actors/new"
          class="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105"
      >
        Créer le premier acteur
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useActorsStore } from '@/stores/actors'

const actorsStore = useActorsStore()

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const confirmDelete = async (actor) => {
  if (!confirm(`Voulez-vous vraiment supprimer "${actor.firstname} ${actor.lastname}"?`)) return

  try {
    await actorsStore.deleteActor(actor.id)
  } catch (err) {
    alert('Erreur lors de la suppression de l\'acteur')
  }
}

onMounted(() => {
  actorsStore.fetchActors()
})
</script>
