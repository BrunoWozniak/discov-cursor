const API_BASE = 'http://backend-server-test:4000';

describe('Todos App', () => {
  beforeEach(() => {
    cy.intercept({ url: '**', middleware: true }, (req) => {
      // Log every request to the terminal
      // eslint-disable-next-line no-console
      console.log('CYPRESS NETWORK:', req.method, req.url);
    });
    cy.intercept('POST', '**').as('anyPost');
    cy.request({
      method: 'DELETE',
      url: `${API_BASE}/todos`,
      failOnStatusCode: false
    });
    cy.wait(2000); // Wait to ensure backend is ready
    cy.visit('/');
  });

  it('loads and displays the main heading', () => {
    cy.contains(/todo/i);
  });

  it('can add a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').should('exist');
    cy.get('input[placeholder="Add a new todo..."]').type('E2E Todo').should('have.value', 'E2E Todo');
    cy.get('form').submit();
    cy.wait(500); // Minimal wait for UI update
    cy.contains('E2E Todo').should('exist');
  });

  it('can edit a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Edit Me');
    cy.get('form').submit();
    cy.wait(1000);
    cy.contains('Edit Me').should('exist');
    cy.contains('Edit Me').parent().find('button[aria-label="Edit"]').click();
    cy.get('textarea').should('exist').clear().type('Edited Todo');
    cy.get('button[aria-label="Save"]').click();
    cy.contains('Edited Todo').should('exist');
  });

  it('can cancel editing a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Cancel Edit');
    cy.get('form').submit();
    cy.wait(1000);
    cy.contains('Cancel Edit').should('exist');
    cy.contains('Cancel Edit').parent().find('button[aria-label="Edit"]').click();
    cy.get('textarea').should('exist').clear().type('Should Not Save');
    cy.get('button[aria-label="Cancel"]').click();
    cy.contains('Cancel Edit').should('exist');
    cy.contains('Should Not Save').should('not.exist');
  });

  it('can delete a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Delete Me');
    cy.get('form').submit();
    cy.wait(1000);
    cy.contains('Delete Me').should('exist');
    cy.get('button[aria-label="Delete"]').first().click({ force: true });
    cy.contains('Delete Todo').should('exist');
    cy.get('button[aria-label="Delete"]').last().click();
    cy.contains('Delete Me').should('not.exist');
  });

  it('can toggle a todo as completed', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Complete Me');
    cy.get('form').submit();
    cy.wait(1000);
    cy.contains('Complete Me').should('exist');
    cy.get('button[role="checkbox"]').first().click({ force: true });
    cy.contains('Complete Me').should('have.class', 'line-through');
  });

  it('can filter todos', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Active Todo');
    cy.get('form').submit();
    cy.wait(1000);
    cy.get('input[placeholder="Add a new todo..."]').type('Completed Todo');
    cy.get('form').submit();
    cy.wait(1000);
    cy.get('button[role="checkbox"]').last().click({ force: true });
    // Filter to active
    cy.contains('Active').click();
    cy.contains('Active Todo').should('exist');
    cy.contains('Completed Todo').should('not.exist');
    // Filter to completed
    cy.contains('Completed').click();
    cy.contains('Completed Todo').should('exist');
    cy.contains('Active Todo').should('not.exist');
    // Filter to all
    cy.contains(/^All$/).click();
    cy.contains('Active Todo').should('exist');
    cy.contains('Completed Todo').should('exist');
  });

  it('can reach backend and fetch todos', () => {
    cy.request('GET', `${API_BASE}/todos`).then((resp) => {
      expect(resp.status).to.eq(200);
      expect(Array.isArray(resp.body)).to.be.true;
    });
  });
});

 