import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Formulario from '../components/Formulario';

describe('Componente Formulario', () => {
  test('deve desabilitar botão quando campo está vazio', () => {
    render(<Formulario />);
    expect(screen.getByTestId('btn-enviar')).toBeDisabled();
  });

  test('deve habilitar botão quando campo é preenchido', async () => {
    render(<Formulario />);
    const input = screen.getByTestId('campo-nome');
    await userEvent.type(input, 'Maria');
    expect(screen.getByTestId('btn-enviar')).toBeEnabled();
  });

  test('deve exibir mensagem de sucesso ao enviar', async () => {
    render(<Formulario />);
    const input = screen.getByTestId('campo-nome');
    await userEvent.type(input, 'Maria');
    await userEvent.click(screen.getByTestId('btn-enviar'));
    expect(screen.getByTestId('sucesso')).toHaveTextContent('Cadastro realizado!');
  });
});
