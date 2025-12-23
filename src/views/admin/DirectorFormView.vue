<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-8">
      {{ isEditing ? 'Modifier le réalisateur' : 'Nouveau réalisateur' }}
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
        <label class="block text-sm font-medium text-gray-300 mb-2">Prénom *</label>
        <input
            v-model="formData.firstname"
            type="text"
            required
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Date de naissance *</label>
          <input
              v-model="formData.dob"
              type="datetime-local"
              required
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Date de décès</label>
          <input
              v-model="formData.dod"
              type="datetime-local"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>

      <div class="flex space-x-4">
        <button
            type="submit"
            :disabled="directorsStore.loading"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
        >
          {{ directorsStore.loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
        </button>
        <router-link
            to="/admin/directors"
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
import { useDirectorsStore } from '@/stores/directors'

const route = useRoute()
const router = useRouter()
const directorsStore = useDirectorsStore()

const isEditing = computed(() => !!route.params.id)

const formData = ref({
  lastname: '',
  firstname: '',
  dob: '',
  dod: '',
})

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await directorsStore.updateDirector(route.params.id, formData.value)
    } else {
      await directorsStore.createDirector(formData.value)
    }
    router.push('/admin/directors')
  } catch (err) {
    alert('Erreur lors de l\'enregistrement du réalisateur')
  }
}

const formatDateForInput = (isoDate) => {
  if (!isoDate) return ''
  // Convertit une date ISO en format datetime-local (YYYY-MM-DDTHH:mm)
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

onMounted(async () => {
  if (isEditing.value) {
    const director = await directorsStore.fetchDirector(route.params.id)
    formData.value = {
      lastname: director.lastname,
      firstname: director.firstname,
      dob: formatDateForInput(director.dob),
      dod: formatDateForInput(director.dod)
    }
  }
})
</script>
