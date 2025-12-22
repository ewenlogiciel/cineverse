<template>
  <div class="max-w-[90rem] mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-5xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
        Gestion des Utilisateurs
      </h1>
      <router-link
          to="/admin/users/new"
          class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
      >
        + Nouvel Utilisateur
      </router-link>
    </div>

    <div v-if="usersStore.loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        <div class="text-gray-400 text-lg">Chargement...</div>
      </div>
    </div>

    <div v-else-if="usersStore.users.length > 0" class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-800">
          <thead class="bg-black/40">
          <tr>
            <th class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
              #
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Rôles
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Rate Limit
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
          <tr v-for="(user, index) in usersStore.users" :key="user.id" class="hover:bg-white/5 transition-colors">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 font-medium">{{ index + 1 }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-white">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex gap-2">
                <span
                    v-for="role in user.roles"
                    :key="role"
                    class="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                >
                  {{ role }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-400">
                {{ user.apiRateLimit }} / {{ user.apiRateLimitInterval }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex space-x-4">
                <router-link
                    :to="`/admin/users/${user.id}/edit`"
                    class="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Modifier
                </router-link>
                <button
                    @click="confirmDelete(user)"
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
      <div class="text-6xl mb-4">👥</div>
      <p class="text-gray-400 text-2xl mb-4">Aucun utilisateur trouvé</p>
      <router-link
          to="/admin/users/new"
          class="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105"
      >
        Créer le premier utilisateur
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()

const confirmDelete = async (user) => {
  if (!confirm(`Voulez-vous vraiment supprimer "${user.email}"?`)) return

  try {
    await usersStore.deleteUser(user.id)
  } catch (err) {
    alert('Erreur lors de la suppression de l\'utilisateur')
  }
}

onMounted(() => {
  usersStore.fetchUsers()
})
</script>