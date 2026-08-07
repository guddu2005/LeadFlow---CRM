import React from "react";
import { Star, Sparkles } from "lucide-react";

export default function TestimonialsSection() {
    const testimonials = [
        {
            quote: "LeadFlow completely transformed our sales team's workflow. The AI scoring feature alone saved us 15 hours a week by letting reps focus only on ready-to-buy prospects.",
            author: "David Miller",
            role: "VP of Global Sales",
            company: "CloudScale Systems",
            avatar: "DM",
            rating: 5,
        },
        {
            quote: "The visual Kanban pipeline is incredibly smooth. Moving leads between stages and having automated email follow-ups fire instantly has doubled our conversion rate.",
            author: "Elena Rostova",
            role: "Head of Growth",
            company: "PropScale CRM",
            avatar: "ER",
            rating: 5,
        },
        {
            quote: "Switching to LeadFlow was seamless. The contact intelligence enrichments mean our reps know exact company tech stacks before making the first discovery call.",
            author: "Marcus Vance",
            role: "Managing Director",
            company: "Vance Real Estate",
            avatar: "MV",
            rating: 5,
        },
    ];

    return (
        <section className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Trusted By Growth Leaders</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Loved by Sales Teams Worldwide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
                        See how top revenue teams use LeadFlow to organize pipelines and scale deal velocity.
                    </p>
                </div>

                {/* Cards */}
                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
                        >
                            <div className="space-y-4">
                                {/* Rating Stars */}
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                {/* Quote */}
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "{item.quote}"
                                </p>
                            </div>

                            {/* Author */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow">
                                    {item.avatar}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                        {item.author}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {item.role} • <span className="font-semibold text-blue-600 dark:text-blue-400">{item.company}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
