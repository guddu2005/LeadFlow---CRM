import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/layout/LoadingScreen";

import {
    Building2,
    Globe,
    MapPin,
    Users,
    Search,
    Download,
    Trash2,
    ShieldCheck,
    CheckCircle2,
    Sparkles,
    ArrowUpRight,
    Info,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [listRes, statsRes] = await Promise.allSettled([
                api.get("/companies"),
                api.get("/companies/stats/overview"),
            ]);

            if (listRes.status === "fulfilled") {
                const dataObj = listRes.value.data?.data || listRes.value.data?.message;
                if (Array.isArray(dataObj)) {
                    setCompanies(dataObj);
                } else if (dataObj?.companies) {
                    setCompanies(dataObj.companies);
                } else {
                    setCompanies([]);
                }
            } else {
                setCompanies([]);
            }

            if (statsRes.status === "fulfilled") {
                setStats(statsRes.value.data?.data || statsRes.value.data?.message);
            }
        } catch (err) {
            console.error("Fetch companies error:", err);
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this company profile?")) return;
        try {
            await api.delete(`/companies/${id}`);
            toast.success("Company profile deleted");
            fetchData();
        } catch (err) {
            toast.error("Failed to delete company profile");
        }
    };

    const handleExportCSV = () => {
        if (companies.length === 0) {
            toast.error("No company records to export");
            return;
        }

        const headers = ["Company Name", "Website", "Industry", "City", "Country", "Employee Count", "Status"];
        const rows = companies.map((c) => [
            `"${c.companyName || c.name || ""}"`,
            `"${c.website || ""}"`,
            `"${c.companyType || c.industry || ""}"`,
            `"${c.city || c.location?.city || ""}"`,
            `"${c.country || c.location?.country || ""}"`,
            `"${c.employeeCount || 0}"`,
            `"${c.status || "Converted"}"`,
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LeadFlow_Companies_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${companies.length} converted company accounts to CSV! 📥`);
    };

    const filteredCompanies = companies.filter((c) => {
        const name = (c.companyName || c.name || "").toLowerCase();
        return !searchQuery || name.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Auto-Generated Accounts</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Companies Directory
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Company accounts automatically generated whenever a prospect is converted into a lead.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={handleExportCSV}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                        <Download className="w-4 h-4 text-emerald-600" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Informational Callout */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 dark:text-white">Automatic Account Generation</h4>
                    <p>
                        Manual creation is disabled. When a target prospect is converted to a lead in the <strong>Prospects</strong> module, LeadFlow automatically generates a verified Company Account record here along with linked Contacts.
                    </p>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Converted Accounts", value: stats?.totalCompanies || companies.length, color: "text-blue-600 dark:text-blue-400" },
                    { title: "Verified Enterprise", value: stats?.verified || companies.filter(c => (c.employeeCount || 0) > 50).length, color: "text-indigo-600 dark:text-indigo-400" },
                    { title: "Active Locations", value: stats?.locations || "Global", color: "text-purple-600 dark:text-purple-400" },
                    { title: "Converted Leads", value: stats?.leadCount || companies.length, color: "text-emerald-600 dark:text-emerald-400" },
                ].map((st, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{st.title}</span>
                        <div className={`text-2xl font-extrabold ${st.color}`}>{st.value}</div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search company name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* List & Grid */}
            {loading ? (
                <LoadingScreen message="Loading Converted Company Accounts..." />
            ) : (
                <div className="space-y-4">
                    
                    {/* Desktop Table */}
                    <div className="hidden lg:block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                                        <th className="py-3.5 px-4">Company Name</th>
                                        <th className="py-3.5 px-4">Website</th>
                                        <th className="py-3.5 px-4">Location</th>
                                        <th className="py-3.5 px-4">Origin Status</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredCompanies.map((c) => {
                                        const cName = c.companyName || c.name || "Converted Company";
                                        return (
                                            <tr key={c._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                                
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                                                            {cName[0]}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                                                <span>{cName}</span>
                                                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                                                            </h4>
                                                            <p className="text-[11px] text-slate-500">{c.companyType || "Enterprise Real Estate"}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    {c.website ? (
                                                        <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                            <Globe className="w-3.5 h-3.5" />
                                                            <span>{c.website}</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-400">N/A</span>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{c.city || c.location?.city}{c.city && c.country ? ", " : ""}{c.country || c.location?.country || "Global"}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] inline-flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                        <span>Converted from Prospect</span>
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg border border-red-200 dark:border-red-950 hover:bg-red-50 text-red-600 cursor-pointer">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>

                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile View */}
                    <div className="lg:hidden space-y-3">
                        {filteredCompanies.map((c) => {
                            const cName = c.companyName || c.name || "Converted Company";
                            return (
                                <div key={c._id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cName}</h4>
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded">Converted</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-slate-400">{c.city || "Global"}</span>
                                        <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg border border-red-200 text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            )}

        </div>
    );
}
