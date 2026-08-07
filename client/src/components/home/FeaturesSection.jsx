import React from "react";
import { Layers, Send, BarChart3, Users, ShieldCheck, Sparkles, Target, ArrowUpRight } from "lucide-react";

export default function FeaturesSection() {
    const features = [
        {
            icon: Target,
            title: "Predictive AI Lead Scoring",
            description: "Automatically prioritize leads based on engagement history, company size, intent signals, and historical deal closure rates.",
            badge: "AI Powered",
            color: "from-blue-500 to-indigo-600",
        },
        {
            icon: Layers,
            title: "Visual Kanban Pipeline",
            description: "Manage deals seamlessly with custom drag-and-drop columns, automated stage transitions, and pipeline value tracking.",
            badge: "Core Feature",
            color: "from-indigo-500 to-purple-600",
        },
        {
            icon: Send,
            title: "Automated Outreach Triggers",
            description: "Set up multi-touch email & SMS drip campaigns that automatically trigger when leads move between funnel stages.",
            badge: "Automation",
            color: "from-purple-500 to-pink-600",
        },
        {
            icon: BarChart3,
            title: "Real-Time Revenue Analytics",
            description: "Visualize conversion bottlenecks, rep activity metrics, win rates, and monthly recurring revenue projections instantly.",
            badge: "Insights",
            color: "from-blue-600 to-cyan-600",
        },
        {
            icon: Users,
            title: "Contact & Firmographic Intelligence",
            description: "Instantly enrich lead entries with company domain details, tech stack info, funding data, and verified contact channels.",
            badge: "Enrichment",
            color: "from-emerald-500 to-teal-600",
        },
        {
            icon: ShieldCheck,
            title: "Enterprise Security & Audit",
            description: "Role-based permission controls, encrypted data storage, activity history tracking, and full compliance readiness.",
            badge: "Enterprise",
            color: "from-amber-500 to-orange-600",
        },
    ];

    return (
        <section id="features" className="py-20 lg:py-28 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Built For Modern Growth Teams</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Supercharge Every Stage of Your Lead Lifecycle
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
                        LeadFlow combines intuitive pipeline management with advanced automation so your team can focus on closing deals, not manual data entry.
                    </p>
                </div>

                {/* Grid */}
                <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => {
                        const IconComponent = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="group relative rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    {/* Icon & Badge Header */}
                                    <div className="flex items-center justify-between">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-200/70 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300">
                                            {feature.badge}
                                        </span>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Link / Hover prompt */}
                                <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <span>Learn more</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
