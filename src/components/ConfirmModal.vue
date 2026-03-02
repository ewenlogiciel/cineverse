<template>
  <Transition name="modal">
    <div
        v-if="notificationStore.confirmModal.show"
        class="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        @click.self="handleCancel"
        @keydown.escape="handleCancel"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <!-- Modal -->
      <div ref="modalRef" class="relative bg-gray-800/90 border-2 border-gray-600 rounded-lg max-w-md w-full overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-5">
          <h3 id="confirm-modal-title" class="text-xl font-bold text-white">
            {{ notificationStore.confirmModal.title }}
          </h3>
        </div>

        <!-- Body -->
        <div class="px-6 py-6">
          <p id="confirm-modal-message" class="text-white text-base leading-relaxed">
            {{ notificationStore.confirmModal.message }}
          </p>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 flex gap-3 justify-end">
          <button
              ref="cancelBtnRef"
              @click="handleCancel"
              class="px-5 py-2.5 bg-white/5 border border-gray-700 text-gray-400 rounded-lg font-medium transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
          >
            {{ notificationStore.confirmModal.cancelText }}
          </button>
          <button
              ref="confirmBtnRef"
              @click="handleConfirm"
              class="px-5 py-2.5 bg-white/5 border border-gray-700 text-gray-400 rounded-lg font-medium transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
          >
            {{ notificationStore.confirmModal.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()
const modalRef = ref(null)
const cancelBtnRef = ref(null)
const confirmBtnRef = ref(null)
let previouslyFocused = null

// Focus trap : quand le modal s'ouvre, on focus le bouton annuler et on retient l'élément précédent
watch(() => notificationStore.confirmModal.show, async (show) => {
  if (show) {
    previouslyFocused = document.activeElement
    await nextTick()
    cancelBtnRef.value?.focus()
  } else if (previouslyFocused) {
    previouslyFocused.focus()
    previouslyFocused = null
  }
})

const handleConfirm = () => {
  if (notificationStore.confirmModal.onConfirm) {
    notificationStore.confirmModal.onConfirm()
  }
}

const handleCancel = () => {
  if (notificationStore.confirmModal.onCancel) {
    notificationStore.confirmModal.onCancel()
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative {
  transform: scale(0.9);
  opacity: 0;
}

.modal-leave-to .relative {
  transform: scale(0.9);
  opacity: 0;
}
</style>
