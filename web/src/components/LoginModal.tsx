import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface Props {
    isOpen: boolean;
    onClose: () => void
}

const LoginModal = ({isOpen, onClose}: Props) => {

    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fakeEmail = `${username}@admin.com`

        const { error } = await login(fakeEmail, password);
        if ( !error ) {
            onClose();
            setUsername("")
            setPassword("")
        } else {
            alert('Error: ' + error.message)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-zinc-900 border border-slate-700 p-6 rounded-lg max-w-sm w-full shadow-2xl">
                
                <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-indigo-400">Admin Access</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-zinc-900 dark:text-white">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* INPUT USUARIO (Texto normal) */}
                    <input
                        type="text" 
                        placeholder="Usuario"
                        className="bg-gray-200 dark:bg-zinc-900/50 border border-slate-600 placeholder:text-zinc-600 text-black dark:text-white p-2 rounded focus:outline-none focus:border-indigo-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    
                    {/* INPUT PASSWORD */}
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="bg-gray-200 dark:bg-zinc-900/50 border border-slate-600 placeholder:text-zinc-600 text-black dark:text-white p-2 rounded focus:outline-none focus:border-indigo-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button 
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-bold transition-colors"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;