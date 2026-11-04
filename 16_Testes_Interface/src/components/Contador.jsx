import { useState } from 'react';

export default function Contador() {
  const [valor, setValor] = useState(0);

  return (
    <div>
      <p>Valor: <span data-testid="valor">{valor}</span></p>
      <button onClick={() => setValor(v => v + 1)}>Incrementar</button>
      <button onClick={() => setValor(v => v - 1)}>Decrementar</button>
      <button onClick={() => setValor(0)}>Zerar</button>
    </div>
  );
}
