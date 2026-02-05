import { useSites } from "./hooks/useSites";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";
import LoginModal from "./components/LoginModal";
import AddSiteForm from "./components/AddSiteForm";
import { DeleteModal } from "./components/DeleteModal";
import { SiteCard } from "./components/SiteCard";
import { Navbar } from "./components/Navbar";

function App() {
  const { sites, loading, refresh } = useSites();
  const { session, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [siteToDelete, setsiteToDelete] = useState<{ id: number, name: string } | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 bg-slate-950">
      
      <Navbar 
        session={session} 
        onLogin={() => setIsLoginOpen(true)} 
        onLogout={logout} 
      />

      <main className="w-full max-w-5xl px-4 mt-8 flex flex-col gap-8">

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

      </main>

      <footer className="mt-auto py-6 text-slate-600 text-xs">
        <span>© 2026 OpenStatus</span>
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