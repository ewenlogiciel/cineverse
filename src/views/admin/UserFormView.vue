<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent mb-8">
      {{ isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}
    </h1>

    <form @submit.prevent="handleSubmit" class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Email *</label>
        <input
            v-model="formData.email"
            type="email"
            required
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div v-if="!isEditing">
        <label class="block text-sm font-medium text-gray-300 mb-2">Mot de passe *</label>
        <input
            v-model="formData.password"
            type="password"
            required
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Rôles</label>
        <div class="space-y-2">
          <label class="flex items-center space-x-2">
            <input
                type="checkbox"
                value="ROLE_USER"
                v-model="formData.roles"
                class="rounded bg-gray-800 border-gray-700 text-red-600 focus:ring-red-500"
            />
            <span class="text-gray-300">ROLE_USER</span>
          </label>
          <label class="flex items-center space-x-2">
            <input
                type="checkbox"
                value="ROLE_ADMIN"
                v-model="formData.roles"
                class="rounded bg-gray-800 border-gray-700 text-red-600 focus:ring-red-500"
            />
            <span class="text-gray-300">ROLE_ADMIN</span>
          </label>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Rate Limit API</label>
          <input
              v-model.number="formData.apiRateLimit"
              type="number"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Intervalle Rate Limit</label>
          <input
              v-model="formData.apiRateLimitInterval"
              type="text"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div class="flex space-x-4">
        <button
            type="submit"
            :disabled="usersStore.loading"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
        >
          {{ usersStore.loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
        </button>
        <router-link
            to="/admin/users"
            class="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
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
import { useUsersStore } from '@/stores/users'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

// Détermine si on est en mode édition ou création
const isEditing = computed(() => !!route.params.id)

const formData = ref({
  email: '',
  password: '', // Nécessaire pour la création
  roles: ['ROLE_USER'],
  apiRateLimit: 5000,
  apiRateLimitInterval: '1 hour',
})

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      // Pour l'update, on retire le password s'il est vide
      const payload = { ...formData.value }
      if (!payload.password) delete payload.password

      await usersStore.updateUser(route.params.id, payload)
    } else {
      await usersStore.createUser(formData.value)
    }
    router.push('/admin/users')
  } catch (err) {
    console.error(err)
    alert("Erreur lors de l'enregistrement")
  }
}

onMounted(async () => {
  // CORRECTIF : On n'appelle fetchUser QUE si on est en mode édition (ID présent)
  if (isEditing.value) {
    try {
      const user = await usersStore.fetchUser(route.params.id)
      if (user) {
        formData.value = {
          ...user,
          password: '' // On laisse le password vide par sécurité
        }
      }
    } catch (err) {
      console.error("Impossible de charger l'utilisateur", err)
    }
  }
})
</script>