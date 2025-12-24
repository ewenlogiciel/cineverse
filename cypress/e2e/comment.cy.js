// cypress/e2e/comment.cy.js

describe('Test d\'Ajout de Commentaire', () => {

    beforeEach(() => {
        // Se connecter avant chaque test
        cy.visit('/login')
        cy.get('input[type="email"]').type('test@gmail.com')
        cy.get('input[type="password"]').type('123456')
        cy.get('button').contains(/connexion|se connecter/i).click()

        // Attendre la redirection vers l'accueil
        cy.url().should('eq', Cypress.config().baseUrl + '/')

        // Cliquer sur le premier film disponible pour accéder à sa page de détail
        cy.get('[data-test="movies-list"]').should('exist')
        cy.get('[data-test="movies-list"]').find('a').first().click()

        // Attendre que la page de détail soit chargée
        cy.url().should('include', '/films/')
    })

    it('Doit permettre d\'ajouter un commentaire avec succès', () => {
        const commentText = 'Excellent film ! Test automatique - ' + Date.now()

        // Vérifier que le formulaire de commentaire est présent
        cy.get('textarea[placeholder="Écrire un commentaire..."]').should('be.visible')

        // Remplir le champ de commentaire
        cy.get('textarea[placeholder="Écrire un commentaire..."]').type(commentText)

        // Vérifier que le bouton de soumission est activé
        cy.get('button').contains('Publier le commentaire').should('not.be.disabled')

        // Soumettre le commentaire
        cy.get('button').contains('Publier le commentaire').click()

        // Vérifier que la notification de succès s'affiche
        cy.contains('Commentaire ajouté avec succès').should('be.visible')

        // Vérifier que le commentaire apparaît dans la liste
        cy.contains(commentText).should('be.visible')

        // Vérifier que le champ de commentaire est vidé après soumission
        cy.get('textarea[placeholder="Écrire un commentaire..."]').should('have.value', '')
    })

    it('Doit désactiver le bouton si le commentaire est vide', () => {
        // Vérifier que le bouton est désactivé quand le champ est vide
        cy.get('button').contains('Publier le commentaire').should('be.disabled')

        // Taper un commentaire puis l'effacer
        cy.get('textarea[placeholder="Écrire un commentaire..."]').type('Test')
        cy.get('button').contains('Publier le commentaire').should('not.be.disabled')

        cy.get('textarea[placeholder="Écrire un commentaire..."]').clear()
        cy.get('button').contains('Publier le commentaire').should('be.disabled')
    })

    it('Doit afficher un message de connexion si l\'utilisateur n\'est pas authentifié', () => {
        // Se déconnecter
        cy.contains('Déconnexion').click()

        // Vérifier la notification de déconnexion
        cy.contains('Vous avez été déconnecté avec succès').should('be.visible')

        // Attendre un peu pour que la notification disparaisse et que la page se rafraîchisse
        cy.wait(500)

        // Naviguer vers un film
        cy.get('[data-test="movies-list"]').should('exist')
        cy.get('[data-test="movies-list"]').find('a').first().click()

        // Attendre que l'URL change et que la page soit chargée
        cy.url().should('include', '/films/')

        // Attendre que la section commentaires soit chargée
        cy.contains('Commentaires').should('be.visible')

        // Vérifier que le formulaire n'est pas visible
        cy.get('textarea[placeholder="Écrire un commentaire..."]').should('not.exist')

        // Vérifier le message de connexion
        cy.contains('Connectez-vous').should('be.visible')
        cy.contains('pour laisser un commentaire').should('be.visible')
    })
})
