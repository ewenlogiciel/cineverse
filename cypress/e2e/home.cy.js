describe('Partie Publique', () => {
  it('doit charger la page d\'accueil avec le titre Cineverse', () => {
    cy.visit('/')

    // On vérifie que le nom du site "cineverse" est présent dans la navbar
    cy.get('nav').should('contain', 'cineverse')
  })

  it('doit afficher une liste de films', () => {
    cy.visit('/')

    // Attendre que la liste de films soit présente
    cy.get('[data-test="movies-list"]').should('exist')

    // Vérifier qu'il y a au moins un lien vers un film
    cy.get('[data-test="movies-list"]').find('a').should('have.length.at.least', 1)
  })

  it('doit afficher un film en vedette (hero)', () => {
    cy.visit('/')

    // Attendre que les films soient chargés
    cy.get('[data-test="movies-list"]').should('exist')

    // Vérifier qu'il y a un titre de film en vedette (h1)
    cy.get('h1').should('be.visible')

    // Vérifier qu'il y a un bouton "Plus d'infos"
    cy.contains('Plus d\'infos').should('be.visible')
  })

  it('doit naviguer vers la page de détail d\'un film', () => {
    cy.visit('/')

    // Attendre que les films soient chargés
    cy.get('[data-test="movies-list"]').should('exist')

    // Cliquer sur le premier film
    cy.get('[data-test="movies-list"]').find('a').first().click()

    // Vérifier qu'on est bien sur une page de film
    cy.url().should('include', '/films/')

    // Attendre que la page de détail soit chargée en vérifiant qu'il y a un titre h1
    cy.get('h1').should('be.visible')

    // Vérifier que la section commentaires est présente (attendre qu'elle se charge)
    cy.contains('Commentaires', { timeout: 10000 }).should('be.visible')
  })

  it('doit afficher la navbar avec les liens de navigation', () => {
    // Configurer une taille d'écran large pour voir tous les éléments
    cy.viewport(1280, 720)
    cy.visit('/')

    // Vérifier la présence de la navbar
    cy.get('nav').should('be.visible')

    // Vérifier les liens de navigation (visibles sur grands écrans)
    cy.get('nav').contains('Accueil').should('be.visible')
    cy.get('nav').contains('Connexion').should('be.visible')
    cy.get('nav').contains('Inscription').should('be.visible')
  })
})