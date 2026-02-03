import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useSites } from "./hooks/useSites";

function App() {
  const { sites, loading } = useSites();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-950">
      <h1 className="text-5xl font-bold text-emerald-400 mb-7">OpenStatus 📡</h1>

      <div className="card-custom">
        <h2 className="mb-5">Panel de Control</h2>
        
        {loading ? (
            <p className="text-slate-400">Cargando métricas...</p>
        ) : (
          <ul className="space-y-2 text-left">
            {sites.map((site) => (
              <li key={site.id} className="bg-slate-800 p-3 rounded border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="font-bold text-emerald-300 text-lg">{site.name}</div>
                    <div className="text-xs text-slate-400">{site.url}</div>
                  </div>

                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      site.last_status === 200 ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {site.last_status === 200 ? 'ONLINE' : 'ERROR'}
                    </span>
                  </div>
                </div>

                <div className="h-[100px] w-[250px]"> 
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={site.latency_history}>
                      <XAxis dataKey="time" hide/>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
                        itemStyle={{ color: "#34d399" }}
                        labelStyle={{ color: "#94a3b8", fontSize: "12px", marginBottom: "5px" }}
                        formatter={(value) => [`${value}ms`, "Latencia"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="latency" // <-- viene de HistoryPoint[]
                        stroke="#10b981" // Color Esmeralda
                        strokeWidth={2} 
                        dot={false} // Sin puntos para que se vea limpio
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
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