require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function monitorSites() {
    console.log('Iniciando monitoreo...');

    const { data: sites, error } = await supabase
    .from('sites')
    .select('*')
    .eq('is_active', true);

    if (error) {
        console.error('Error al obtener sitios:', error);
        return;
    }

    if (!sites || sites.length === 0) {
        console.log('No hay sitios activos para monitorear.');
        return;
    }

    console.log(`Encontrados ${sites.length} sitios para revisar.`);

    // 4. Recorremos cada sitio y hacemos el "ping"
    for (const site of sites) {
        const startTime = Date.now();
        let status = 0;
        let latency = 0;

        try {
            console.log(`Pinging ${site.name} (${site.url})...`);
            
            // Hacemos la petición real a la web
            const response = await fetch(site.url, { method: 'HEAD' }); 
            // Usamos 'HEAD' porque es más rápido, solo pide cabeceras, no descarga todo el HTML.
            
            status = response.status;
        } catch (err) {
            console.error(`Fallo al conectar con ${site.name}:`, err.message);
            status = 500; // Error interno/caída
        } finally {
            const endTime = Date.now();
            latency = endTime - startTime; // Calculamos cuánto tardó
        }

        // 5. Guardamos el resultado en la tabla 'pings'
        const { error: insertError } = await supabase
            .from('pings')
            .insert([
            {
                site_id: site.id,
                status: status,
                latency: latency
            }
            ]);

        if (insertError) {
            console.error('Error guardando ping:', insertError);
        } else {
            console.log(`✅ Resultado guardado: ${site.name} | Status: ${status} | Latency: ${latency}ms`);
        }
    }

    console.log('🏁 Monitoreo finalizado.');
}

monitorSites();