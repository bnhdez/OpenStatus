import type { Session } from '@supabase/supabase-js';
import { Activity, Shield } from 'lucide-react';

interface NavbarProps {
    session?: Session | null;
    onLogin?: () => void;
    onLogout?: () => void;
}

export function Navbar({ session, onLogin, onLogout }: NavbarProps) {
    return (
        <nav className="w-full bg-black/50 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-6 py-4">
                <div className="flex items-center justify-between">
                {/* Left: Logo */}
                    <div className="flex items-center gap-2 mr-4">
                        <Activity className="w-6 h-6 text-indigo-500" />
                        <span className="text-xl font-bold text-white">OpenStatus</span>
                    </div>

                    {/* Right: Status & Auth */}
                    <div className="flex items-center gap-4">
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
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                            >
                            Logout
                            </button>
                        </>
                        ) : (
                        <>
                            {/* Login Button */}
                            <button
                            onClick={onLogin}
                            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
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