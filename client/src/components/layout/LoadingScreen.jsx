import React from "react";
import { Zap } from "lucide-react";

export default function LoadingScreen({ message = "Loading LeadFlow..." }) {
    return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 animate-bounce">
                    <Zap className="w-7 h-7 fill-current" />
                </div>
                <div className="absolute -inset-2 rounded-3xl bg-blue-500/20 dark:bg-blue-400/10 blur-xl animate-pulse" />
            </div>
            <div className="text-center space-y-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {message}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                    Synchronizing real-time CRM intelligence
                </p>
            </div>
        </div>
    );
}
