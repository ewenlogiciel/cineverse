
describe('Test de la Recherche de Films', () => {

    beforeEach(() => {
        cy.visit('/')
        cy.get('nav').should('exist')
    })

    it('Scénario 1 : La recherche fonctionne et trouve un film', () => {
        const filmExistant = 'Silence'

        cy.get('input[placeholder="Rechercher un film"]')
            .type(filmExistant)

        cy.wait(1000) // Un peu de marge pour l'API

        cy.get('[data-test="movies-list"]').should('exist')

        cy.contains(filmExistant).should('be.visible')
    })

    it('Scénario 2 : La recherche ne donne aucun résultat', () => {
        const filmInexistant = 'XyZ123FilmIntrouvable'

        cy.get('input[placeholder="Rechercher un film"]')
            .type(filmInexistant)

        cy.wait(1000)

        cy.get('[data-test="no-results"]').should('be.visible')
        cy.contains('Aucun film trouvé').should('be.visible')

        cy.get('[data-test="movies-list"]').should('not.exist')
    })
})