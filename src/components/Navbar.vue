<template>
  <nav class="bg-black border-b border-gray-800 backdrop-blur-sm bg-opacity-90 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-20">
        <div class="flex items-center space-x-12">
          <router-link to="/" class="text-3xl font-bold bg-gradient-to-r text-red-600 bg-clip-text text-transparent transition-all">
            cineverse
          </router-link>
          <div class="hidden md:flex space-x-6">
            <router-link
              to="/"
              class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              active-class="text-white bg-white/10"
            >
              Films
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              active-class="text-white bg-white/10"
            >
              Administration
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <span class="text-sm text-gray-400 hidden sm:block">
              {{ authStore.user?.username || authStore.user?.email }}
            </span>
            <button
              @click="handleLogout"
              class="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
            >
              Déconnexion
            </button>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-all"
            >
              Connexion
            </router-link>
            <router-link
              to="/register"
              class="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg text-sm font-medium transition-all transform hover:scale-105"
            >
              Inscription
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
