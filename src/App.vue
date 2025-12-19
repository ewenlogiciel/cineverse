<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
