describe('Página de Login', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-view="login"]').click();
  });

  it('deve exibir o formulário de login', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Entrar');
  });

  it('deve exibir erro para credenciais inválidas', () => {
    cy.get('input[type="email"]').type('invalido@email.com');
    cy.get('input[type="password"]').type('senha_errada');
    cy.get('button[type="submit"]').click();
    cy.contains('Credenciais inválidas').should('be.visible');
  });

  it('deve exibir dashboard ao fazer login com sucesso', () => {
    cy.get('input[type="email"]').type('admin@email.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    cy.contains('Bem-vindo, admin!').should('be.visible');
  });
});
