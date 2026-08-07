import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Zap } from "lucide-react";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl animate-bounce">
                    <Zap className="w-6 h-6 fill-current" />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 animate-pulse">
                    Authenticating session...
                </p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Restricted</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Your account role (<strong>{user.role}</strong>) does not have permission to view this section.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md"
                    >
                        Back to Home Page
                    </a>
                </div>
            </div>
        );
    }

    return children;
}
