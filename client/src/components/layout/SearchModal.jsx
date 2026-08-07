import React, { useState, useEffect } from "react";
import { Search, X, Zap, Building, User, LayoutGrid, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!isOpen) return null;

    const quickLinks = [
        { title: "Dashboard Overview", path: "/dashboard", type: "Page", icon: LayoutGrid },
        { title: "Apex Solutions Corp", path: "#", type: "Company", icon: Building },
        { title: "Sarah Jenkins", path: "#", type: "Lead", icon: Zap },
        { title: "Marcus Vance", path: "#", type: "Contact", icon: User },
    ];

    const filtered = quickLinks.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Search Bar Input */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search leads, companies, contacts, or navigation..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent border-none text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
                    />
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Results */}
                <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Quick Results
                    </div>
                    {filtered.map((item, idx) => {
                        const IconComp = item.icon;
                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    onClose();
                                    if (item.path.startsWith("/")) navigate(item.path);
                                }}
                                className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between cursor-pointer transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                        <IconComp className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                                            {item.title}
                                        </h5>
                                        <span className="text-[10px] text-slate-400">{item.type}</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                            </div>
                        );
                    })}
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">ESC</kbd> to exit</span>
                    <span>LeadFlow Quick Search</span>
                </div>
            </div>
        </div>
    );
}
