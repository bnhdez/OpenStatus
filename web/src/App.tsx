function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-950">
      {/* 1. Título con Tailwind puro v4 */}
      <h1 className="text-5xl font-bold text-emerald-400">OpenStatus 📡</h1>

      {/* 2. Componente con tu estilo SaSS custom */}
      <div className="card-custom">
        <h2>Panel de Control</h2>
        <p>Estilizado con SaSS y @apply</p>
      </div>
    </div>
  );
}

export default App;
