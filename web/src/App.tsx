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
    <div className="min-h-screen flex flex-col items-center text-zinc-200 pb-10 relative overflow-hidden bg-black">

      {/* --- FONDO MÁGICO --- */}
      <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-indigo-500 opacity-20 blur-[100px] m-auto pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none"></div>
      
      <div className="relative z-10 w-full">
          <Navbar 
            session={session} 
            onLogin={() => setIsLoginOpen(true)} 
            onLogout={logout} 
          />
      </div>

      <main className="relative w-full max-w-5xl px-4 mt-8 flex flex-col gap-8">

        {session && (
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6 w-full shadow-2xl relative overflow-hidden">
              <p className="text-indigo-400 font-bold mb-5">Modo Administrador Activo</p>
              <AddSiteForm onSiteAdded={ refresh } />
          </div>
        )}

        <div className="w-full">
          <h2 className="text-xl font-medium text-zinc-100 mb-6 tracking-tight">Live Monitors</h2>
          
          {loading ? (
              <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
          ) : (
            /* Usamos grid para diseño tipo tarjetas */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <footer className="mt-auto py-8 text-zinc-600 text-xs">
        <span>© 2026 OpenStatus - Design and code by Boris Hernández</span>
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