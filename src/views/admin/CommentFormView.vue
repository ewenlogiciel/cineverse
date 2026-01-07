<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-8">
      {{ isEditing ? 'Modifier le commentaire' : 'Nouveau commentaire' }}
    </h1>

    <form @submit.prevent="handleSubmit" class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Utilisateur *</label>
        <select
            v-model="formData.user"
            required
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="" disabled>Sélectionnez un utilisateur</option>
          <option v-for="user in users" :key="user.id" :value="`/api/users/${user.id}`">
            {{ user.email }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Film *</label>
        <select
            v-model="formData.movie"
            required
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="" disabled>Sélectionnez un film</option>
          <option v-for="film in films" :key="film.id" :value="`/api/movies/${film.id}`">
            {{ film.title || film.name }}
          </option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">Contenu *</label>
        <textarea
            v-model="formData.content"
            required
            rows="6"
            class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Écrivez le commentaire..."
        ></textarea>
      </div>

      <div class="flex space-x-4">
        <button
            type="submit"
            :disabled="commentsStore.loading"
            class="flex-1 px-6 py-3 bg-white/5 border border-gray-700 text-gray-400 rounded-lg font-medium transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 disabled:opacity-50"
        >
          {{ commentsStore.loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer') }}
        </button>
        <router-link
            to="/admin/comments"
            class="px-6 py-3 bg-white/5 border border-gray-700 text-gray-400 rounded-lg font-medium transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
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
import { useCommentsStore } from '@/stores/comments'
import { useUsersStore } from '@/stores/users'
import { useFilmsStore } from '@/stores/films'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const commentsStore = useCommentsStore()
const usersStore = useUsersStore()
const filmsStore = useFilmsStore()
const notificationStore = useNotificationStore()

const isEditing = computed(() => !!route.params.id)

const users = ref([])
const films = ref([])

const formData = ref({
  user: '',
  movie: '',
  content: '',
})

const handleSubmit = async () => {
  try {
    const commentData = {
      content: formData.value.content,
      user: formData.value.user,
      movie: formData.value.movie,
    }

    if (isEditing.value) {
      await commentsStore.updateComment(route.params.id, commentData)
      notificationStore.success('Commentaire modifié avec succès')
    } else {
      await commentsStore.createComment(commentData)
      notificationStore.success('Commentaire créé avec succès')
    }
    router.push('/admin/comments')
  } catch (err) {
    console.error("Erreur:", err)
    notificationStore.error('Erreur lors de l\'enregistrement : ' + err.message)
  }
}

onMounted(async () => {
  // Charger les utilisateurs et les films
  try {
    await usersStore.fetchUsers()
    users.value = usersStore.users
  } catch (err) {
    console.error("Erreur chargement utilisateurs:", err)
  }

  try {
    await filmsStore.fetchFilms()
    films.value = filmsStore.films
  } catch (err) {
    console.error("Erreur chargement films:", err)
  }

  // Si on est en mode édition, charger le commentaire
  if (isEditing.value) {
    try {
      const comment = await commentsStore.fetchComment(route.params.id)
      formData.value.content = comment.content

      // Gérer les IRIs pour user et movie
      if (typeof comment.user === 'string') {
        formData.value.user = comment.user
      } else if (comment.user && comment.user['@id']) {
        formData.value.user = comment.user['@id']
      } else if (comment.user && comment.user.id) {
        formData.value.user = `/api/users/${comment.user.id}`
      }

      if (typeof comment.movie === 'string') {
        formData.value.movie = comment.movie
      } else if (comment.movie && comment.movie['@id']) {
        formData.value.movie = comment.movie['@id']
      } else if (comment.movie && comment.movie.id) {
        formData.value.movie = `/api/movies/${comment.movie.id}`
      }
    } catch (err) {
      console.error("Erreur chargement commentaire:", err)
      alert('Erreur lors du chargement du commentaire')
    }
  }
})
</script>
