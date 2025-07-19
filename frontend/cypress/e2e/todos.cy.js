describe('Todos App', () => {
  beforeEach(() => {
    // Clear all todos before each test (requires backend DELETE /todos endpoint)
    cy.request('DELETE', '/todos');
    cy.wait(1000); // Give backend time to process
    cy.intercept('POST', '**/todos').as('addTodo');
    cy.intercept('GET', '**/todos').as('getTodos');
    cy.intercept('PATCH', '**/todos/*').as('patchTodo');
    cy.intercept('DELETE', '**/todos/*').as('deleteTodo');
    cy.visit('/');
  });

  it('debug: check what is on the page', () => {
    cy.log('Page URL:', cy.url());
    cy.get('body').then(($body) => {
      cy.log('Body HTML:', $body.html());
    });
    cy.get('html').then(($html) => {
      cy.log('Page title:', $html.find('title').text());
    });
  });

  it('loads and displays the main heading', () => {
    cy.contains(/todo/i);
  });

  it('can add a todo', () => {
    cy.get('input[placeholder="Add a new todo..."]').type('E2E Todo');
    cy.contains('Add').click();
    cy.wait('@addTodo').then((interception) => {
      cy.log('Add Todo response:', JSON.stringify(interception.response));
    });
    cy.wait('@getTodos').then((interception) => {
      cy.log('Get Todos response:', JSON.stringify(interception.response));
    });
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
    cy.contains('Title cannot exceed 80 characters').should('exist');
  });

  it('can toggle dark mode', () => {
    cy.get('button[aria-label="Toggle dark mode"]').click();
    cy.get('body').should('have.class', 'dark-mode');
    cy.get('button[aria-label="Toggle dark mode"]').click();
    cy.get('body').should('have.class', 'light-mode');
  });

  it('can reach backend and fetch todos', () => {
    cy.request('GET', '/todos').then((resp) => {
      cy.log('Backend /todos response:', JSON.stringify(resp.body));
      expect(resp.status).to.eq(200);
      expect(Array.isArray(resp.body)).to.be.true;
    });
  });
});

afterEach(() => {
  // Log all API calls for debugging
  cy.get('@addTodo.all').then((calls) => {
    if (calls && calls.length) {
      cy.log('Add Todo API calls:', calls.length);
    }
  });
  cy.get('@getTodos.all').then((calls) => {
    if (calls && calls.length) {
      cy.log('Get Todos API calls:', calls.length);
    }
  });
  cy.get('@patchTodo.all').then((calls) => {
    if (calls && calls.length) {
      cy.log('Patch Todo API calls:', calls.length);
    }
  });
  cy.get('@deleteTodo.all').then((calls) => {
    if (calls && calls.length) {
      cy.log('Delete Todo API calls:', calls.length);
    }
  });
}); 