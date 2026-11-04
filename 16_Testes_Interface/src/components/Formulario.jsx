import { useState } from 'react';

export default function Formulario() {
  const [nome, setNome] = useState('');
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (nome.trim()) setEnviado(true);
  }

  if (enviado) {
    return <p data-testid="sucesso">Cadastro realizado!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nome">Nome</label>
      <input
        id="nome"
        data-testid="campo-nome"
        value={nome}
        onChange={e => setNome(e.target.value)}
        placeholder="Digite seu nome"
      />
      <button type="submit" data-testid="btn-enviar" disabled={!nome.trim()}>
        Enviar
      </button>
    </form>
  );
}
