import { useEffect, useState } from "react";
import { supabaseClient } from "../lib/supabase";

export interface Site {
    id: number;
    name: string;
    url: string;
    is_active: boolean;
    // Preparando el terreno para el futuro:
    last_ping?: number; // Latencia
    status?: number;    // 200, 404, etc.
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
                    .select('*')
                    .order('id');

                if (error) throw error;

                // Aquí forzamos el tipo
                setSites(data as Site[]);

            } catch (error) {
                console.error("Error fetching sites:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSites();
    }, []);

    // El hook devuelve los datos y el estado de carga
    return { sites, loading };
}