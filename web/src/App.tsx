import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useSites } from "./hooks/useSites";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import LoginModal from "./components/LoginModal";

function App() {
  const { sites, loading } = useSites();
  const { session, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-950">
      <h1 className="text-5xl font-bold text-emerald-400 mb-7">OpenStatus 📡</h1>

      {session && (
        <div className="mb-8 p-4 border border-emerald-800 bg-emerald-900/20 rounded w-full max-w-lg text-center">
            <p className="text-emerald-400 font-bold">Modo Administrador Activo</p>
            {/* Aquí luego pondremos el AddSiteForm */}
        </div>
      )}

      <div className="card-custom">
        <h2 className="mb-5">Panel de Control</h2>
        
        {loading ? (
            <p className="text-slate-400">Cargando métricas...</p>
        ) : (
          <ul className="space-y-2 text-left">
            {sites.map((site) => (
              <li key={site.id} className="relative bg-slate-800 p-3 rounded border border-slate-700">
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

                {/* BOTÓN DE BORRAR (SOLO ADMIN) */}
                {/* Usamos 'absolute' para ponerlo en la esquina y que no estorbe */}
                {session && (
                    <button 
                        className="absolute bottom-2 right-2 p-1 bg-red-900/50 text-red-400 rounded hover:bg-red-600 hover:text-white transition-colors z-10"
                        title="Eliminar sitio"
                        onClick={() => { /* Lógica de borrar pendiente */ }}
                    >
                        <Trash2 size={16} />
                    </button>
                )}

              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- FOOTER DISCRETO --- */}
      <footer className="fixed bottom-4 text-slate-800 text-xs flex gap-2 items-center">
        <span>© 2026 OpenStatus</span>
        
        {/* EL GATILLO SECRETO */}
        {session ? (
            <button onClick={() => logout()} className="hover:text-red-500 transition-colors">
                (Salir)
            </button>
        ) : (
            <button onClick={() => setIsLoginOpen(true)} className="hover:text-slate-600 transition-colors">
                <span>
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
            </button>
        )}
      </footer>

      {/* EL MODAL */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    </div>
  );
}

export default App;