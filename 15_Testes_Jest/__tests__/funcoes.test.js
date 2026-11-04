import { somar, subtrair, validarCPF, ehPar, calcularMedia } from '../src/funcoes.js';

describe('Funções matemáticas', () => {
  test('somar deve retornar a soma correta', () => {
    expect(somar(2, 3)).toBe(5);
    expect(somar(-1, 1)).toBe(0);
    expect(somar(0, 0)).toBe(0);
    expect(somar(1.5, 2.5)).toBe(4);
  });

  test('subtrair deve retornar a diferença correta', () => {
    expect(subtrair(5, 3)).toBe(2);
    expect(subtrair(0, 5)).toBe(-5);
  });
});

describe('Função ehPar', () => {
  test('deve retornar true para números pares', () => {
    expect(ehPar(2)).toBe(true);
    expect(ehPar(0)).toBe(true);
    expect(ehPar(-4)).toBe(true);
  });

  test('deve retornar false para números ímpares', () => {
    expect(ehPar(3)).toBe(false);
    expect(ehPar(7)).toBe(false);
    expect(ehPar(-1)).toBe(false);
  });
});

describe('Função validarCPF', () => {
  test('deve aceitar CPF válido', () => {
    expect(validarCPF('529.982.247-25')).toBe(true);
  });

  test('deve rejeitar CPF com dígitos iguais', () => {
    expect(validarCPF('111.111.111-11')).toBe(false);
  });

  test('deve rejeitar CPF vazio', () => {
    expect(validarCPF('')).toBe(false);
    expect(validarCPF(null)).toBe(false);
  });

  test('deve rejeitar CPF inválido', () => {
    expect(validarCPF('123.456.789-00')).toBe(false);
  });
});

describe('Função calcularMedia', () => {
  test('deve calcular média correta', () => {
    expect(calcularMedia([7, 8, 9])).toBe(8);
    expect(calcularMedia([10, 10, 10])).toBe(10);
  });

  test('deve retornar 0 para array vazio', () => {
    expect(calcularMedia([])).toBe(0);
  });
});
