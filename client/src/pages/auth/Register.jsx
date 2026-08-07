import React, { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Sun, Moon, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
    const { register, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "researcher",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Calculate password strength
    const getPasswordStrength = (pass) => {
        if (!pass) return { label: "", color: "", width: "0%" };
        if (pass.length < 6) return { label: "Weak", color: "bg-red-500", width: "33%" };
        if (pass.length < 10) return { label: "Good", color: "bg-amber-500", width: "66%" };
        return { label: "Strong", color: "bg-emerald-500", width: "100%" };
    };

    const strength = getPasswordStrength(formData.password);

    const handleRegister = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password, confirmPassword, role } = formData;

        if (!firstName || !lastName || !email || !password) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsSubmitting(true);
        const result = await register({ firstName, lastName, email, password, role });
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Account created successfully! Welcome to LeadFlow 🚀");
            navigate("/dashboard");
        } else {
            toast.error(result.error);
        }
    };

    return (

        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300 relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

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
                        to="/login"
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Already have an account?
                    </Link>
                </div>
            </header>

            {/* Main Auth Split Container */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
                <div className="max-w-4xl w-full grid lg:grid-cols-12 rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
                    
                    {/* Left Animated Visual Showcase */}
                    <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 p-10 flex-col justify-between text-white relative overflow-hidden">
                        
                        <div className="space-y-4 relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold border border-white/20">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                <span>Start Your Free Access</span>
                            </div>
                            <h2 className="text-3xl font-extrabold leading-tight">
                                Join 10,000+ High-Performance Growth Teams.
                            </h2>
                            <p className="text-sm text-indigo-100/90 leading-relaxed">
                                Create your LeadFlow account today to organize pipelines, automate outreach, and close deals faster.
                            </p>
                        </div>

                        <div className="relative z-10 space-y-3">
                            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                                    <CheckCircle2 className="w-4 h-4" /> Instant Setup Included
                                </div>
                                <ul className="text-xs space-y-1 text-indigo-100">
                                    <li>✓ AI Lead Scoring Engine</li>
                                    <li>✓ Drag & Drop Kanban Pipeline</li>
                                    <li>✓ Automated Email & SMS Triggers</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    {/* Right Register Form */}
                    <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-5">
                        
                        <div className="space-y-1">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Create Your Account
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                Start capturing and closing leads in minutes.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleRegister} className="space-y-3.5">
                            
                            {/* First Name & Last Name */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        required
                                        placeholder="Guddu"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        required
                                        placeholder="Kumar"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Work Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="guddu@gmail.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Role Select */}
                            <div className="space-y-1">
                                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Account Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                >
                                    <option value="researcher">Researcher</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Administrator</option>
                                </select>

                            </div>

                            {/* Password & Confirm */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            required
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                        Confirm
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Strength meter bar */}
                            {formData.password && (
                                <div className="space-y-1 pt-1">
                                    <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                                        <span>Password Strength: {strength.label}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }} />
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create LeadFlow Account</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                        </form>

                        {/* Login Redirect */}
                        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                            Already registered?{" "}
                            <Link to="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                Sign in here
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
