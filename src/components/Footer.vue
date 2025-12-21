<template>
  <footer class="bg-black border-t border-gray-800 pt-16 pb-8 mt-16">
    <div class="max-w-[90rem] mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

        <div class="col-span-1">
          <div class="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mb-6 block cursor-pointer w-fit">
            cineverse
          </div>
          <p class="text-gray-400 text-sm leading-relaxed mb-6">
            Votre univers cinématographique personnel. Explorez, notez et partagez votre passion pour le septième art avec une communauté de passionnés. Rejoignez-nous pour découvrir des pépites cachées.
          </p>
          <div class="flex space-x-4">
            <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer">
              <span class="text-xs">FB</span>
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer">
              <span class="text-xs">X</span>
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer">
              <span class="text-xs">IG</span>
            </div>
            <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer">
              <span class="text-xs">YT</span>
            </div>
          </div>
        </div>

        <div class="md:justify-self-end md:pr-16">
          <h4 class="text-white font-semibold mb-6 uppercase tracking-wider text-sm cursor-default w-fit">Informations</h4>
          <ul class="space-y-4">
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Box Office Hebdo</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Festivals & Récompenses</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Critiques Presse</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Prochaines sorties</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Actualités</li>
          </ul>
        </div>

        <div class="md:justify-self-end md:pr-12">
          <h4 class="text-white font-semibold mb-6 uppercase tracking-wider text-sm cursor-default w-fit">Légal</h4>
          <ul class="space-y-4">
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Conditions d'utilisation</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Politique de confidentialité</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Gestion des cookies</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Mentions légales</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Droits d'auteur</li>
          </ul>
        </div>

        <div class="md:justify-self-end md:pr-8">
          <h4 class="text-white font-semibold mb-6 uppercase tracking-wider text-sm cursor-default w-fit">En savoir plus</h4>
          <ul class="space-y-4">
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">À propos de Cineverse</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Centre d'aide</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Contactez-nous</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Devenir partenaire</li>
            <li class="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer w-fit">Recrutement</li>
          </ul>
        </div>

      </div>

      <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="text-gray-500 text-xs cursor-default">
          © {{ new Date().getFullYear() }} Cineverse. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>