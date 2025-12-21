<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent mb-8">
      {{ isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
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

      <div class="flex space-x-4">
        <button
            type="submit"
            :disabled="categoriesStore.loading"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
        >
          {{ categoriesStore.loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
        </button>
        <router-link
            to="/admin/categories"
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
import { useCategoriesStore } from '@/stores/categories'

const route = useRoute()
const router = useRouter()
const categoriesStore = useCategoriesStore()

const isEditing = computed(() => !!route.params.id)

const formData = ref({
  name: '',
})

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await categoriesStore.updateCategory(route.params.id, { name: formData.value.name });
    } else {
      // Le service s'occupe maintenant d'ajouter le createdAt
      await categoriesStore.createCategory({ name: formData.value.name });
    }
    router.push('/admin/categories');
  } catch (err) {
    console.error("DEBUG:", err);
    alert('Erreur lors de l\'enregistrement : ' + err.message);
  }
}

onMounted(async () => {
  if (isEditing.value) {
    try {
      const category = await categoriesStore.fetchCategory(route.params.id)
      formData.value.name = category.name
    } catch (err) {
      console.error("Erreur chargement catégorie:", err)
    }
  }
})
</script>