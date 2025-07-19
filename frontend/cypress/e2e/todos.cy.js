const API_BASE = 'http://backend-server-test:4000';

describe('Todos App', () => {
  beforeEach(() => {
    // Clear all todos before each test (requires backend DELETE /todos endpoint)
    cy.request({
      method: 'DELETE',
      url: `${API_BASE}/todos`,
      failOnStatusCode: false
    }).then((resp) => {
      cy.log('DELETE /todos status:', resp.status);
      cy.log('DELETE /todos body:', JSON.stringify(resp.body));
    });
    cy.wait(2000); // Increased wait time to ensure backend is ready
    cy.intercept('POST', '**/todos').as('addTodo');
    cy.intercept('GET', '**/todos').as('getTodos');
    cy.intercept('PATCH', '**/todos/*').as('patchTodo');
    cy.intercept('DELETE', '**/todos/*').as('deleteTodo');
    cy.visit('/');
  });



  it('loads and displays the main heading', () => {
    cy.contains(/todo/i);
  });

  it('can add a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').should('exist');
    cy.contains('Add').should('exist');
    cy.get('input[placeholder="Add a new todo..."]').type('E2E Todo');
    cy.contains('Add').click();
    cy.wait(2000); // Wait to see if anything appears
    cy.contains('E2E Todo').should('exist');
  });

  it('can edit a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Edit Me');
    cy.contains('Add').click();
    cy.contains('Edit Me').should('exist');
    cy.contains('Edit Me').click(); // Click the title to enter edit mode
    cy.get('textarea').should('exist').clear().type('Edited Todo');
    cy.get('button[aria-label="Save"]').should('exist').click();
    cy.contains('Edited Todo').should('exist');
  });

  it('can delete a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Delete Me');
    cy.contains('Add').click();
    cy.contains('Delete Me').should('exist');
    cy.contains('Delete Me').parent().find('button[aria-label="Delete"]').should('exist').click();
    cy.get('button[aria-label="Confirm"]').should('exist').click();
    cy.contains('Delete Me').should('not.exist');
  });

  it('can toggle a todo as completed', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('Complete Me');
    cy.contains('Add').click();
    cy.contains('Complete Me').should('exist');
    cy.contains('Complete Me').parent().find('input[type="checkbox"]').should('exist').check({ force: true });
    cy.contains('Complete Me').parent().parent().should('have.class', 'completed');
  });

  it('can toggle dark mode', () => {
    cy.get('button[aria-label="Toggle dark mode"]').should('exist').click();
    cy.get('body').should('have.class', 'dark-mode');
    cy.get('button[aria-label="Toggle dark mode"]').should('exist').click();
    cy.get('body').should('have.class', 'light-mode');
  });

  it('can reach backend and fetch todos', () => {
    cy.request('GET', `${API_BASE}/todos`).then((resp) => {
      cy.log('Backend /todos response:', JSON.stringify(resp.body));
      expect(resp.status).to.eq(200);
      expect(Array.isArray(resp.body)).to.be.true;
    });
  });

  it('can reach backend directly via service name', () => {
    cy.request('GET', `${API_BASE}/todos`).then((resp) => {
      cy.log('Direct backend /todos response:', JSON.stringify(resp.body));
      expect(resp.status).to.eq(200);
      expect(Array.isArray(resp.body)).to.be.true;
    });
  });
});

 