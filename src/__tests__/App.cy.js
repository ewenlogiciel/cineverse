import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue' // Ajuste le chemin si nécessaire

describe('Tests du composant principal', () => {
  let pinia
  let router

  beforeEach(() => {
    // 1. Initialiser Pinia
    pinia = createPinia()
    setActivePinia(pinia)

    // 2. Initialiser un Router de test (optionnel mais recommandé)
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
    })
  })

  it('doit monter l\'application sans erreur Pinia', () => {
    // 3. Monter le composant avec les plugins globaux
    cy.mount(App, {
      global: {
        plugins: [pinia, router]
      }
    })

    // Vérification de base
    cy.get('body').should('exist')
  })
})