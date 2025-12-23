<template>
  <div class="max-w-[90rem] mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-5xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent">
        Gestion des Commentaires
      </h1>
      <router-link
          to="/admin/comments/new"
          class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
      >
        + Nouveau Commentaire
      </router-link>
    </div>

    <div v-if="commentsStore.loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
        <div class="text-gray-400 text-lg">Chargement...</div>
      </div>
    </div>

    <div v-else-if="commentsStore.comments.length > 0" class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-800">
          <thead class="bg-black/40">
          <tr>
            <th class="px-4 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
              #
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Auteur
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Film
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Contenu
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
          <tr v-for="(comment, index) in commentsStore.comments" :key="comment.id || comment['@id']" class="hover:bg-white/5 transition-colors">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500 font-medium">{{ index + 1 }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-white">
                {{ getUserName(comment.user) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-300">
                {{ getMovieInfo(comment.movie) }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-400 max-w-md truncate">
                {{ comment.content }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-400">
                {{ comment.createdAt ? formatDate(comment.createdAt) : 'N/A' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex space-x-4">
                <router-link
                    :to="`/admin/comments/${getCommentId(comment)}/edit`"
                    class="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Modifier
                </router-link>
                <button
                    @click="confirmDelete(comment)"
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
      <div class="text-6xl mb-4">💬</div>
      <p class="text-gray-400 text-2xl mb-4">Aucun commentaire trouvé</p>
      <router-link
          to="/admin/comments/new"
          class="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105"
      >
        Créer le premier commentaire
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCommentsStore } from '@/stores/comments'
import { useFilmsStore } from '@/stores/films'
import { useNotificationStore } from '@/stores/notification'

const commentsStore = useCommentsStore()
const filmsStore = useFilmsStore()
const notificationStore = useNotificationStore()

const films = ref([])

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getUserName = (user) => {
  if (!user) return 'Utilisateur inconnu'
  if (typeof user === 'string') {
    // Si c'est juste l'IRI
    const match = user.match(/\/(\d+)$/)
    return match ? `Utilisateur #${match[1]}` : 'Utilisateur inconnu'
  }
  // Si c'est un objet avec les données
  return user.email || user.username || 'Utilisateur inconnu'
}

const getMovieInfo = (movie) => {
  if (!movie) return 'Film inconnu'

  // Si c'est un objet avec les données directement
  if (typeof movie === 'object' && (movie.name || movie.title)) {
    return movie.name || movie.title
  }

  // Si c'est un IRI, on cherche le film dans la liste
  if (typeof movie === 'string') {
    const match = movie.match(/\/(\d+)$/)
    if (match) {
      const filmId = match[1]
      const film = films.value.find(f => f.id == filmId)
      if (film) {
        return film.title || film.name
      }
      return `Film #${filmId}`
    }
  }

  return 'Film inconnu'
}

const getCommentId = (comment) => {
  if (comment.id) return comment.id
  if (comment['@id']) {
    const match = comment['@id'].match(/\/(\d+)$/)
    return match ? match[1] : comment['@id']
  }
  return comment['@id'] || comment.id
}

const confirmDelete = async (comment) => {
  const userName = getUserName(comment.user)
  const confirmed = await notificationStore.confirm({
    title: 'Supprimer le commentaire',
    message: `Voulez-vous vraiment supprimer le commentaire de "${userName}" ?`,
    confirmText: 'Supprimer',
    cancelText: 'Annuler'
  })

  if (!confirmed) return

  try {
    const id = getCommentId(comment)
    await commentsStore.deleteComment(id)
    notificationStore.success('Commentaire supprimé avec succès')
  } catch (err) {
    notificationStore.error('Erreur lors de la suppression du commentaire')
  }
}

onMounted(async () => {
  // Charger les films et les commentaires en parallèle
  await Promise.all([
    filmsStore.fetchFilms().then(() => {
      films.value = filmsStore.films
    }),
    commentsStore.fetchComments()
  ])
})
</script>
