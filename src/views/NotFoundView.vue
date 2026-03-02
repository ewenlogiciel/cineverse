<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 class="text-8xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-4">
      404
    </h1>
    <p class="text-2xl font-semibold text-white mb-2">Page introuvable</p>
    <p class="text-gray-400 mb-8 max-w-md">
      La page que vous recherchez n'existe pas ou a été déplacée.
    </p>
    <router-link
        to="/"
        class="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium transition-all hover:from-red-500 hover:to-red-600"
    >
      Retour à l'accueil
    </router-link>
  </div>
</template>
