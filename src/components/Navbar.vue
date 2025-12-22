<template>
  <nav class="bg-black/60 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
    <div class="max-w-[90rem] mx-auto px-4">
      <div class="flex items-center justify-between h-20">

        <div class="flex items-center space-x-8 lg:space-x-12 flex-1">
          <router-link to="/" class="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent transition-all hover:opacity-80 shrink-0">
            cineverse
          </router-link>

          <div class="hidden lg:flex items-center space-x-1 shrink-0">
            <router-link to="/" class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg transition-all" active-class="text-white">
              Accueil
            </router-link>

            <div v-if="authStore.isAdmin" class="relative group">
              <button class="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white rounded-lg transition-all flex items-center space-x-1">
                <span>Administration</span>
                <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div class="absolute left-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <router-link to="/admin" class="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors first:rounded-t-lg">Films</router-link>
                <router-link to="/admin/actors" class="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Acteurs</router-link>
                <router-link to="/admin/categories" class="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Catégories</router-link>
                <router-link to="/admin/directors" class="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Réalisateurs</router-link>
                <router-link to="/admin/users" class="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors last:rounded-b-lg">Utilisateurs</router-link>
              </div>
            </div>
          </div>

          <div class="hidden md:flex items-center space-x-2 flex-1 max-w-sm ml-4">
            <div class="relative flex-1 group">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher un film"
                  class="w-full pl-11 pr-4 py-2 bg-white/5 border border-gray-700 rounded-3xl focus:outline-none focus:ring-0 focus:border-gray-700 text-white caret-white placeholder-gray-500 transition-all text-sm"
                  @input="handleInput"
              />
            </div>

            <div class="relative group/filter">
              <button class="p-2 bg-white/5 border border-gray-700 rounded-full text-gray-500 hover:text-white hover:border-gray-500 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>

              <div class="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover/filter:opacity-100 group-hover/filter:visible transition-all duration-200 z-[60] p-4">
                <div class="space-y-4">
                  <div>
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date de sortie</label>
                    <div class="flex mt-2 gap-2">
                      <button
                          @click="updateSort('desc')"
                          :class="sortBy === 'desc'
      ? 'bg-red-600 border-red-600 text-white'
      : 'bg-white/5 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'"
                          class="flex-1 px-2 py-1 rounded text-xs border transition-all"
                      >
                        Récent
                      </button>

                      <button
                          @click="updateSort('asc')"
                          :class="sortBy === 'asc'
      ? 'bg-red-600 border-red-600 text-white'
      : 'bg-white/5 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'"
                          class="flex-1 px-2 py-1 rounded text-xs border transition-all"
                      >
                        Ancien
                      </button>
                    </div>
                  </div>
                  <div class="relative">
                    <label class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Réalisateur</label>

                    <button
                        @click="isDirectorDropdownOpen = !isDirectorDropdownOpen"
                        class="w-full mt-2 bg-black border border-gray-700 text-xs text-gray-300 rounded-lg px-3 py-2 flex justify-between items-center hover:border-gray-500 transition-colors"
                    >
    <span class="truncate">
      {{
        selectedDirector
            ? directorsStore.directors.find(d => d.id === selectedDirector)?.name
            : 'Tous les réalisateurs'
      }}
    </span>

                      <svg
                          class="w-4 h-4 text-gray-500 transition-transform duration-200"
                          :class="{ 'rotate-180': isDirectorDropdownOpen }"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div
                        v-if="isDirectorDropdownOpen"
                        class="absolute left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                    >
                      <button
                          @click="selectDirector(null)"
                          class="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors border-b border-gray-800"
                          :class="{ 'text-red-500 font-bold': selectedDirector === null }"
                      >
                        Tous les réalisateurs
                      </button>

                      <button
                          v-for="dir in directorsStore.directors"
                          :key="dir.id"
                          @click="selectDirector(dir.id)"
                          class="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                          :class="{ 'text-red-500 font-bold': selectedDirector === dir.id }"
                      >
                        {{ dir.name }}
                      </button>
                    </div>

                    <div
                        v-if="isDirectorDropdownOpen"
                        class="fixed inset-0 z-40"
                        @click="isDirectorDropdownOpen = false"
                    ></div>
                  </div>                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-8 shrink-0">
          <template v-if="authStore.isAuthenticated">
            <div class="flex items-center space-x-3 group cursor-default">
              <div class="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 text-xs font-bold uppercase">
                {{ (authStore.user?.username || authStore.user?.email || '?').charAt(0) }}
              </div>
              <span class="text-sm font-medium text-gray-400 hidden sm:block">
                {{ authStore.user?.username || authStore.user?.email }}
              </span>
            </div>
            <button @click="handleLogout" class="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors">Déconnexion</button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-sm font-medium text-gray-400 hover:text-white transition-colors">Connexion</router-link>
            <router-link to="/register" class="text-sm font-medium text-red-600 hover:text-red-500 transition-colors">Inscription</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFilmsStore } from '@/stores/films'
import { useDirectorsStore } from '@/stores/directors' // Ajouté
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const filmsStore = useFilmsStore()
const directorsStore = useDirectorsStore() // Ajouté
const router = useRouter()
const route = useRoute()

const searchQuery = ref('')
const selectedDirector = ref(null)
const sortBy = ref(null)
const isDirectorDropdownOpen = ref(false)
let timeout = null

// Charger les réalisateurs au montage pour remplir le select
onMounted(() => {
  directorsStore.fetchDirectors()
})

const handleInput = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    executeSearch()
  }, 500)
}

const updateSort = (order) => {
  sortBy.value = order
  executeSearch()
}

const executeSearch = () => {
  // ... redirection ...

  filmsStore.fetchFilms({
    search: searchQuery.value.trim() || undefined,
    director: selectedDirector.value || undefined, // Envoie l'ID (ex: 5)
    sort: sortBy.value // 'asc' ou 'desc'
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
}

const selectDirector = (id) => {
  selectedDirector.value = id
  isDirectorDropdownOpen.value = false // On ferme le menu après le choix
  executeSearch()
}
</script>