import { render, screen, fireEvent } from '@testing-library/react';
import Contador from '../components/Contador';

describe('Componente Contador', () => {
  test('deve iniciar com valor 0', () => {
    render(<Contador />);
    expect(screen.getByTestId('valor')).toHaveTextContent('0');
  });

  test('deve incrementar ao clicar no botão', () => {
    render(<Contador />);
    fireEvent.click(screen.getByText('Incrementar'));
    expect(screen.getByTestId('valor')).toHaveTextContent('1');
  });

  test('deve decrementar ao clicar no botão', () => {
    render(<Contador />);
    fireEvent.click(screen.getByText('Decrementar'));
    expect(screen.getByTestId('valor')).toHaveTextContent('-1');
  });

  test('deve zerar ao clicar em Zerar', () => {
    render(<Contador />);
    fireEvent.click(screen.getByText('Incrementar'));
    fireEvent.click(screen.getByText('Incrementar'));
    fireEvent.click(screen.getByText('Zerar'));
    expect(screen.getByTestId('valor')).toHaveTextContent('0');
  });
});
