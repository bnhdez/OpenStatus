import { Trash2 } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

type SiteStatus = 'online' | 'error' | 'pending';

interface SiteCardProps {
    siteName: string;
    url: string;
    status: SiteStatus;
    history: any[];
    onDelete?: () => void;
}

export function SiteCard({ siteName, url, status, history, onDelete }: SiteCardProps) {
    const getStatusStyles = () => {
        switch (status) {
        case 'online':
            return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        case 'error':
            return 'bg-red-500/10 text-red-500 border border-red-500/20';
        case 'pending':
            return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        default:
            return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
};

const getStatusLabel = () => {
    switch (status) {
    case 'online': return 'Online';
    case 'error': return 'Error';
    case 'pending': return 'Pending';
    default: return 'Unknown';
    }
};

return (
    <div className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-xl p-6 transition-all duration-300 h-full flex flex-col backdrop-blur-sm">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-lg font-bold text-white mb-1 truncate">
                {siteName}
            </h3>
            <p className="text-sm text-slate-400 truncate">
                {url}
            </p>
            </div>
            
            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyles()}`}>
            {getStatusLabel()}
            </div>
        </div>

        {/* Chart Area */}
        {/* Agregamos padding-bottom (pb-2) para que la gráfica no choque con el borde inferior */}
        <div className="flex-1 min-h-[120px] w-full mt-auto pb-2">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                    <XAxis dataKey="time" hide/>
                    <Tooltip
                    contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "8px" }}
                    itemStyle={{ color: "#22d3ee" }}
                    labelStyle={{ color: "#a1a1aa", fontSize: "12px", marginBottom: "5px" }}
                    formatter={(value) => [`${value}ms`, "Latencia"]}
                    />
                    <Line 
                    type="monotone" 
                    dataKey="latency"
                    stroke={status === 'online' ? "#22d3ee" : status === 'error' ? "#f43f5e" : "#fbbf24"}
                    strokeWidth={2} 
                    dot={false}
                    isAnimationActive={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>

        {/* Delete Action (visible ONLY on hover) */}
        {/* FIX: Movido a la esquina INFERIOR derecha (bottom-4 right-4) */}
        {onDelete && (
            <button
            onClick={(e) => {
                e.stopPropagation(); // Evita clics accidentales en la tarjeta si agregamos navegación luego
                onDelete();
            }}
            className="absolute bottom-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:text-white z-10"
            title="Eliminar sitio"
            >
            <Trash2 className="w-4 h-4" />
            </button>
        )}
        </div>
    );
}