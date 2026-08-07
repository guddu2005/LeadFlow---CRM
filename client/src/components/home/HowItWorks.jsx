import React from "react";
import { Sparkles, ArrowRight, UserPlus, Cpu, LayoutGrid, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Capture & Aggregate",
            description: "Seamlessly pull leads from web forms, landing pages, email inquiries, and APIs into a unified inbox.",
            icon: UserPlus,
            color: "from-blue-600 to-indigo-600",
        },
        {
            number: "02",
            title: "AI Score & Qualify",
            description: "LeadFlow evaluates intent signals, firmographics, and interaction velocity to rank high-priority prospects.",
            icon: Cpu,
            color: "from-indigo-600 to-purple-600",
        },
        {
            number: "03",
            title: "Manage Pipeline",
            description: "Drag and drop deals through customizable Kanban columns, keeping your entire sales team synchronized.",
            icon: LayoutGrid,
            color: "from-purple-600 to-pink-600",
        },
        {
            number: "04",
            title: "Automate & Close",
            description: "Trigger automated follow-ups, contract reminders, and track monthly recurring revenue in real-time.",
            icon: CheckCircle2,
            color: "from-emerald-500 to-teal-600",
        },
    ];

    return (
        <section id="how-it-works" className="py-20 lg:py-28 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Simple 4-Step Process</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        How LeadFlow Transforms Your Sales Cycle
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
                        Go from raw lead capture to closed-won deals in minutes with our streamlined automated workflow.
                    </p>
                </div>

                {/* Workflow Cards */}
                <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {steps.map((step, index) => {
                        const IconComponent = step.icon;
                        return (
                            <div
                                key={index}
                                className="relative rounded-2xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent opacity-80">
                                            {step.number}
                                        </span>
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-md`}>
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
