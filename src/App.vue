<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from "@/components/Footer.vue";
import ToastNotifications from '@/components/ToastNotifications.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
</script>

<template>
  <div class="min-h-screen bg-black text-white overflow-x-hidden">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
      Aller au contenu principal
    </a>
    <Navbar />
    <main id="main-content" class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <Footer />

    <!-- Système de notifications -->
    <ToastNotifications />
    <ConfirmModal />
  </div>
</template>

<style scoped></style>
