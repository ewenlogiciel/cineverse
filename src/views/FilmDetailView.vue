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
                class="px-6 py-2 bg-white/5 border border-gray-700 text-gray-400 rounded-lg font-medium transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            >
              Modifier
            </router-link>
            <button
                @click="handleDelete"
                class="px-6 py-2 bg-white/5 border border-gray-700 text-gray-400 rounded-lg font-medium transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
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
          <div>
            <textarea
                v-model="newComment"
                rows="4"
                maxlength="500"
                placeholder="Écrire un commentaire..."
                class="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
            ></textarea>
            <p class="text-sm text-gray-500 text-right mt-1">{{ newComment.length }} / 500</p>
          </div>
          <button
              type="submit"
              :disabled="!newComment.trim()"
              class="px-6 py-2 bg-white/5 border border-gray-700 text-gray-400 rounded-lg font-medium transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
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

      <!-- Tri des commentaires -->
      <div v-if="comments.length > 1" class="flex items-center gap-2 mb-6">
        <span class="text-sm text-gray-400">Trier :</span>
        <button
            @click="commentSort = 'newest'"
            class="px-3 py-1 rounded-full text-sm transition-colors"
            :class="commentSort === 'newest' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-500 hover:text-gray-300'"
        >
          Plus récents
        </button>
        <button
            @click="commentSort = 'oldest'"
            class="px-3 py-1 rounded-full text-sm transition-colors"
            :class="commentSort === 'oldest' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'text-gray-500 hover:text-gray-300'"
        >
          Plus anciens
        </button>
      </div>

      <div class="space-y-6">
        <div
            v-for="comment in paginatedComments"
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
            <div v-if="authStore.user?.id === comment.user?.id || authStore.isAdmin" class="flex items-center gap-3">
              <button
                  v-if="editingCommentId !== comment.id"
                  @click="startEditing(comment)"
                  class="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                Modifier
              </button>
              <button
                  @click="deleteComment(comment.id)"
                  class="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>

          <!-- Mode édition -->
          <div v-if="editingCommentId === comment.id">
            <textarea
                v-model="editingContent"
                rows="3"
                maxlength="500"
                class="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
            ></textarea>
            <div class="flex items-center justify-between mt-2">
              <p class="text-sm text-gray-500">{{ editingContent.length }} / 500</p>
              <div class="flex gap-2">
                <button
                    @click="cancelEditing"
                    class="px-4 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                    @click="saveEdit(comment.id)"
                    :disabled="!editingContent.trim()"
                    class="px-4 py-1.5 text-sm bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>

          <!-- Mode lecture -->
          <p v-else class="text-gray-300 leading-relaxed">{{ comment.content }}</p>
        </div>

        <!-- Bouton Voir plus -->
        <div v-if="displayedCount < sortedComments.length" class="text-center pt-4">
          <button
              @click="displayedCount += commentsPerPage"
              class="px-6 py-2 bg-white/5 border border-gray-700 text-gray-400 rounded-lg font-medium transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
          >
            Voir plus de commentaires
          </button>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import commentService from '@/services/commentService'
import filmService from '@/services/filmService'
import tmdbService from '@/services/tmdbService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const film = ref(null)
const comments = ref([])
const newComment = ref('')
const loading = ref(true)
const error = ref(null)
const posterUrl = ref(null)
const imageError = ref(false)

// Comment editing
const editingCommentId = ref(null)
const editingContent = ref('')

// Comment sorting & pagination
const commentSort = ref('newest')
const commentsPerPage = 5
const displayedCount = ref(commentsPerPage)

const sortedComments = computed(() => {
  const sorted = [...comments.value]
  sorted.sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return commentSort.value === 'newest' ? dateB - dateA : dateA - dateB
  })
  return sorted
})

const paginatedComments = computed(() => {
  return sortedComments.value.slice(0, displayedCount.value)
})

const startEditing = (comment) => {
  editingCommentId.value = comment.id
  editingContent.value = comment.content
}

const cancelEditing = () => {
  editingCommentId.value = null
  editingContent.value = ''
}

const saveEdit = async (commentId) => {
  if (!editingContent.value.trim()) return

  try {
    const id = commentId.toString().includes('/') ? commentId.split('/').pop() : commentId
    await commentService.updateComment(id, { content: editingContent.value })
    await loadComments()
    cancelEditing()
    notificationStore.success('Commentaire modifié avec succès')
  } catch (err) {
    console.error('Erreur lors de la modification:', err)
    notificationStore.error('Erreur lors de la modification du commentaire')
  }
}

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
      user: `/api/users/${authStore.user.id}`
    }

    await commentService.createComment(commentData)
    newComment.value = ''
    await loadComments()
    notificationStore.success('Commentaire ajouté avec succès')
  } catch (err) {
    console.error('Erreur:', err.response?.data)
    notificationStore.error('Erreur lors de l\'envoi du commentaire')
  }
}

const deleteComment = async (commentId) => {
  const confirmed = await notificationStore.confirm({
    title: 'Supprimer le commentaire',
    message: 'Voulez-vous vraiment supprimer ce commentaire ?',
    confirmText: 'Supprimer',
    cancelText: 'Annuler'
  })

  if (!confirmed) return

  try {
    const id = commentId.toString().includes('/') ? commentId.split('/').pop() : commentId
    await commentService.deleteComment(id)
    await loadComments()
    notificationStore.success('Commentaire supprimé avec succès')
  } catch (err) {
    console.error('Error deleting comment:', err)
    notificationStore.error('Erreur lors de la suppression du commentaire')
  }
}

const handleDelete = async () => {
  const confirmed = await notificationStore.confirm({
    title: 'Supprimer le film',
    message: 'Voulez-vous vraiment supprimer ce film ?',
    confirmText: 'Supprimer',
    cancelText: 'Annuler'
  })

  if (!confirmed) return
  try {
    await filmService.deleteFilm(route.params.id)
    notificationStore.success('Film supprimé avec succès')
    router.push('/')
  } catch (err) {
    console.error('Error deleting film:', err)
    notificationStore.error('Erreur lors de la suppression du film')
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
  try {
    const filmId = route.params.id
    comments.value = await commentService.getComments(filmId)
  } catch (err) {
    console.error('Erreur lors du chargement des commentaires:', err)
  }
};

onMounted(async () => {
  loading.value = true
  try {
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
