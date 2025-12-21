describe('Utilisateur Connecté', () => {
    it('doit permettre à un utilisateur de se connecter', () => {
        cy.visit('/login')

        // On utilise l'ID détecté par Cypress (#email)
        cy.get('#email').type('votre@email.com')

        // Fais la même chose pour le mot de passe :
        // Clique sur l'input password avec la cible pour voir son ID (probablement #password)
        cy.get('#password').type('votre_password')

        cy.get('button[type="submit"]').click()

        // Vérification après connexion
        cy.url().should('not.include', '/login')
    })
})