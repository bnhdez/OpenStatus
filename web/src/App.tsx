import { useSites } from "./hooks/useSites";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";
import LoginModal from "./components/LoginModal";
import AddSiteForm from "./components/AddSiteForm";
import { DeleteModal } from "./components/DeleteModal";
import { SiteCard } from "./components/SiteCard";

function App() {
  const { sites, loading, refresh } = useSites();
  const { session, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [siteToDelete, setsiteToDelete] = useState<{ id: number, name: string } | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 bg-slate-950 py-10">
      <h1 className="text-5xl font-bold text-emerald-400 mb-7">OpenStatus 📡</h1>

      {session && (
        <div className="mb-8 p-4 border border-emerald-800 bg-emerald-900/20 rounded w-full max-w-lg text-center">
            <p className="text-emerald-400 font-bold mb-5">Modo Administrador Activo</p>
            <AddSiteForm onSiteAdded={ refresh } />
        </div>
      )}

      <div className="card-custom">
        <h2 className="mb-5">Panel de Control</h2>
        
        {loading ? (
            <p className="text-slate-400">Cargando métricas...</p>
        ) : (
          /* Usamos grid para diseño tipo tarjetas */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
            {sites.map((site) => (
              <SiteCard 
                key={site.siteId}
                
                // Conectamos datos básicos
                siteName={site.name}
                url={site.url}
                
                // Convertimos tu status numérico (200, null) al string que pide el diseño ('online', 'pending')
                status={
                    site.last_status === 200 ? 'online' : 
                    site.last_status === null ? 'pending' : 'error'
                }
                
                // Pasamos el historial para la gráfica
                history={site.latency_history}
                
                // Conectamos el borrado
                onDelete={session ? () => setsiteToDelete({ id: site.siteId, name: site.name }) : undefined}
              />
            ))}
          </div>
        )}
        
      </div>

      {/* --- FOOTER DISCRETO --- */}
      <footer className="text-slate-500 text-xs flex gap-2 items-center mt-auto">
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
      
      <DeleteModal 
        siteName={siteToDelete?.name ?? ""}
        siteId={siteToDelete?.id ?? null} 
        onClose={() => setsiteToDelete(null)} 
        onDeleted={refresh}
      />

    </div>
  );
}

export default App;