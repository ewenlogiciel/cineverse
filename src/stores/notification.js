import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const confirmModal = ref({
    show: false,
    title: '',
    message: '',
    confirmText: 'Confirmer',
    cancelText: 'Annuler',
    onConfirm: null,
    onCancel: null,
  })

  let notificationId = 0

  // Ajoute une notification toast
  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = ++notificationId
    notifications.value.push({
      id,
      message,
      type, // 'success', 'error', 'info', 'warning'
      duration,
    })

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  // Raccourcis pour les différents types
  const success = (message, duration = 3000) => addNotification(message, 'success', duration)
  const error = (message, duration = 4000) => addNotification(message, 'error', duration)
  const info = (message, duration = 3000) => addNotification(message, 'info', duration)
  const warning = (message, duration = 3500) => addNotification(message, 'warning', duration)

  // Retire une notification
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  // Affiche une modale de confirmation
  const confirm = (options) => {
    return new Promise((resolve) => {
      confirmModal.value = {
        show: true,
        title: options.title || 'Confirmation',
        message: options.message || 'Êtes-vous sûr ?',
        confirmText: options.confirmText || 'Confirmer',
        cancelText: options.cancelText || 'Annuler',
        onConfirm: () => {
          confirmModal.value.show = false
          resolve(true)
        },
        onCancel: () => {
          confirmModal.value.show = false
          resolve(false)
        },
      }
    })
  }

  return {
    notifications,
    confirmModal,
    addNotification,
    success,
    error,
    info,
    warning,
    removeNotification,
    confirm,
  }
})
