<template>
  <div v-if="loading" class="flex justify-center items-center py-20">
    <div class="flex flex-col items-center space-y-4">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      <div class="text-gray-400 text-lg">Chargement...</div>
    </div>
  </div>

  <div v-else-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-lg backdrop-blur-sm">
    {{ error }}
  </div>

  <div v-else-if="film" class="max-w-7xl mx-auto">
    <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
      <div class="md:flex">
        <div class="md:w-1/3">
          <div class="relative h-96 md:h-full bg-gradient-to-br from-gray-800 to-gray-900">
            <img
                v-if="posterUrl && !imageError"
                :src="posterUrl"
                :alt="film.name"
                class="w-full h-full object-cover"
                @error="imageError = true"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-gray-600 text-9xl">🎬</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          </div>
        </div>

        <div class="md:w-2/3 p-8">
          <h1 class="text-5xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-6">
            {{ film.name }}
          </h1>

          <div class="space-y-3 text-gray-300 mb-6">
            <p v-if="film.releaseDate" class="flex items-center">
              <span class="font-semibold text-white w-32">Date de sortie :</span>
              <span>{{ formatDate(film.releaseDate) }}</span>
            </p>
            <p v-if="film.director" class="flex items-center">
              <span class="font-semibold text-white w-32">Réalisateur :</span>
              <span>{{ film.director.firstname }} {{ film.director.lastname }}</span>
            </p>
            <div v-if="film.categories && film.categories.length > 0" class="flex items-start">
              <span class="font-semibold text-white w-32 flex-shrink-0">Genre :</span>
              <div class="flex flex-wrap gap-2">
                <span
                    v-for="category in film.categories"
                    :key="category.id"
                    class="px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400"
                >
                  {{ category.name }}
                </span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h2 class="text-2xl font-bold text-white mb-3">Synopsis</h2>
            <p class="text-gray-300 leading-relaxed">
              {{ film.description || 'Aucune description disponible' }}
            </p>
          </div>

          <div v-if="authStore.isAdmin" class="flex space-x-4">
            <router-link
                :to="`/admin/films/${film.id}/edit`"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all transform hover:scale-105"
            >
              Modifier
            </router-link>
            <button
                @click="handleDelete"
                class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all transform hover:scale-105"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl p-8">
      <h2 class="text-3xl font-bold text-white mb-6">Commentaires</h2>

      <div v-if="authStore.isAuthenticated" class="mb-8">
        <form @submit.prevent="submitComment" class="space-y-4">
          <textarea
              v-model="newComment"
              rows="4"
              placeholder="Écrire un commentaire..."
              class="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
          ></textarea>
          <button
              type="submit"
              :disabled="!newComment.trim()"
              class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            Publier le commentaire
          </button>
        </form>
      </div>

      <div v-else class="mb-8 p-4 bg-white/5 border border-gray-800 rounded-lg text-center">
        <p class="text-gray-300">
          <router-link to="/login" class="text-red-500 hover:text-red-400 font-medium transition-colors">
            Connectez-vous
          </router-link>
          pour laisser un commentaire
        </p>
      </div>

      <div class="space-y-6">
        <div
            v-for="comment in comments"
            :key="comment.id"
            class="border-b border-gray-800 pb-6 last:border-b-0"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-semibold text-white text-lg">
                {{ comment.user?.username || comment.user?.email || 'Utilisateur anonyme' }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatDate(comment.createdAt) }}
              </p>
            </div>
            <button
                v-if="authStore.user?.id === comment.user?.id || authStore.isAdmin"
                @click="deleteComment(comment.id)"
                class="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
            >
              Supprimer
            </button>
          </div>
          <p class="text-gray-300 leading-relaxed">{{ comment.content }}</p>
        </div>

        <div v-if="comments.length === 0" class="text-center py-12">
          <p class="text-gray-400 text-lg">Aucun commentaire pour le moment</p>
          <p class="text-gray-500 text-sm mt-2">Soyez le premier à commenter!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import commentService from '@/services/commentService'
import filmService from '@/services/filmService'
import tmdbService from '@/services/tmdbService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const film = ref(null)
const comments = ref([])
const newComment = ref('')
const loading = ref(true)
const error = ref(null)
const posterUrl = ref(null)
const imageError = ref(false)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const submitComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const commentData = {
      content: newComment.value,
      movie: `/api/movies/${route.params.id}`,
      user: `/api/users/${authStore.user.id}` // On utilise 'user' et non 'author'
    }

    await commentService.createComment(commentData)
    newComment.value = ''
    await loadComments()
  } catch (err) {
    console.error('Erreur:', err.response?.data)
    alert('Erreur lors de l\'envoi.')
  }
}

const deleteComment = async (commentId) => {
  if (!confirm('Voulez-vous vraiment supprimer ce commentaire?')) return
  try {
    const id = commentId.toString().includes('/') ? commentId.split('/').pop() : commentId
    await commentService.deleteComment(id)
    await loadComments()
  } catch (err) {
    console.error('Error deleting comment:', err)
  }
}

const handleDelete = async () => {
  if (!confirm('Voulez-vous vraiment supprimer ce film?')) return
  try {
    await filmService.deleteFilm(route.params.id)
    router.push('/')
  } catch (err) {
    console.error('Error deleting film:', err)
  }
}

const loadFilm = async () => {
  try {
    film.value = await filmService.getFilm(route.params.id)
    const movieTitle = film.value.name || film.value.title

    const hasValidPoster = film.value.image &&
        !film.value.image.includes('placeholder') &&
        !film.value.image.includes('via.placeholder')

    if (hasValidPoster) {
      posterUrl.value = film.value.image
    } else {
      try {
        const results = await tmdbService.searchMovie(movieTitle)
        if (results && results.length > 0) {
          const tmdbPoster = tmdbService.getPosterUrl(results[0].poster_path, 'w780')
          if (tmdbPoster) {
            posterUrl.value = tmdbPoster
          }
        }
      } catch (tmdbError) {
        console.error('Error fetching TMDB poster:', tmdbError)
      }
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement du film'
    console.error(err)
  }
}

const loadComments = async () => {
  // Les commentaires sont déjà dans film.value.comments grâce aux Groups !
  if (film.value && film.value.comments) {
    comments.value = film.value.comments;
  }
};

onMounted(async () => {
  loading.value = true
  try {
    // Plus de loadUserRating ici
    await Promise.all([
      loadFilm(),
      loadComments()
    ])
  } catch (err) {
    console.error('Erreur au montage:', err)
  } finally {
    loading.value = false
  }
})
</script>