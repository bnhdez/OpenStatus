import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabase";

export interface Site {
    id: number;
    name: string;
    url: string;
    is_active: boolean;
    // Estos campos ahora vendrán "aplanados"
    last_latency: number | null;
    last_status: number | null;
}

export function useSites() {
    //para guardar la lista de sitios que devuelva la base de datos
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);

    // para ejecutar la peticion a la base de datos una sola vez
    useEffect(() => {
        async function fetchSites() {
            try {
                setLoading(true);
                const { data, error } = await supabaseClient
                    .from('sites')
                    .select(`
                        *,
                        pings (
                            latency,
                            status
                        )
                    `)
                    .limit(1, { referencedTable: 'pings' })
                    .order('created_at', { ascending: false, referencedTable: 'pings' });

                if (error) throw error;

                const transformedData: Site[] = (data || [])// <--- PASO 1: El Escudo Protector
                /* EXPLICACIÓN PASO 1:
                    Si 'data' es null, el código explotaría al intentar hacer '.map()'.
                    Con (data || []), le decimos: "Usa 'data', pero si es null, usa un array vacío []".
                    Así el .map simplemente no corre y no rompe la app.
                */
                .map( (site:any) => { // <--- PASO 2: El Bucle
                    /*
                        Aquí 'site' es el objeto crudo que viene de la DB.
                        Se ve así:
                        {
                            name: "Google",
                            pings: [ { latency: 50, status: 200 } ]  <-- Un array dentro de un objeto
                        }
                    */

                    // <--- PASO 3: La Extracción Quirúrgica (Tu duda principal)
                    const lastPing =
                        site.pings && site.pings.length > 0 // ¿Existe la carpeta 'pings' Y tiene algo adentro?
                        ? site.pings[0] // VERDADERO: Toma el primer elemento (el índice 0)
                        : null; // FALSO: Devuelve null (no hay datos)

                    /*
                        DESGLOSE DEL TERNARIO ( ? : ):
                        1. site.pings: Verifica que la propiedad no sea undefined.
                        2. site.pings.length > 0: Verifica que el array no esté vacío [].

                        ¿Por qué [0]?
                        Porque en la consulta anterior usamos .order('created_at', descending) y .limit(1).
                        Por lo tanto, el elemento en la posición 0 SIEMPRE es el más reciente.
                    */

                    // <--- PASO 4: El Aplanado (Flattening)
                    return {
                        id: site.id,
                        name: site.name,
                        url: site.url,
                        is_active: site.is_active,
                        // aplanamos los datos del array y los ponemos al nivel principal para tener { name: Google, latency: 45 }
                        last_latency: lastPing ? lastPing.latency : null,
                        last_status: lastPing ? lastPing.status : null,
                    }
                })

                setSites(transformedData);

            } catch (error) {
                console.error("Error fetching sites:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSites();
    }, []);

    return { sites, loading };
}