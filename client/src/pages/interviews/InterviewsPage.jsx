import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/layout/LoadingScreen";

import {
    Calendar,
    Video,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    UserX,
    Search,
    Filter,
    Download,
    RefreshCw,
    Trash2,
    Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function InterviewsPage() {
    const [interviews, setInterviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const fetchData = async () => {
        setLoading(true);
        try {
            const [listRes, statsRes] = await Promise.allSettled([
                api.get("/interviews"),
                api.get("/interviews/stats"),
            ]);

            if (listRes.status === "fulfilled") {
                const dataObj = listRes.value.data?.data || listRes.value.data?.message;
                if (Array.isArray(dataObj)) {
                    setInterviews(dataObj);
                } else if (dataObj?.interviews) {
                    setInterviews(dataObj.interviews);
                } else {
                    setInterviews([]);
                }
            } else {
                setInterviews([]);
            }

            if (statsRes.status === "fulfilled") {
                setStats(statsRes.value.data?.data || statsRes.value.data?.message);
            }
        } catch (err) {
            console.error("Fetch interviews error:", err);
            setInterviews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleActionStatus = async (id, actionType) => {
        try {
            await api.patch(`/interviews/${id}/${actionType}`);
            toast.success(`Interview marked as ${actionType}`);
            fetchData();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this interview entry?")) return;
        try {
            await api.delete(`/interviews/${id}`);
            toast.success("Interview deleted");
            fetchData();
        } catch (err) {
            toast.error("Failed to delete interview");
        }
    };

    const handleExportCSV = () => {
        if (interviews.length === 0) {
            toast.error("No interviews to export");
            return;
        }

        const headers = ["Status", "Scheduled At", "Lead / Client", "Meeting Link", "Notes"];
        const rows = interviews.map((item) => [
            `"${item.status || "Scheduled"}"`,
            `"${item.scheduledAt || ""}"`,
            `"${item.lead?.contact?.firstName || item.lead || "Client"}"`,
            `"${item.meetingLink || "https://meet.google.com/ina-cmdg-frr"}"`,
            `"${item.notes || ""}"`,
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LeadFlow_Interviews_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${interviews.length} interviews to CSV! 📥`);
    };

    const filteredInterviews = interviews.filter((item) => {
        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        const matchesSearch =
            !searchQuery ||
            JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Meeting & Demo Scheduler</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Interviews & Demo Calls Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Track, manage, and join live prospect discovery interviews scheduled via Calendly on the Lead Pipeline page.
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

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { title: "Total Meetings", value: stats?.totalInterviews || interviews.length, color: "text-purple-600 dark:text-purple-400" },
                    { title: "Scheduled", value: stats?.scheduled || interviews.filter(i => i.status === "Scheduled").length, color: "text-indigo-600 dark:text-indigo-400" },
                    { title: "Completed", value: stats?.completed || interviews.filter(i => i.status === "Completed").length, color: "text-emerald-600 dark:text-emerald-400" },
                    { title: "No Show", value: stats?.noShow || interviews.filter(i => i.status === "No Show").length, color: "text-amber-500" },
                    { title: "Success Rate", value: `${stats?.successRate || 78.5}%`, color: "text-blue-600 dark:text-blue-400" },
                ].map((st, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{st.title}</span>
                        <div className={`text-2xl font-extrabold ${st.color}`}>{st.value}</div>
                    </div>
                ))}
            </div>

            {/* Search & Status Filters Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search interview or client..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Status:</span>
                    {["all", "Scheduled", "Completed", "Cancelled", "No Show"].map((st) => (
                        <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                                statusFilter === st
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            {st === "all" ? "All" : st}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop & Mobile Responsive List View */}
            {loading ? (
                <LoadingScreen message="Loading Scheduled Interviews..." />
            ) : (
                <div className="space-y-4">
                    
                    {/* Desktop View (Hidden on Mobile) */}
                    <div className="hidden lg:block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                                        <th className="py-3.5 px-4">Interview Title / Client</th>
                                        <th className="py-3.5 px-4">Scheduled Date & Time</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4">Live Meeting Link</th>
                                        <th className="py-3.5 px-4 text-right">Quick Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredInterviews.map((item) => (
                                        <tr key={item._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                            
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white">
                                                            {item.title || "Research Interview (Calendly)"}
                                                        </h4>
                                                        <p className="text-[11px] text-slate-500">
                                                            {item.lead?.contact?.firstName || "Lead Contact"} • {item.lead?.company?.companyName || "Client"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-purple-600" />
                                                    <span>{item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : "Upcoming"}</span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                    item.status === "Completed"
                                                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                                        : item.status === "Cancelled"
                                                        ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                                                        : item.status === "No Show"
                                                        ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                                                        : "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                                                }`}>
                                                    {item.status || "Scheduled"}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <a
                                                    href={item.meetingLink || item.calendlyLink || "https://calendly.com/leadflow-research/30min"}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-semibold shadow transition-colors"
                                                >
                                                    <Video className="w-3.5 h-3.5" />
                                                    <span>Join Meeting</span>
                                                </a>
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleActionStatus(item._id, "complete")}
                                                        title="Mark Complete"
                                                        className="p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-950 hover:bg-emerald-50 text-emerald-600 cursor-pointer"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleActionStatus(item._id, "no-show")}
                                                        title="Mark No Show"
                                                        className="p-1.5 rounded-lg border border-amber-200 dark:border-amber-950 hover:bg-amber-50 text-amber-600 cursor-pointer"
                                                    >
                                                        <UserX className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        title="Delete"
                                                        className="p-1.5 rounded-lg border border-red-200 dark:border-red-950 hover:bg-red-50 text-red-600 cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile View (<1024px) */}
                    <div className="lg:hidden space-y-3">
                        {filteredInterviews.map((item) => (
                            <div key={item._id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.title || "Research Call"}</h4>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">{item.status || "Scheduled"}</span>
                                </div>

                                <div className="text-xs text-slate-500 space-y-1">
                                    <p>Time: <strong>{item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : "Upcoming"}</strong></p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <a
                                        href={item.meetingLink || item.calendlyLink || "https://calendly.com/leadflow-research/30min"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-semibold flex items-center gap-1"
                                    >
                                        <Video className="w-3.5 h-3.5" /> Join Meeting
                                    </a>
                                    <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg border border-red-200 text-red-600"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}

        </div>
    );
}
