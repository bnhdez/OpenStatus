import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabase";

export interface Site {
    id: number;
    name: string;
    url: string;
    is_active: boolean;
    // Estos campos ahora vendrán "aplanados"
    latency_history: HistoryPoint[];
    last_status: number | null;
}

interface HistoryPoint {
    time: string; // x
    latency: number; // y
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
                            status,
                            created_at
                        )
                    `)
                    .limit(20, { referencedTable: 'pings' })
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

                    const history = site.pings || [];

                    return {
                        id: site.id,
                        name: site.name,
                        url: site.url,
                        is_active: site.is_active,
                        // aplanamos los datos del array y los ponemos al nivel principal para tener { name: Google, latency: 45 }
                        latency_history: history.map((ping:any) => {
                            const date = new Date(ping.created_at);
                            const formattedTime = date.toLocaleDateString('es-SV', { hour: '2-digit', minute: '2-digit' })

                            return {
                                time: formattedTime,
                                latency: ping.latency
                            }
                        }).reverse(), // revierte el orden para leer de izquierda a derecha cronologicamente
                        last_status: history.length > 0 ? history[0].status : null,
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