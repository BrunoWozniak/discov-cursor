describe('Todos App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads and displays the main heading', () => {
    cy.contains(/todo/i);
  });

  it('can add a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('E2E Todo');
    cy.contains('Add').click();
    cy.contains('E2E Todo').should('exist');
  });

  it('can edit a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Edit Me');
    cy.contains('Add').click();
    cy.contains('Edit Me').parent().find('button[aria-label="Edit"]').click();
    cy.get('textarea').clear().type('Edited Todo');
    cy.get('button[aria-label="Save"]').click();
    cy.contains('Edited Todo').should('exist');
  });

  it('can delete a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Delete Me');
    cy.contains('Add').click();
    cy.contains('Delete Me').parent().find('button[aria-label="Delete"]').click();
    cy.contains('Confirm').click();
    cy.contains('Delete Me').should('not.exist');
  });

  it('can toggle a todo as completed', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Complete Me');
    cy.contains('Add').click();
    cy.contains('Complete Me').parent().find('input[type="checkbox"]').check({ force: true });
    cy.contains('Complete Me').parent().should('have.class', 'completed');
  });

  it('shows error for too long todo title', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('x'.repeat(81));
    cy.contains('Add').click();
    cy.contains(/cannot exceed 80 characters/i).should('exist');
  });

  it('can toggle dark mode', () => {
    cy.get('button[aria-label="Toggle dark mode"]').click();
    cy.get('body').should('have.class', 'dark-mode');
    cy.get('button[aria-label="Toggle dark mode"]').click();
    cy.get('body').should('have.class', 'light-mode');
  });
}); 