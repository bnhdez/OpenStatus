import React, { useState } from 'react';
import { supabaseClient } from '../lib/supabase';

interface Props{
    onSiteAdded: () => void
}

const AddSiteForm = ({onSiteAdded}: Props) => {

    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [isSubmitting, setisSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setisSubmitting(true);

        try {

            // se hace insert mientras que se abstrae error
            const { error } = await supabaseClient
                .from('sites')
                .insert({ name, url });

            if (error) {
                throw error;
            }

            // Only clear the form if the insert was successful
            setName('');
            setUrl('');

            onSiteAdded();
        } catch (error) {
            console.error('Error al agregar sitio:', error);
            // Optionally, you could show an error message to the user here
            // For example, using a toast notification or error state
        } finally {
            setisSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div className="flex gap-2">
                {/* Input Nombre */}
                <input
                type="text"
                placeholder="Nombre del sitio (ej: Mi Blog)"
                className="flex-1 bg-slate-800 border border-slate-600 text-white p-2 rounded focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                required
                value={ name }
                onChange={(e) => setName(e.target.value)}
                />

                {/* Input URL */}
                <input
                type="url"
                placeholder="https://..."
                className="flex-2 bg-slate-800 border border-slate-600 text-white p-2 rounded focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
                required
                value={ url }
                onChange={(e) => setUrl(e.target.value)}
                />
            </div>

            <button
                type="submit"
                className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-all active:scale-95 shadow-lg shadow-emerald-900/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
            >
                { isSubmitting ? 'Guardando...' : 'Agregar Sitio' }
            </button>
        </form>
    );
};

export default AddSiteForm;