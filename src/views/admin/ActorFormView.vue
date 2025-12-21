<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent mb-8">
      {{ isEditing ? 'Modifier l\'acteur' : 'Nouvel acteur' }}
    </h1>

    <form @submit.prevent="handleSubmit" class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Nom *</label>
        <input
            v-model="formData.lastname"
            type="text"
            required
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Prénom</label>
        <input
            v-model="formData.firstname"
            type="text"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Date de naissance</label>
          <input
              v-model="formData.dob"
              type="date"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Date de décès</label>
          <input
              v-model="formData.dod"
              type="date"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Biographie</label>
        <textarea
            v-model="formData.bio"
            rows="4"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        ></textarea>
      </div>

      <div class="flex space-x-4">
        <button
            type="submit"
            :disabled="actorsStore.loading"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
        >
          {{ actorsStore.loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
        </button>
        <router-link
            to="/admin/actors"
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
import { useActorsStore } from '@/stores/actors'

const route = useRoute()
const router = useRouter()
const actorsStore = useActorsStore()

const isEditing = computed(() => !!route.params.id)

const formData = ref({
  lastname: '',
  firstname: '',
  dob: '',
  dod: '',
  bio: '',
})

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await actorsStore.updateActor(route.params.id, formData.value)
    } else {
      await actorsStore.createActor(formData.value)
    }
    router.push('/admin/actors')
  } catch (err) {
    alert('Erreur lors de l\'enregistrement de l\'acteur')
  }
}

onMounted(async () => {
  if (isEditing.value) {
    const actor = await actorsStore.fetchActor(route.params.id)
    // On extrait seulement les données nécessaires pour éviter d'envoyer d'anciennes propriétés (comme photo)
    formData.value = {
      lastname: actor.lastname,
      firstname: actor.firstname,
      dob: actor.dob,
      dod: actor.dod,
      bio: actor.bio
    }
  }
})
</script>