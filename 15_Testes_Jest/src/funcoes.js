export function somar(a, b) {
  return a + b;
}

export function subtrair(a, b) {
  return a - b;
}

export function validarCPF(cpf) {
  if (!cpf) return false;
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;
  return true;
}

export function ehPar(numero) {
  return numero % 2 === 0;
}

export function calcularMedia(notas) {
  if (!notas || notas.length === 0) return 0;
  return notas.reduce((acc, n) => acc + n, 0) / notas.length;
}
