<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from "@/components/Footer.vue";
import ToastNotifications from '@/components/ToastNotifications.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
    <Footer />

    <!-- Système de notifications -->
    <ToastNotifications />
    <ConfirmModal />
  </div>
</template>

<style scoped></style>
