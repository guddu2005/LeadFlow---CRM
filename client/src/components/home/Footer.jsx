import React from "react";
import { Zap, Sun, Moon, ArrowUp } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";

export default function Footer() {
    const { theme, toggleTheme } = useTheme();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-slate-800">
                    
                    {/* Brand Col */}
                    <div className="md:col-span-5 space-y-4">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                                <Zap className="w-5 h-5 fill-current" />
                            </div>
                            <span className="text-xl font-extrabold text-white tracking-tight">
                                Lead<span className="text-blue-500">Flow</span>
                            </span>
                        </Link>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                            LeadFlow is the modern intelligent Lead & CRM management workspace designed to accelerate sales pipelines, automate customer engagement, and maximize conversion rates.
                        </p>

                        {/* System status badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-medium text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>All Systems Operational</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="md:col-span-3 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                            Platform Features
                        </h4>
                        <ul className="space-y-2 text-xs font-medium">
                            <li><a href="#features" className="hover:text-blue-400 transition-colors">Smart Lead Scoring</a></li>
                            <li><a href="#features" className="hover:text-blue-400 transition-colors">Visual Kanban Pipeline</a></li>
                            <li><a href="#demo" className="hover:text-blue-400 transition-colors">Automated Sequences</a></li>
                            <li><a href="#features" className="hover:text-blue-400 transition-colors">Revenue Analytics</a></li>
                            <li><a href="#features" className="hover:text-blue-400 transition-colors">Contact Intelligence</a></li>
                        </ul>
                    </div>

                    {/* Company / Support */}
                    <div className="md:col-span-4 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                            Theme Preferences
                        </h4>
                        <p className="text-xs text-slate-400">
                            Experience LeadFlow in your preferred visual style. Supports automatic system preference matching.
                        </p>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all cursor-pointer"
                            >
                                {theme === "light" ? (
                                    <>
                                        <Moon className="w-4 h-4 text-indigo-400" />
                                        <span>Switch to Dark Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Sun className="w-4 h-4 text-amber-400" />
                                        <span>Switch to Light Mode</span>
                                    </>
                                )}
                            </button>
                            <span className="text-[11px] text-slate-500">Active: <strong>{theme}</strong></span>
                        </div>
                    </div>

                </div>

                {/* Bottom bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p>© {new Date().getFullYear()} LeadFlow Platform. All rights reserved.</p>

                    <div className="flex items-center gap-6">
                        <a href="#features" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                        <a href="#features" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                        <button
                            onClick={scrollToTop}
                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </footer>
    );
}
