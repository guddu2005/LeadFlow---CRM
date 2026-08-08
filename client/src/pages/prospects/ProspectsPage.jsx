import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/layout/LoadingScreen";

import {
    Target,
    Search,
    Filter,
    Plus,
    Download,
    Upload,
    CheckCircle2,
    Building2,
    Mail,
    Phone,
    Globe,
    UserCheck,
    Edit3,
    Trash2,
    Sparkles,
    RefreshCw,
    X,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    FileSpreadsheet,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ProspectsPage() {
    const [prospects, setProspects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modals state
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProspect, setEditingProspect] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        jobTitle: "",
        website: "",
        city: "",
        country: "",
        status: "Not Contacted",
        signal: "High Intent",
        currentSoftware: "Legacy CRM",
        notes: "",
    });

    const fetchProspects = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (searchQuery) params.search = searchQuery;
            if (statusFilter !== "all") params.status = statusFilter;

            const res = await api.get("/prospects", { params });
            const dataObj = res.data?.data || res.data?.message;

            if (dataObj && Array.isArray(dataObj.prospects)) {
                setProspects(dataObj.prospects);
                setTotalPages(dataObj.pagination?.totalPages || 1);
            } else if (Array.isArray(dataObj)) {
                setProspects(dataObj);
            } else {
                setProspects([]);
            }
        } catch (error) {
            console.error("Fetch prospects error:", error);
            setProspects([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProspects();
    }, [page, statusFilter]);

    // Handle Search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProspects();
    };

    // Open Add or Edit Modal
    const handleOpenAddModal = (prospect = null) => {
        if (prospect) {
            setEditingProspect(prospect);
            setFormData({
                companyName: prospect.companyName || "",
                contactName: prospect.contactName || "",
                email: prospect.email || "",
                phone: prospect.phone || "",
                jobTitle: prospect.jobTitle || "",
                website: prospect.website || "",
                city: prospect.location?.city || "",
                country: prospect.location?.country || "",
                status: prospect.status || "Not Contacted",
                signal: prospect.signal || "High Intent",
                currentSoftware: prospect.currentSoftware || "",
                notes: prospect.notes || "",
            });
        } else {
            setEditingProspect(null);
            setFormData({
                companyName: "",
                contactName: "",
                email: "",
                phone: "",
                jobTitle: "",
                website: "",
                city: "",
                country: "",
                status: "Not Contacted",
                signal: "High Intent",
                currentSoftware: "",
                notes: "",
            });
        }
        setShowAddModal(true);
    };

    // Save (Create or Update) Prospect
    const handleSaveProspect = async (e) => {
        e.preventDefault();
        if (!formData.companyName || !formData.contactName) {
            toast.error("Company Name and Contact Name are required");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                companyName: formData.companyName,
                contactName: formData.contactName,
                email: formData.email,
                phone: formData.phone,
                jobTitle: formData.jobTitle,
                website: formData.website,
                location: { city: formData.city, country: formData.country },
                status: formData.status,
                signal: formData.signal,
                currentSoftware: formData.currentSoftware,
                notes: formData.notes,
            };

            if (editingProspect) {
                await api.patch(`/prospects/${editingProspect._id}`, payload);
                toast.success("Prospect updated successfully! 🎉");
            } else {
                await api.post("/prospects", payload);
                toast.success("New prospect created successfully! 🚀");
            }

            setShowAddModal(false);
            fetchProspects();
        } catch (err) {
            const msg = err.response?.data?.message || err.message || "Failed to save prospect";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Convert Prospect to Lead
    const handleConvert = async (prospectId) => {
        try {
            await api.post(`/prospects/${prospectId}/convert`);
            toast.success("Prospect converted into a Lead successfully! 🎯");
            fetchProspects();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to convert prospect";
            toast.error(msg);
        }
    };

    // Delete Prospect
    const handleDelete = async (prospectId) => {
        if (!window.confirm("Are you sure you want to delete this prospect?")) return;
        try {
            await api.delete(`/prospects/${prospectId}`);
            toast.success("Prospect deleted successfully");
            fetchProspects();
        } catch (err) {
            toast.error("Failed to delete prospect");
        }
    };

    // Import CSV handler
    const handleImportCSV = async (e) => {
        e.preventDefault();
        if (!csvFile) {
            toast.error("Please select a CSV file to import");
            return;
        }

        setIsSubmitting(true);
        try {
            const form = new FormData();
            form.append("file", csvFile);
            await api.post("/prospects/import", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("CSV prospects imported successfully! 📊");
            setShowImportModal(false);
            setCsvFile(null);
            fetchProspects();
        } catch (err) {
            toast.error(err.response?.data?.message || "CSV import failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    // EXPORT DATA (CSV & JSON format)
    const handleExportCSV = () => {
        if (prospects.length === 0) {
            toast.error("No prospect data available to export");
            return;
        }

        const headers = ["Company Name", "Contact Name", "Email", "Phone", "Job Title", "City", "Country", "Status", "Signal", "Software"];
        const rows = prospects.map((p) => [
            `"${p.companyName || p.company || ""}"`,
            `"${p.contactName || p.contact || ""}"`,
            `"${p.email || ""}"`,
            `"${p.phone || ""}"`,
            `"${p.jobTitle || ""}"`,
            `"${p.location?.city || ""}"`,
            `"${p.location?.country || ""}"`,
            `"${p.status || ""}"`,
            `"${p.signal || ""}"`,
            `"${p.currentSoftware || ""}"`,
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LeadFlow_Prospects_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${prospects.length} prospects to CSV! 📥`);
    };

    const getComplianceBadge = (countryStr) => {
        const c = (countryStr || "").toLowerCase();
        if (c.includes("germany") || c.includes("de")) {
            return {
                label: "🇩🇪 Germany: LinkedIn/Phone Only",
                badge: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200",
            };
        }
        if (c.includes("netherlands") || c.includes("nl") || c.includes("nordic") || c.includes("sweden") || c.includes("denmark") || c.includes("finland") || c.includes("norway")) {
            return {
                label: "🇳🇱 NL/Nordics: Approval Required",
                badge: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200",
            };
        }
        return {
            label: "🇬🇧 UK/IE: B2B Email Allowed",
            badge: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200",
        };
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Top Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                        <Target className="w-3.5 h-3.5" />
                        <span>Lead Generation Engine</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Prospects Management
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Discover, qualify, and convert raw target prospects into verified CRM leads.
                    </p>
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={handleExportCSV}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                        <Download className="w-4 h-4 text-emerald-600" />
                        <span>Export CSV</span>
                    </button>

                    <button
                        onClick={() => setShowImportModal(true)}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>Import CSV</span>
                    </button>

                    <button
                        onClick={() => handleOpenAddModal(null)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Prospect</span>
                    </button>
                </div>
            </div>

            {/* COMPLIANCE GUARD INDICATOR BANNER */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/60 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-600/40 border border-indigo-400/30 text-indigo-300 shrink-0">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">GDPR & PECR Legal Compliance Guard Active</h4>
                        <p className="text-[11px] text-slate-300">UK B2B Email Allowed • Germany Cold Email Prohibited (§7 UWG) • Netherlands/Nordics Sign-off Required</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">🇬🇧 UK GDPR</span>
                    <span className="px-2.5 py-1 rounded-full bg-red-950 border border-red-800 text-red-400">🇩🇪 Germany Rules</span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-400">🇳🇱 Nordics Rules</span>
                </div>
            </div>

            {/* Overview Stat Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { title: "Total Prospects", value: prospects.length, color: "text-blue-600 dark:text-blue-400" },
                    { title: "Not Contacted", value: prospects.filter(p => (p.status || "Not Contacted") === "Not Contacted").length, color: "text-slate-600 dark:text-slate-400" },
                    { title: "Contacted", value: prospects.filter(p => p.status === "Contacted").length, color: "text-indigo-600 dark:text-indigo-400" },
                    { title: "Replied", value: prospects.filter(p => p.status === "Replied").length, color: "text-purple-600 dark:text-purple-400" },
                    { title: "Converted", value: prospects.filter(p => p.converted || p.convertedToLead).length, color: "text-emerald-600 dark:text-emerald-400" },
                ].map((st, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{st.title}</span>
                        <div className={`text-2xl font-extrabold ${st.color}`}>{st.value}</div>
                    </div>
                ))}
            </div>

            {/* Filter & Search Bar Container */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search company, contact, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </form>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Status:</span>
                    {["all", "Not Contacted", "Contacted", "Replied", "Booked"].map((st) => (
                        <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                                statusFilter === st
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            {st === "all" ? "All" : st}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop & Mobile Responsive Data Presentation */}
            {loading ? (
                <LoadingScreen message="Loading Prospects Directory..." />
            ) : (
                <div className="space-y-4">
                    
                    {/* Desktop Table View (Hidden on Mobile) */}
                    <div className="hidden lg:block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                                        <th className="py-3.5 px-4">Company & Contact</th>
                                        <th className="py-3.5 px-4">Contact Info</th>
                                        <th className="py-3.5 px-4">Location & Legal Guard</th>
                                        <th className="py-3.5 px-4">Signal / Software</th>
                                        <th className="py-3.5 px-4">Status</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {prospects.map((p) => {
                                        const compName = p.companyName || p.company || "Prospect Corp";
                                        const contName = p.contactName || p.contact || "Primary Contact";
                                        const isConverted = p.converted || p.convertedToLead;
                                        const compGuard = getComplianceBadge(p.location?.country || p.country);

                                        return (
                                            <tr key={p._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                                
                                                {/* Company & Contact */}
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                                                            {compName[0]}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 dark:text-white">{compName}</h4>
                                                            <p className="text-[11px] text-slate-500">{contName} {p.jobTitle ? `• ${p.jobTitle}` : ""}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Contact Info */}
                                                <td className="py-3.5 px-4 space-y-0.5">
                                                    {p.email && (
                                                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{p.email}</span>
                                                        </div>
                                                    )}
                                                    {p.phone && (
                                                        <div className="flex items-center gap-1.5 text-slate-500">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{p.phone}</span>
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Location & Legal Guard */}
                                                <td className="py-3.5 px-4 space-y-1">
                                                    <div className="text-slate-600 dark:text-slate-400 font-semibold">
                                                        {p.location?.city || p.location?.country ? (
                                                            <span>{p.location?.city}{p.location?.city && p.location?.country ? ", " : ""}{p.location?.country}</span>
                                                        ) : (
                                                            <span>UK</span>
                                                        )}
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${compGuard.badge}`}>
                                                        {compGuard.label}
                                                    </span>
                                                </td>


                                                {/* Signal / Software */}
                                                <td className="py-3.5 px-4">
                                                    <div className="space-y-0.5">
                                                        <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                                                            {p.signal || "High Intent"}
                                                        </span>
                                                        {p.currentSoftware && (
                                                            <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                                                {p.currentSoftware}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Status Pill */}
                                                <td className="py-3.5 px-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${
                                                        isConverted
                                                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                                            : p.status === "Contacted"
                                                            ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                                                            : p.status === "Replied"
                                                            ? "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300"
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                    }`}>
                                                        {isConverted ? "Converted" : p.status || "Not Contacted"}
                                                    </span>
                                                </td>

                                                {/* Action Buttons */}
                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        {!isConverted && (
                                                            <button
                                                                onClick={() => handleConvert(p._id)}
                                                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold shadow transition-colors flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <UserCheck className="w-3.5 h-3.5" />
                                                                <span>Convert</span>
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => handleOpenAddModal(p)}
                                                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                                                        >
                                                            <Edit3 className="w-3.5 h-3.5" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(p._id)}
                                                            className="p-1.5 rounded-lg border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 transition-colors cursor-pointer"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>


                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card List View (Visible on Mobile & Tablet <1024px) */}
                    <div className="lg:hidden space-y-3">
                        {prospects.map((p) => {
                            const compName = p.companyName || p.company || "Prospect Corp";
                            const contName = p.contactName || p.contact || "Primary Contact";
                            const isConverted = p.converted || p.convertedToLead;

                            return (
                                <div key={p._id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow">
                                                {compName[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{compName}</h4>
                                                <p className="text-xs text-slate-500">{contName} {p.jobTitle ? `• ${p.jobTitle}` : ""}</p>
                                            </div>
                                        </div>

                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            isConverted
                                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                                : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                        }`}>
                                            {isConverted ? "Converted" : p.status || "Not Contacted"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                                        <div>Email: <strong>{p.email || "N/A"}</strong></div>
                                        <div>Phone: <strong>{p.phone || "N/A"}</strong></div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        {!isConverted && (
                                            <button
                                                onClick={() => handleConvert(p._id)}
                                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow"
                                            >
                                                Convert to Lead
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleOpenAddModal(p)}
                                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p._id)}
                                            className="p-1.5 rounded-lg border border-red-200 text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Bar */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                            Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                </div>
            )}

            {/* ADD / EDIT PROSPECT MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {editingProspect ? "Edit Prospect Details" : "Create New Target Prospect"}
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProspect} className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Company Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Contact Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        value={formData.jobTitle}
                                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Website</label>
                                    <input
                                        type="text"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Country</label>
                                    <input
                                        type="text"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs cursor-pointer"
                                    >
                                        <option value="Not Contacted">Not Contacted</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Replied">Replied</option>
                                        <option value="Booked">Booked</option>
                                        <option value="Declined">Declined</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Buying Signal</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Hiring, Expanding"
                                        value={formData.signal}
                                        onChange={(e) => setFormData({ ...formData, signal: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Current Software</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Spreadsheets, Salesforce"
                                        value={formData.currentSoftware}
                                        onChange={(e) => setFormData({ ...formData, currentSoftware: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Notes</label>
                                    <input
                                        type="text"
                                        placeholder="Additional prospect context"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow"
                                >
                                    {isSubmitting ? "Saving..." : "Save Prospect"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CSV IMPORT MODAL */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Import Prospects CSV</h3>
                            <button onClick={() => setShowImportModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleImportCSV} className="space-y-4">
                            <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-2">
                                <FileSpreadsheet className="w-8 h-8 text-blue-600 mx-auto" />
                                <p className="text-xs text-slate-600 dark:text-slate-300">Select a CSV file containing companyName, contactName, email, etc.</p>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => setCsvFile(e.target.files[0])}
                                    className="text-xs text-slate-500 mx-auto"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowImportModal(false)} className="px-4 py-2 rounded-xl border text-xs">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
                                    {isSubmitting ? "Uploading..." : "Upload & Import"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
