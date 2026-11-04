import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Build + Vite + React</h1>
      <p>Exemplo de build de produção com Vite.</p>
      <button onClick={() => setCount(c => c + 1)}>
        Cliques: {count}
      </button>
    </div>
  );
}

export default App;
