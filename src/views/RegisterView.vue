<template>
  <div class="max-w-md mx-auto mt-20">
    <div class="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
      <h2 class="text-4xl font-bold bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent mb-8 text-center">
        Inscription
      </h2>

      <form @submit.prevent="handleRegister" class="space-y-5">
        <div v-if="error" class="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg backdrop-blur-sm">
          {{ error }}
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
              id="email"
              v-model="form.email"
              type="email"
              required
              @blur="validateEmail"
              class="w-full px-4 py-3 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
              placeholder="votre@email.com"
          />
          <p v-if="fieldErrors.email" class="text-red-400 text-sm mt-1">{{ fieldErrors.email }}</p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
            Mot de passe
          </label>
          <div class="relative">
            <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                @blur="validatePassword"
                class="w-full px-4 py-3 pr-12 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="••••••••"
            />
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
            </button>
          </div>
          <p v-if="fieldErrors.password" class="text-red-400 text-sm mt-1">{{ fieldErrors.password }}</p>

          <!-- Password strength meter -->
          <div v-if="form.password" class="mt-2">
            <div class="flex gap-1">
              <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1.5 flex-1 rounded-full transition-colors"
                  :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-700'"
              ></div>
            </div>
            <p class="text-xs mt-1" :class="passwordStrength.textColor">{{ passwordStrength.label }}</p>
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
            Confirmer le mot de passe
          </label>
          <div class="relative">
            <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                @blur="validateConfirmPassword"
                class="w-full px-4 py-3 pr-12 bg-white/5 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="••••••••"
            />
            <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
            </button>
          </div>
          <p v-if="fieldErrors.confirmPassword" class="text-red-400 text-sm mt-1">{{ fieldErrors.confirmPassword }}</p>
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          {{ loading ? 'Inscription...' : "S'inscrire" }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-400">
        Déjà un compte?
        <router-link to="/login" class="text-red-500 hover:text-red-400 font-medium transition-colors">
          Se connecter
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false)
const error = ref(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const fieldErrors = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const passwordStrength = computed(() => {
  const pwd = form.value.password
  if (!pwd) return { level: 0, label: '', color: 'bg-gray-700', textColor: 'text-gray-500' }

  let score = 0
  if (pwd.length >= 6) score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  const levels = [
    { level: 1, label: 'Faible', color: 'bg-red-500', textColor: 'text-red-400' },
    { level: 2, label: 'Moyen', color: 'bg-orange-500', textColor: 'text-orange-400' },
    { level: 3, label: 'Fort', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
    { level: 4, label: 'Très fort', color: 'bg-green-500', textColor: 'text-green-400' },
  ]

  const idx = Math.max(0, Math.min(score - 1, 3))
  return score === 0
    ? { level: 1, label: 'Faible', color: 'bg-red-500', textColor: 'text-red-400' }
    : levels[idx]
})

const validateEmail = () => {
  const email = form.value.email
  if (!email) {
    fieldErrors.email = ''
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  fieldErrors.email = emailRegex.test(email) ? '' : 'Adresse email invalide'
}

const validatePassword = () => {
  const pwd = form.value.password
  if (!pwd) {
    fieldErrors.password = ''
    return
  }
  fieldErrors.password = pwd.length < 6 ? 'Le mot de passe doit contenir au moins 6 caractères' : ''
  if (form.value.confirmPassword) validateConfirmPassword()
}

const validateConfirmPassword = () => {
  const confirm = form.value.confirmPassword
  if (!confirm) {
    fieldErrors.confirmPassword = ''
    return
  }
  fieldErrors.confirmPassword = confirm !== form.value.password ? 'Les mots de passe ne correspondent pas' : ''
}

const handleRegister = async () => {
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  if (fieldErrors.email || fieldErrors.password || fieldErrors.confirmPassword) return

  if (form.value.password !== form.value.confirmPassword) {
    fieldErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  error.value = null

  try {
    const { confirmPassword, ...userData } = form.value
    await authStore.register(userData)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || "Erreur lors de l'inscription"
  } finally {
    loading.value = false
  }
}
</script>
