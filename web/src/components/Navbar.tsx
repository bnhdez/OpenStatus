import type { Session } from '@supabase/supabase-js';
import { Activity, Moon, Shield, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavbarProps {
    session?: Session | null;
    onLogin?: () => void;
    onLogout?: () => void;
}

export function Navbar({ session, onLogin, onLogout }: NavbarProps) {

    // 1. Estado para el tema. Iniciamos buscando en la memoria del navegador.
    const [theme, setTheme] = useState(() => {
        // Si estamos en el navegador, buscamos la preferencia guardada
        if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') || 'light'; // 'light' es el defecto
        }
        return 'light';
    });

    // 2. Efecto: Cada vez que 'theme' cambia, actualizamos el HTML real
    useEffect(() => {
        const root = window.document.documentElement; // Esto es la etiqueta <html>
        if (theme === 'dark') {
        root.classList.add('dark');
        } else {
        root.classList.remove('dark');
        }
        // Guardamos la decisión para la próxima visita
        localStorage.setItem('theme', theme);
    }, [theme]);

    // 3. Función para cambiar el estado al hacer clic
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <nav className="w-full bg-zinc-50 dark:bg-black transition-colors duration-300 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between">
                {/* Left: Logo */}
                    <div className="flex items-center gap-2 mr-4">
                        <Activity className="w-6 h-6 text-indigo-500" />
                        <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">OpenStatus</span>
                    </div>

                    {/* Right: Status & Auth */}
                    <div className="flex items-center gap-4">

                        {/* BOTÓN DE TOGGLE (SOL / LUNA) */}
                        <button 
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer"
                            title={theme === 'light' ? "Activar modo oscuro" : "Activar modo claro"}
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        {/* System Status Badge */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-6 bg-slate-800" />

                        {/* Auth Section */}
                        {session ? (
                        <>
                            {/* Admin Mode Badge */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                            <Shield className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm font-medium text-indigo-500">
                                Admin Mode
                            </span>
                            </div>

                            {/* Logout Button */}
                            <button
                            onClick={onLogout}
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-zinc-900 dark:text-white transition-colors"
                            >
                            Logout
                            </button>
                        </>
                        ) : (
                        <>
                            {/* Login Button */}
                            <button
                            onClick={onLogin}
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-zinc-900 dark:text-white transition-colors"
                            >
                            Login
                            </button>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}