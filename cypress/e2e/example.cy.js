describe('Partie Publique', () => {
  it('doit charger la page d accueil avec le titre Cineverse', () => {
    cy.visit('/')
    // On vérifie que le nom de votre site est présent
    cy.get('h1').should('contain', 'cineverse')
  })

  it('doit afficher une liste de films', () => {
    cy.visit('/')
    // On vérifie qu'il y a au moins une carte de film ou un élément de liste
    // Adaptez le sélecteur (.movie-card) à votre code HTML
    cy.get('.movie-card').should('have.length.at.least', 1)
  })
})