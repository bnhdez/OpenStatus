import { useSites } from "./hooks/useSites";

function App() {
  const { sites, loading } = useSites();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-950">
      <h1 className="text-5xl font-bold text-emerald-400">OpenStatus 📡</h1>

      <div className="card-custom">
        <h2>Panel de Control</h2>
        
        {loading ? (
            <p className="text-slate-400">Cargando métricas...</p>
        ) : (
          <ul className="space-y-2 text-left">
            {sites.map((site) => (
              <li key={site.id} className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-700">
                <div>
                  <div className="font-bold text-emerald-300 text-lg">{site.name}</div>
                  <div className="text-xs text-slate-400">{site.url}</div>
                </div>

                {/* Columna Derecha: Estado (Lo nuevo) */}
                <div className="text-right">
                  {/* Badge de Latencia */}
                  <div className="text-xl font-mono font-bold text-white">
                    {site.last_latency ? `${site.last_latency}ms` : '-'}
                  </div>
                  {/* Badge de Status */}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    site.last_status === 200 ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {site.last_status === 200 ? 'ONLINE' : 'ERROR'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;