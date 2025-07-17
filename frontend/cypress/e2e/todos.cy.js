describe('Todos App', () => {
  it('loads and displays the main heading', () => {
    cy.visit('/');
    cy.contains(/todo/i);
  });
}); 