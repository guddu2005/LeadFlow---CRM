import React, { useState , useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Sun, Moon, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
    const { login, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const from = location.state?.from?.pathname || "/dashboard";

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        setIsSubmitting(true);
        const result = await login(email, password);
        setIsSubmitting(false);

        if (result.success) {
            toast.success(`Welcome back, ${result.user?.firstName || "User"}! 🎉`);
            navigate(from, { replace: true });
        } else {
            toast.error(result.error);
        }
    };


    const handleFillDemoAdmin = () => {
        setEmail("guddu@gmail.com");
        setPassword("admin123");
        toast.success("Demo credentials filled (Email: guddu@gmail.com)");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header Navigation Bar */}
            <header className="p-6 relative z-10 flex items-center justify-between max-w-7xl mx-auto w-full">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                        <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                        Lead<span className="text-blue-600 dark:text-blue-400">Flow</span>
                    </span>
                </Link>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer shadow-sm"
                    >
                        {theme === "light" ? (
                            <>
                                <Moon className="w-4 h-4 text-indigo-600" />
                                <span>Dark</span>
                            </>
                        ) : (
                            <>
                                <Sun className="w-4 h-4 text-amber-400" />
                                <span>Light</span>
                            </>
                        )}
                    </button>
                    <Link
                        to="/signup"
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Need an account?
                    </Link>
                </div>
            </header>

            {/* Main Auth Split Container */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
                <div className="max-w-4xl w-full grid lg:grid-cols-12 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
                    
                    {/* Left Animated Visual Showcase (Hidden on Mobile) */}
                    <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 flex-col justify-between text-white relative overflow-hidden">
                        
                        {/* Background subtle geometric patterns */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                        <div className="space-y-4 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/20">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>Intelligent CRM Platform</span>
                            </div>
                            <h2 className="text-3xl font-extrabold leading-tight">
                                Turn Every Prospect Into a Closed Deal.
                            </h2>
                            <p className="text-sm text-blue-100/90 leading-relaxed">
                                Log in to access your automated pipelines, real-time AI intent scores, and contact intelligence center.
                            </p>
                        </div>

                        {/* Animated Floating Showcase Badge */}
                        <div className="relative z-10 space-y-3">
                            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between shadow-lg transform hover:-translate-y-1 transition-transform">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300 font-bold text-xs">
                                        96%
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold">High Intent Lead Identified</h4>
                                        <p className="text-[10px] text-blue-200">Apex Solutions • $85,000</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-emerald-400/30 text-emerald-200 text-[10px] font-bold">
                                    AI Scored
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-blue-200 pt-2 border-t border-white/10">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> SOC2 Encrypted
                                </span>
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-amber-300" /> 99.99% Uptime
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Right Login Form */}
                    <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center space-y-6">
                        
                        <div className="space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Welcome Back
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                Enter your email and password to access your LeadFlow dashboard.
                            </p>
                        </div>

                        {/* Quick Demo Admin Credentials Alert */}
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-3 text-xs">
                            <div className="space-y-0.5">
                                <span className="font-bold text-blue-900 dark:text-blue-200">Demo Admin Account:</span>
                                <p className="text-slate-600 dark:text-slate-300">guddu@gmail.com</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleFillDemoAdmin}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] shadow transition-colors cursor-pointer shrink-0"
                            >
                                Quick Fill
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            
                            {/* Email */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <a href="#forgot" className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                                        Forgot?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Dashboard</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                        </form>

                        {/* Sign Up Redirect */}
                        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                            Don't have an account yet?{" "}
                            <Link to="/signup" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                Create a LeadFlow account
                            </Link>
                        </div>

                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 text-center text-xs text-slate-400 relative z-10">
                © {new Date().getFullYear()} LeadFlow. Secured by JWT Authentication.
            </footer>

        </div>
    );
}
