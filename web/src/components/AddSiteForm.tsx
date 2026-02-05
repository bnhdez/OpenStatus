import React, { useState } from 'react';
import { supabaseClient } from '../lib/supabase';
import { Loader2, Plus } from 'lucide-react';

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
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Inputs Container - responsive: stacked on mobile, side-by-side on larger screens */}
            <div className="flex flex-col md:flex-row gap-4">
            {/* Name Input */}
            <div className="flex-1">
                <label htmlFor="site-name" className="block text-sm font-medium text-slate-300 mb-2">
                Nombre del Sito
                </label>
                <input
                id="site-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="(ej: Mi blog)"
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600 pl-3"
                disabled={isSubmitting}
                required
                />
            </div>

            {/* URL Input */}
            <div className="flex-1">
                <label htmlFor="site-url" className="block text-sm font-medium text-slate-300 mb-2">
                URL
                </label>
                <input
                id="site-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600 pl-3"
                disabled={isSubmitting}
                required
                />
            </div>
            </div>

            {/* Submit Button with Gradient */}
            <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
            {isSubmitting ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Adding Monitor...</span>
                </>
            ) : (
                <>
                <Plus className="w-5 h-5" />
                <span>Add Monitor</span>
                </>
            )}
            </button>
        </form>
    );
};

export default AddSiteForm;