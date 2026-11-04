import { render, screen } from '@testing-library/react';
import Saudacao from '../components/Saudacao';

describe('Componente Saudacao', () => {
  test('deve renderizar saudação com o nome fornecido', () => {
    render(<Saudacao nome="Maria" />);
    expect(screen.getByText('Olá, Maria!')).toBeInTheDocument();
  });

  test('deve renderizar "Olá, !" quando nome é vazio', () => {
    render(<Saudacao nome="" />);
    expect(screen.getByText('Olá, !')).toBeInTheDocument();
  });
});
