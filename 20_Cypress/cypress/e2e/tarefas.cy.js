describe('Lista de Tarefas', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-view="tarefas"]').click();
  });

  it('deve permitir adicionar e remover tarefas', () => {
    cy.get('#nova-tarefa').type('Estudar Cypress');
    cy.get('#btn-adicionar').click();
    cy.contains('Estudar Cypress').should('be.visible');

    cy.get('input[type="checkbox"]').first().check();
    cy.contains('Estudar Cypress').should('have.class', 'concluida');

    cy.get('.remover').first().click();
    cy.contains('Estudar Cypress').should('not.exist');
  });

  it('deve adicionar multiplas tarefas', () => {
    const tarefas = ['Estudar React', 'Fazer exercícios', 'Revisar conteúdo'];

    tarefas.forEach(t => {
      cy.get('#nova-tarefa').type(t);
      cy.get('#btn-adicionar').click();
    });

    cy.get('#lista-tarefas li').should('have.length', 3);
    cy.contains('Estudar React').should('be.visible');
    cy.contains('Fazer exercícios').should('be.visible');
    cy.contains('Revisar conteúdo').should('be.visible');
  });
});
