import { useSites } from "./hooks/useSites";

function App() {
  const { sites, loading } = useSites();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-950">
      <h1 className="text-5xl font-bold text-emerald-400">OpenStatus 📡</h1>

      <div className="card-custom">
        <h2>Panel de Control</h2>
        
        {loading ? (
            <p className="text-slate-400">Cargando motor...</p>
        ) : (
          <ul className="space-y-2 text-left">
            {sites.map((site) => (
              <li key={site.id} className="text-slate-200 bg-slate-800 p-2 rounded border border-slate-700">
                <span className="font-bold text-emerald-300">{site.name}: </span> 
                {site.url}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;