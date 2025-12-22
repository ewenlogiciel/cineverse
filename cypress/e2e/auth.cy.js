// cypress/e2e/auth.cy.js

describe('Test d\'Authentification', () => {

    beforeEach(() => {
        cy.visit('/login')
    })

    it('Doit connecter l\'utilisateur avec succès et rediriger vers l\'accueil', () => {

        cy.get('input[type="email"]').type('test@gmail.com')
        cy.get('input[type="password"]').type('123456')


        cy.get('button').contains(/connexion|se connecter/i).click()


        cy.url().should('eq', Cypress.config().baseUrl + '/')


        cy.contains('Déconnexion').should('be.visible')
    })

    it('Doit afficher une erreur si le mot de passe est faux', () => {
        cy.get('input[type="email"]').type('ewen.davanzo@gmail.com')
        cy.get('input[type="password"]').type('MAUVAIS_MOT_DE_PASSE')
        cy.get('button').contains(/connexion|se connecter/i).click()

        cy.url().should('include', '/login')

        cy.contains(/invalide|erreur|incorrect/i).should('be.visible')
    })
})