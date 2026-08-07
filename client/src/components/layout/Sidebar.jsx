import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
    Zap,
    LayoutGrid,
    Target,
    Users,
    Building2,
    PhoneCall,
    Send,
    Mail,
    Calendar,
    FileText,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    ShieldCheck,
    X,
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuGroups = [
        {
            title: "Core",
            items: [
                { name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
                { name: "Leads Pipeline", path: "/leads", icon: Zap },
                { name: "Prospects", path: "/prospects", icon: Target },
            ],
        },
        {
            title: "CRM Directory",
            items: [
                { name: "Companies", path: "/companies", icon: Building2 },
                { name: "Contacts", path: "/contacts", icon: Users },
            ],
        },
        {
            title: "Outreach & Meetings",
            items: [
                { name: "Outreach Campaigns", path: "/outreach", icon: Send },
                { name: "Email Dispatcher", path: "/email", icon: Mail },
                { name: "Interviews", path: "/interviews", icon: Calendar },
                { name: "Templates", path: "/templates", icon: FileText },
            ],
        },
        {
            title: "Insights & System",
            items: [
                { name: "Reports & Exports", path: "/reports", icon: BarChart3 },
                ...(user?.role === "admin" ? [{ name: "Admin Team & Roles", path: "/admin/users", icon: ShieldCheck }] : []),
                { name: "Settings", path: "/settings", icon: Settings },
            ],
        },
    ];

    const initials = user
        ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U"
        : "U";

    const sidebarContent = (
        <div className="h-full flex flex-col justify-between p-4 space-y-4">
            
            {/* Top Brand Header & Monochromatic Logo */}
            <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-md shadow-slate-900/10 dark:shadow-white/10 group-hover:scale-105 transition-transform shrink-0">
                            <Zap className="w-5 h-5 fill-current" />
                        </div>
                        {(!collapsed || mobileOpen) && (
                            <div className="flex flex-col leading-tight">
                                <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Lead<span className="text-slate-500 dark:text-slate-400">Flow</span>
                                </span>
                                <span className="text-[9px] uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400 -mt-0.5">
                                    Executive CRM
                                </span>
                            </div>
                        )}
                    </Link>

                    {/* Mobile close or Desktop collapse */}
                    {mobileOpen ? (
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden md:flex p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                    )}
                </div>

                {/* Navigation Menu Links */}
                <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
                    {menuGroups.map((group, idx) => (
                        <div key={idx} className="space-y-1.5">
                            {(!collapsed || mobileOpen) && (
                                <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
                                    {group.title}
                                </h5>
                            )}
                            {group.items.map((item) => {
                                const IconComponent = item.icon;
                                const isActive = location.pathname === item.path;

                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setMobileOpen(false)}
                                        title={collapsed && !mobileOpen ? item.name : undefined}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                            isActive
                                                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-md shadow-slate-900/10"
                                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                        }`}
                                    >
                                        <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? "text-white dark:text-slate-950" : "text-slate-500 dark:text-slate-400"}`} />
                                        {(!collapsed || mobileOpen) && <span>{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>
            </div>

            {/* User Profile Footer Badge */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 shadow">
                        {initials}
                    </div>
                    {(!collapsed || mobileOpen) && user && (
                        <div className="truncate text-left leading-tight">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {user.firstName} {user.lastName}
                            </h5>
                            <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                                {user.role || "User"}
                            </span>
                        </div>
                    )}
                </div>

                {(!collapsed || mobileOpen) && (
                    <button
                        onClick={logout}
                        title="Sign Out"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                )}
            </div>

        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:block fixed top-0 left-0 bottom-0 z-40 bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ${
                    collapsed ? "w-20" : "w-64"
                }`}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Drawer Overlay */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex">
                    <div className="w-72 bg-white dark:bg-slate-950 h-full shadow-2xl">
                        {sidebarContent}
                    </div>
                    <div className="flex-1" onClick={() => setMobileOpen(false)} />
                </div>
            )}
        </>
    );
}
