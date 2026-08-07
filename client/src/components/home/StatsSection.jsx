import React from "react";
import { TrendingUp, Clock, Users, ShieldCheck } from "lucide-react";

export default function StatsSection() {
    const stats = [
        {
            icon: TrendingUp,
            value: "+45%",
            label: "Average Conversion Boost",
            desc: "Sales teams close more qualified leads within 30 days.",
        },
        {
            icon: Clock,
            value: "3.2x",
            label: "Faster Response Velocity",
            desc: "Automated triggers reach prospects in under 2 minutes.",
        },
        {
            icon: Users,
            value: "10,000+",
            label: "Leads Managed Daily",
            desc: "High volume data enrichment without slowdowns.",
        },
        {
            icon: ShieldCheck,
            value: "99.99%",
            label: "Enterprise Reliability",
            desc: "SOC2 & GDPR compliant secure infrastructure.",
        },
    ];

    return (
        <section id="stats" className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
            {/* Ambient Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
                    {stats.map((stat, idx) => {
                        const IconComponent = stat.icon;
                        return (
                            <div key={idx} className={`space-y-2 ${idx > 0 ? "pt-6 sm:pt-0 sm:pl-6" : ""}`}>
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-bold text-blue-100">
                                    {stat.label}
                                </div>
                                <p className="text-xs text-blue-100/80 leading-relaxed max-w-xs">
                                    {stat.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
