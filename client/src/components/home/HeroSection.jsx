import React from "react";
import { Sparkles, ArrowRight, Play, TrendingUp, Zap } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Ambient background glow effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-2/3 right-10 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    {/* Left Copy & Actions */}
                    <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                        {/* Top Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/80 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-wide">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
                            <span>Next-Gen Intelligent CRM & Lead Platform</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                            Accelerate Deals. <br className="hidden sm:inline" />
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Master Outreach.
                            </span> <br />
                            Maximize Conversions.
                        </h1>

                        {/* Description */}
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                            LeadFlow is your all-in-one revenue acceleration engine. Automatically capture, score, and nurture leads with visual Kanban pipelines, automated email & SMS sequences, and real-time contact intelligence.
                        </p>

                        {/* CTAs */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <a
                                href="#demo"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all cursor-pointer text-base"
                            >
                                <span>Try Interactive Demo</span>
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <a
                                href="#features"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer text-base"
                            >
                                <Play className="w-4 h-4 fill-current text-blue-600 dark:text-blue-400" />
                                <span>Explore Features</span>
                            </a>
                        </div>

                        {/* Trust Badges */}
                        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">45%</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Higher Lead Win Rate</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">3x</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Faster Lead Follow-up</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">100k+</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Leads Processed</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Interactive Mockup Graphic */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative mx-auto max-w-md lg:max-w-none">
                            
                            {/* Decorative background glow */}
                            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur-xl"></div>

                            {/* Main Card Wrapper */}
                            <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-5 space-y-4">
                                
                                {/* Header bar */}
                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                        <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                                            LeadFlow Command Center
                                        </span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                                        Live Stream
                                    </span>
                                </div>

                                {/* Active Pipeline Quick Preview */}
                                <div className="space-y-3">
                                    {/* Stat Summary Box */}
                                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pipeline Value</p>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">$428,500</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            <span>+24.8%</span>
                                        </div>
                                    </div>

                                    {/* Mock Lead Item 1 */}
                                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 transition-colors shadow-sm space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                                                    AS
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Apex Solutions Corp</h4>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Enterprise CRM Expansion</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                                                In Negotiation
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                                            <span className="text-slate-500 dark:text-slate-400">Deal Value: <strong className="text-slate-800 dark:text-slate-200">$85,000</strong></span>
                                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Score: 94/100 🔥</span>
                                        </div>
                                    </div>

                                    {/* Mock Lead Item 2 */}
                                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 transition-colors shadow-sm space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 text-white font-bold text-xs flex items-center justify-center">
                                                    NT
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Nexus Tech Systems</h4>
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Multi-Seat License</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-semibold">
                                                Qualified Lead
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                                            <span className="text-slate-500 dark:text-slate-400">Deal Value: <strong className="text-slate-800 dark:text-slate-200">$42,000</strong></span>
                                            <span className="text-blue-600 dark:text-blue-400 font-semibold">Score: 88/100 ⚡</span>
                                        </div>
                                    </div>

                                    {/* AI Activity Floating Notification */}
                                    <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center gap-3">
                                        <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                        <p className="text-[11px] text-indigo-900 dark:text-indigo-200 leading-tight">
                                            <strong>LeadFlow AI:</strong> Automated follow-up sent to 14 high-intent leads. Expected response rate: +38%.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
