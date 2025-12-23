<template>
  <Transition name="modal">
    <div
        v-if="notificationStore.confirmModal.show"
        class="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        @click.self="handleCancel"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <!-- Modal -->
      <div class="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-800">
          <h3 class="text-xl font-bold text-white">
            {{ notificationStore.confirmModal.title }}
          </h3>
        </div>

        <!-- Body -->
        <div class="px-6 py-6">
          <p class="text-gray-300 text-base leading-relaxed">
            {{ notificationStore.confirmModal.message }}
          </p>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-black/40 flex gap-3 justify-end">
          <button
              @click="handleCancel"
              class="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
          >
            {{ notificationStore.confirmModal.cancelText }}
          </button>
          <button
              @click="handleConfirm"
              class="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            {{ notificationStore.confirmModal.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

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
