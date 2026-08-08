import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/layout/LoadingScreen";

import {
    Send,
    Mail,
    Phone,
    Globe,
    Sparkles,
    Search,
    Filter,
    Plus,
    Download,
    RefreshCw,
    Clock,
    CheckCircle2,
    MessageSquare,
    AlertCircle,
    XCircle,
    Calendar,
    User,
    Edit3,
    Trash2,
    X,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import toast from "react-hot-toast";

export default function OutreachPage() {
    const [outreachs, setOutreachs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [channelFilter, setChannelFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingOutreach, setEditingOutreach] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [prospectsList, setProspectsList] = useState([]);
    const [templatesList, setTemplatesList] = useState([]);

    const [formData, setFormData] = useState({
        prospect: "",
        template: "",
        channel: "Email",
        sequenceType: "Initial",
        sequenceStep: 1,
        status: "Scheduled",
        subject: "",
        message: "",
        notes: "",
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (searchQuery) params.search = searchQuery;
            if (channelFilter !== "all") params.channel = channelFilter;
            if (statusFilter !== "all") params.status = statusFilter;

            const [listRes, statsRes, prospectsRes, templatesRes] = await Promise.allSettled([
                api.get("/outreach", { params }),
                api.get("/outreach/stats"),
                api.get("/prospects"),
                api.get("/templates"),
            ]);

            if (listRes.status === "fulfilled") {
                const dataObj = listRes.value.data?.data || listRes.value.data?.message;
                if (dataObj && Array.isArray(dataObj.outreachs)) {
                    setOutreachs(dataObj.outreachs);
                    setTotalPages(dataObj.pagination?.totalPages || 1);
                } else if (Array.isArray(dataObj)) {
                    setOutreachs(dataObj);
                } else {
                    setOutreachs([]);
                }
            } else {
                setOutreachs([]);
            }

            if (statsRes.status === "fulfilled") {
                setStats(statsRes.value.data?.data || statsRes.value.data?.message);
            }

            if (prospectsRes.status === "fulfilled") {
                const pros = prospectsRes.value.data?.data?.prospects || prospectsRes.value.data?.data || [];
                if (Array.isArray(pros)) setProspectsList(pros);
            }

            if (templatesRes.status === "fulfilled") {
                const tmps = templatesRes.value.data?.data?.templates || templatesRes.value.data?.data || [];
                if (Array.isArray(tmps)) setTemplatesList(tmps);
            }

        } catch (err) {
            console.error("Outreach fetch error:", err);
            setOutreachs(mockOutreachs);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, channelFilter, statusFilter]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchData();
    };

    const handleOpenModal = (outreachItem = null) => {
        if (outreachItem) {
            setEditingOutreach(outreachItem);
            setFormData({
                prospect: outreachItem.prospect?._id || outreachItem.prospect || "",
                template: outreachItem.template?._id || outreachItem.template || "",
                channel: outreachItem.channel || "Email",
                sequenceType: outreachItem.sequenceType || "Initial",
                sequenceStep: outreachItem.sequenceStep || 1,
                status: outreachItem.status || "Scheduled",
                subject: outreachItem.subject || "",
                message: outreachItem.message || "",
                notes: outreachItem.notes || "",
            });
        } else {
            setEditingOutreach(null);
            setFormData({
                prospect: prospectsList[0]?._id || "",
                template: templatesList[0]?._id || "",
                channel: "Email",
                sequenceType: "Initial",
                sequenceStep: 1,
                status: "Scheduled",
                subject: "",
                message: "",
                notes: "",
            });
        }
        setShowModal(true);
    };

    const handleSaveOutreach = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingOutreach) {
                await api.patch(`/outreach/${editingOutreach._id}`, formData);
                toast.success("Outreach updated successfully! 🚀");
            } else {
                await api.post("/outreach", formData);
                toast.success("New Outreach sequence launched! ✉️");
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save outreach");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/outreach/${id}/status`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
            fetchData();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this outreach entry?")) return;
        try {
            await api.delete(`/outreach/${id}`);
            toast.success("Outreach entry deleted");
            fetchData();
        } catch (err) {
            toast.error("Failed to delete outreach entry");
        }
    };

    const handleExportCSV = () => {
        if (outreachs.length === 0) {
            toast.error("No outreach records to export");
            return;
        }

        const headers = ["Channel", "Sequence Type", "Status", "Subject", "Message", "Scheduled At", "Outcome"];
        const rows = outreachs.map((o) => [
            `"${o.channel || ""}"`,
            `"${o.sequenceType || o.type || ""}"`,
            `"${o.status || ""}"`,
            `"${o.subject || ""}"`,
            `"${o.message || ""}"`,
            `"${o.scheduledAt || ""}"`,
            `"${o.outcome || ""}"`,
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LeadFlow_Outreach_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${outreachs.length} outreach records to CSV! 📥`);
    };

    const getChannelIcon = (ch) => {
        if (ch === "LinkedIn") return <Globe className="w-4 h-4 text-blue-500" />;
        if (ch === "Phone") return <Phone className="w-4 h-4 text-emerald-500" />;
        return <Mail className="w-4 h-4 text-purple-500" />;
    };


    const getStatusColor = (st) => {
        switch (st) {
            case "Booked":
            case "Replied":
                return "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200";
            case "Opened":
            case "Delivered":
                return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200";
            case "Sent":
            case "Scheduled":
                return "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200";
            case "Failed":
            case "Cancelled":
                return "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200";
            default:
                return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200";
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                        <Send className="w-3.5 h-3.5" />
                        <span>Automated Sequence Engine</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Outreach Campaigns
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Orchestrate email, LinkedIn, and phone drip campaigns with real-time response tracking.
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

                    <button
                        onClick={() => handleOpenModal(null)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Outreach Sequence</span>
                    </button>
                </div>
            </div>

            {/* Outreach Telemetry Stat Cards */}
            {(() => {
                const totalCount = outreachs.length;
                const sentCount = stats?.overview?.sent !== undefined ? stats.overview.sent : outreachs.filter(o => o.status === "Sent" || o.status === "Delivered" || o.sentAt).length;
                const openedCount = outreachs.filter(o => o.status === "Opened" || o.status === "Replied" || o.status === "Booked").length;
                const repliedCount = outreachs.filter(o => o.status === "Replied" || o.status === "Booked").length;
                const bookedCount = outreachs.filter(o => o.status === "Booked").length;

                const openRate = stats?.overview?.openRate !== undefined ? stats.overview.openRate : (totalCount > 0 ? Math.round((openedCount / totalCount) * 100) : 0);
                const replyRate = stats?.overview?.replyRate !== undefined ? stats.overview.replyRate : (totalCount > 0 ? Math.round((repliedCount / totalCount) * 100) : 0);
                const bookingRate = stats?.overview?.bookingRate !== undefined ? stats.overview.bookingRate : (totalCount > 0 ? Math.round((bookedCount / totalCount) * 100) : 0);

                return (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { title: "Total Outreachs", value: stats?.overview?.totalOutreachs !== undefined ? stats.overview.totalOutreachs : totalCount, icon: Send, color: "text-blue-600 dark:text-blue-400" },
                            { title: "Messages Sent", value: sentCount, icon: CheckCircle2, color: "text-indigo-600 dark:text-indigo-400" },
                            { title: "Open Rate", value: `${openRate}%`, icon: TrendingUp, color: "text-purple-600 dark:text-purple-400" },
                            { title: "Reply Rate", value: `${replyRate}%`, icon: MessageSquare, color: "text-amber-500" },
                            { title: "Booking Rate", value: `${bookingRate}%`, icon: Calendar, color: "text-emerald-600 dark:text-emerald-400" },
                        ].map((st, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{st.title}</span>
                                <div className={`text-2xl font-extrabold ${st.color}`}>{st.value}</div>
                            </div>
                        ))}
                    </div>
                );
            })()}

            {/* Filter & Channel Selector Bar */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* Search */}
                <form onSubmit={handleSearchSubmit} className="relative w-full lg:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search subject or message..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </form>

                {/* Channel & Status Filters */}
                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <span className="text-xs font-semibold text-slate-500">Channel:</span>
                    {["all", "Email", "LinkedIn", "Phone"].map((ch) => (
                        <button
                            key={ch}
                            onClick={() => setChannelFilter(ch)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                channelFilter === ch
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            {ch === "all" ? "All" : ch}
                        </button>
                    ))}

                    <span className="text-xs font-semibold text-slate-500 ml-2">Status:</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-semibold cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Sent">Sent</option>
                        <option value="Opened">Opened</option>
                        <option value="Replied">Replied</option>
                        <option value="Booked">Booked</option>
                        <option value="Failed">Failed</option>
                    </select>
                </div>
            </div>

            {/* Desktop & Mobile Responsive Outreach List */}
            {loading ? (
                <LoadingScreen message="Loading Outreach Telemetry..." />
            ) : (
                <div className="space-y-4">
                    
                    {/* Desktop View (Hidden on Mobile) */}
                    <div className="hidden lg:block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                                        <th className="py-3.5 px-4">Channel & Subject</th>
                                        <th className="py-3.5 px-4">Sequence</th>
                                        <th className="py-3.5 px-4">Prospect</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4">Outcome</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {outreachs.map((o) => (
                                        <tr key={o._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                            
                                            {/* Channel & Subject */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                        {getChannelIcon(o.channel)}
                                                    </div>
                                                    <div className="max-w-xs">
                                                        <h4 className="font-bold text-slate-900 dark:text-white truncate">
                                                            {o.subject || o.message || "Outreach Campaign Message"}
                                                        </h4>
                                                        <p className="text-[10px] text-slate-400 truncate">{o.message}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Sequence */}
                                            <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                                                {o.sequenceType || o.type || "Initial"} (Step {o.sequenceStep || 1})
                                            </td>

                                            {/* Prospect */}
                                            <td className="py-3.5 px-4">
                                                <span className="font-bold text-slate-900 dark:text-white">
                                                    {o.prospect?.companyName || o.prospect?.contactName || "Target Prospect"}
                                                </span>
                                            </td>

                                            {/* Status Pill */}
                                            <td className="py-3.5 px-4">
                                                <select
                                                    value={o.status || "Draft"}
                                                    onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                                                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${getStatusColor(o.status)}`}
                                                >
                                                    <option value="Draft">Draft</option>
                                                    <option value="Scheduled">Scheduled</option>
                                                    <option value="Sent">Sent</option>
                                                    <option value="Opened">Opened</option>
                                                    <option value="Replied">Replied</option>
                                                    <option value="Booked">Booked</option>
                                                    <option value="Failed">Failed</option>
                                                </select>
                                            </td>

                                            {/* Outcome */}
                                            <td className="py-3.5 px-4">
                                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                                                    {o.outcome || "Pending"}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(o)}
                                                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(o._id)}
                                                        className="p-1.5 rounded-lg border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 transition-colors cursor-pointer"
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

                    {/* Mobile Card View (<1024px) */}
                    <div className="lg:hidden space-y-3">
                        {outreachs.map((o) => (
                            <div key={o._id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            {getChannelIcon(o.channel)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[180px]">
                                                {o.subject || o.message || "Outreach Campaign"}
                                            </h4>
                                            <span className="text-[10px] text-slate-400">{o.sequenceType || "Initial"}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(o.status)}`}>
                                        {o.status || "Draft"}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-300">{o.message}</p>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                                    <span className="text-slate-400">Outcome: <strong>{o.outcome || "Pending"}</strong></span>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleOpenModal(o)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800"><Edit3 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(o._id)} className="p-1.5 rounded-lg border border-red-200 text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Page <strong>{page}</strong> of <strong>{totalPages}</strong></span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>

                </div>
            )}

            {/* CREATE / EDIT OUTREACH MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {editingOutreach ? "Edit Outreach Sequence" : "Launch New Outreach Sequence"}
                            </h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleSaveOutreach} className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Channel *</label>
                                    <select
                                        value={formData.channel}
                                        onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    >
                                        <option value="Email">Email</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Phone">Phone</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Sequence Type</label>
                                    <select
                                        value={formData.sequenceType}
                                        onChange={(e) => setFormData({ ...formData, sequenceType: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    >
                                        <option value="Initial">Initial</option>
                                        <option value="Follow Up 1">Follow Up 1</option>
                                        <option value="Follow Up 2">Follow Up 2</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Helping Savills Generate More Qualified Leads"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Message Body</label>
                                <textarea
                                    rows={4}
                                    placeholder="Type your outreach message content..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Initial Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Sent">Sent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-xs">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
                                    {isSubmitting ? "Launching..." : "Save Sequence"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
