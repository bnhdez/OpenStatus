import { useEffect, useState } from "react";
import { supabaseClient } from "./lib/supabase";

interface Site {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
}

function App() {

  //para guardar la lista de sitios que devuelva la base de datos
  const [sites, setSites] = useState<Site[]>([]);

  // para ejecutar la peticion a la base de datos una sola vez
  useEffect(() => {
    async function fetchSites() {
      const { data, error } = await supabaseClient
        .from('sites')
        .select('*');

      if ( error ) { console.error('Error al obtener los sitios:', error); }
      if ( data ) { setSites(data); }
    }

    fetchSites();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-950">
      {/* 1. Título con Tailwind puro v4 */}
      <h1 className="text-5xl font-bold text-emerald-400">OpenStatus 📡</h1>

      {/* 2. Componente con tu estilo SaSS custom */}
      <div className="card-custom">
        <h2>Panel de Control</h2>
        
        {sites.length === 0 ? (
            <p className="text-slate-400">Cargando o sin sitios...</p>
        ) : (
          <ul className="space-y-2 text-left">
            {sites.map((site) => (
              <li key={site.id} className="text-slate-200 bg-slate-800 p-2 rounded border border-slate-700">
                {/* Mostramos nombre y URL */}
                <span className="font-bold text-emerald-300">{site.name}: </span> 
                {site.url}
              </li>
            ))}
          </ul>
        )}

        <p>Estilizado con SaSS y @apply</p>
      </div>
    </div>
  );
}

export default App;
