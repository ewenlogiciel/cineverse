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
    <!-- Film header -->
    <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-8">
      <div class="md:flex">
        <div class="md:w-1/3">
          <div class="relative h-96 md:h-full bg-gradient-to-br from-gray-800 to-gray-900">
            <img
              v-if="posterUrl"
              :src="posterUrl"
              :alt="film.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-gray-600 text-9xl">🎬</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          </div>
        </div>

        <div class="md:w-2/3 p-8">
          <h1 class="text-5xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent mb-6">
            {{ film.title }}
          </h1>

          <div class="flex items-center mb-6">
            <div class="flex items-center bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2">
              <span class="text-yellow-400 text-3xl mr-2">⭐</span>
              <span class="text-3xl font-bold text-white">
                {{ film.averageRating ? film.averageRating.toFixed(1) : 'N/A' }}
              </span>
              <span class="text-gray-400 ml-2 text-sm">
                ({{ film.ratingsCount || 0 }} avis)
              </span>
            </div>
          </div>

          <div class="space-y-3 text-gray-300 mb-6">
            <p v-if="film.releaseDate" class="flex items-center">
              <span class="font-semibold text-white w-32">Date de sortie:</span>
              <span>{{ formatDate(film.releaseDate) }}</span>
            </p>
            <p v-if="film.author" class="flex items-center">
              <span class="font-semibold text-white w-32">Auteur:</span>
              <span>{{ film.author.username || film.author.email }}</span>
            </p>
            <p v-if="film.director" class="flex items-center">
              <span class="font-semibold text-white w-32">Réalisateur:</span>
              <span>{{ film.director }}</span>
            </p>
            <p v-if="film.genre" class="flex items-center">
              <span class="font-semibold text-white w-32">Genre:</span>
              <span>{{ film.genre }}</span>
            </p>
          </div>

          <div class="mb-6">
            <h2 class="text-2xl font-bold text-white mb-3">Synopsis</h2>
            <p class="text-gray-300 leading-relaxed">
              {{ film.description || 'Aucune description disponible' }}
            </p>
          </div>

          <!-- Rating section (authenticated users only) -->
          <div v-if="authStore.isAuthenticated" class="mb-6 bg-white/5 rounded-lg p-4 border border-gray-800">
            <h3 class="text-lg font-bold text-white mb-3">Votre note</h3>
            <div class="flex items-center space-x-2">
              <button
                v-for="star in 5"
                :key="star"
                @click="rateFilm(star)"
                class="text-4xl focus:outline-none transition transform hover:scale-125"
                :class="star <= userRating ? 'text-yellow-400' : 'text-gray-600'"
              >
                ⭐
              </button>
            </div>
          </div>

          <!-- Admin actions -->
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

    <!-- Comments section -->
    <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl p-8">
      <h2 class="text-3xl font-bold text-white mb-6">Commentaires</h2>

      <!-- Add comment form (authenticated users only) -->
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
            class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
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

      <!-- Comments list -->
      <div class="space-y-6">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="border-b border-gray-800 pb-6 last:border-b-0"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p class="font-semibold text-white text-lg">
                {{ comment.author?.username || comment.author?.email }}
              </p>
              <p class="text-sm text-gray-500">
                {{ formatDate(comment.createdAt) }}
              </p>
            </div>
            <button
              v-if="authStore.user?.id === comment.author?.id || authStore.isAdmin"
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
import ratingService from '@/services/ratingService'
import filmService from '@/services/filmService'
import tmdbService from '@/services/tmdbService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const film = ref(null)
const comments = ref([])
const userRating = ref(0)
const newComment = ref('')
const loading = ref(true)
const error = ref(null)
const posterUrl = ref(null)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const rateFilm = async (rating) => {
  try {
    await ratingService.rateFilm(route.params.id, rating)
    userRating.value = rating
    // Refresh film data to update average rating
    await loadFilm()
  } catch (err) {
    console.error('Error rating film:', err)
  }
}

const submitComment = async () => {
  try {
    await commentService.createComment(route.params.id, {
      content: newComment.value,
    })
    newComment.value = ''
    await loadComments()
  } catch (err) {
    console.error('Error creating comment:', err)
  }
}

const deleteComment = async (commentId) => {
  if (!confirm('Voulez-vous vraiment supprimer ce commentaire?')) return

  try {
    await commentService.deleteComment(commentId)
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

    // Charger l'affiche depuis TMDB
    if (film.value.poster) {
      posterUrl.value = film.value.poster
    } else {
      const results = await tmdbService.searchMovie(film.value.title)
      if (results && results.length > 0) {
        const tmdbPoster = tmdbService.getPosterUrl(results[0].poster_path, 'w780')
        if (tmdbPoster) {
          posterUrl.value = tmdbPoster
        }
      }
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement du film'
    console.error(err)
  }
}

const loadComments = async () => {
  try {
    comments.value = await commentService.getComments(route.params.id)
  } catch (err) {
    console.error('Error loading comments:', err)
  }
}

const loadUserRating = async () => {
  if (!authStore.isAuthenticated) return

  try {
    const response = await ratingService.getUserRating(route.params.id)
    userRating.value = response.rating || 0
  } catch (err) {
    console.error('Error loading user rating:', err)
  }
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      loadFilm(),
      loadComments(),
      loadUserRating(),
    ])
  } finally {
    loading.value = false
  }
})
</script>
