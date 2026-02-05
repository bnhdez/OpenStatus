import { useState } from "react";
import { useSites } from "../hooks/useSites"; // Importamos el hook aquí

interface Props {
    siteName: string
    siteId: number | null; // Ahora recibimos el ID, no solo un booleano
    onClose: () => void;
    onDeleted: () => void; // Para avisar a App que refresque la lista
}

export function DeleteModal({ siteName, siteId, onClose, onDeleted }: Props) {
    const { removeSite } = useSites(); // Usamos el hook aquí dentro
    const [isDeleting, setIsDeleting] = useState(false);

    // Si no hay ID (es null), no renderizamos nada, si viene id se abre modal
    if (siteId === null) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);
        // Llamamos al hook de borrado
        await removeSite(siteId);
        
        // Avisamos y cerramos
        setIsDeleting(false);
        onDeleted(); // <-- Refrescar lista principal
        onClose();   // <-- Cerrar modal
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-red-900/50 p-6 rounded-lg max-w-sm w-full shadow-2xl shadow-red-900/20">
                
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-3 bg-red-900/20 rounded-full text-red-500">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">¿Estás seguro?</h3>
                    <p className="text-slate-400 text-sm">
                        Se borrará el sitio {siteName}. Esta acción es permanente.
                    </p>

                    <div className="flex gap-3 w-full mt-2">
                        <button 
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors disabled:opacity-50"
                        >
                            {isDeleting ? 'Borrando...' : 'Sí, Eliminar'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}