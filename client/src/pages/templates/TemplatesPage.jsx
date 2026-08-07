import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/layout/LoadingScreen";
import mockTemplates from "../../utils/mock-data/templates";
import {
    FileText,
    Mail,
    Phone,
    Globe,
    Plus,
    Search,
    Filter,
    Download,
    Eye,
    Edit3,
    Trash2,
    X,
    Sparkles,
    Copy,
    CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function TemplatesPage() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [channelFilter, setChannelFilter] = useState("all");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [previewModal, setPreviewModal] = useState(null);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        channel: "Email",
        type: "Initial",
        subject: "",
        message: "",
        status: "Active",
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/templates");
            const dataObj = res.data?.data || res.data?.message;

            if (Array.isArray(dataObj)) {
                setTemplates(dataObj);
            } else if (dataObj?.templates) {
                setTemplates(dataObj.templates);
            } else {
                setTemplates(mockTemplates);
            }
        } catch (err) {
            console.error("Fetch templates error:", err);
            setTemplates(mockTemplates);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (templateItem = null) => {
        if (templateItem) {
            setEditingTemplate(templateItem);
            setFormData({
                name: templateItem.name || "",
                channel: templateItem.channel || "Email",
                type: templateItem.type || "Initial",
                subject: templateItem.subject || "",
                message: templateItem.message || "",
                status: templateItem.status || "Active",
            });
        } else {
            setEditingTemplate(null);
            setFormData({
                name: "",
                channel: "Email",
                type: "Initial",
                subject: "",
                message: "",
                status: "Active",
            });
        }
        setShowModal(true);
    };

    const handleSaveTemplate = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.message) {
            toast.error("Template Name and Message Body are required");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingTemplate) {
                await api.patch(`/templates/${editingTemplate._id}`, formData);
                toast.success("Template updated successfully! 📝");
            } else {
                await api.post("/templates", formData);
                toast.success("New template created! 🚀");
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save template");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this template?")) return;
        try {
            await api.delete(`/templates/${id}`);
            toast.success("Template deleted");
            fetchData();
        } catch (err) {
            toast.error("Failed to delete template");
        }
    };

    const handleExportCSV = () => {
        if (templates.length === 0) {
            toast.error("No templates to export");
            return;
        }

        const headers = ["Name", "Channel", "Type", "Subject", "Message", "Status"];
        const rows = templates.map((t) => [
            `"${t.name || ""}"`,
            `"${t.channel || ""}"`,
            `"${t.type || ""}"`,
            `"${t.subject || ""}"`,
            `"${t.message || ""}"`,
            `"${t.status || ""}"`,
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LeadFlow_Templates_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${templates.length} templates to CSV! 📥`);
    };

    const getChannelIcon = (ch) => {
        if (ch === "LinkedIn") return <Globe className="w-4 h-4 text-blue-500" />;
        if (ch === "Phone") return <Phone className="w-4 h-4 text-emerald-500" />;
        return <Mail className="w-4 h-4 text-purple-500" />;
    };

    const filteredTemplates = templates.filter((t) => {
        const matchesChannel = channelFilter === "all" || t.channel === channelFilter;
        const matchesSearch = !searchQuery || (t.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesChannel && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 text-xs font-semibold">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Outreach Copy Library</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Message Templates & Scripts
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Create reusable multi-channel email templates, LinkedIn messages, and phone call scripts with variable tags.
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
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-purple-500/25 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Template</span>
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Total Templates", value: templates.length, color: "text-purple-600 dark:text-purple-400" },
                    { title: "Email Templates", value: templates.filter(t => t.channel === "Email").length, color: "text-indigo-600 dark:text-indigo-400" },
                    { title: "LinkedIn Scripts", value: templates.filter(t => t.channel === "LinkedIn").length, color: "text-blue-600 dark:text-blue-400" },
                    { title: "Phone Scripts", value: templates.filter(t => t.channel === "Phone").length, color: "text-emerald-600 dark:text-emerald-400" },
                ].map((st, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{st.title}</span>
                        <div className={`text-2xl font-extrabold ${st.color}`}>{st.value}</div>
                    </div>
                ))}
            </div>

            {/* Filter & Search */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search template name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    <span className="text-xs font-semibold text-slate-500 shrink-0">Channel:</span>
                    {["all", "Email", "LinkedIn", "Phone"].map((ch) => (
                        <button
                            key={ch}
                            onClick={() => setChannelFilter(ch)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                                channelFilter === ch
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            {ch === "all" ? "All" : ch}
                        </button>
                    ))}
                </div>
            </div>

            {/* Template Cards Grid */}
            {loading ? (
                <LoadingScreen message="Loading Message Templates..." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTemplates.map((t) => (
                        <div key={t._id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-4 hover:border-purple-200 dark:hover:border-purple-900 transition-all">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            {getChannelIcon(t.channel)}
                                        </div>
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.channel}</span>
                                    </div>
                                    <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                                        {t.type || "Initial"}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{t.name}</h4>
                                    {t.subject && <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">Subject: {t.subject}</p>}
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 font-mono line-clamp-4">
                                    {t.message}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => setPreviewModal(t)}
                                    className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Preview Variable Substitution</span>
                                </button>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => handleOpenModal(t)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600"><Edit3 className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded-lg border border-red-200 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ADD/EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {editingTemplate ? "Edit Template" : "Create New Template"}
                            </h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleSaveTemplate} className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Template Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Cold Email Introduction V1"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Channel</label>
                                    <select
                                        value={formData.channel}
                                        onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    >
                                        <option value="Email">Email</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Phone">Phone</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Sequence Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    >
                                        <option value="Initial">Initial</option>
                                        <option value="Follow Up 1">Follow Up 1</option>
                                        <option value="Follow Up 2">Follow Up 2</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject Line</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Helping {{companyName}} Grow Sales"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Message Body *</label>
                                <textarea
                                    rows={5}
                                    required
                                    placeholder="Hi {{firstName}}, I noticed {{companyName}}..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono"
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Use tags like <code>&#123;&#123;firstName&#125;&#125;</code> and <code>&#123;&#123;companyName&#125;&#125;</code> for automatic substitution.</p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-xs">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold">
                                    {isSubmitting ? "Saving..." : "Save Template"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PREVIEW MODAL */}
            {previewModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Variable Preview</h3>
                            <button onClick={() => setPreviewModal(null)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>

                        <div className="space-y-3">
                            {previewModal.subject && (
                                <div>
                                    <span className="text-[10px] font-bold uppercase text-slate-400">Substituted Subject:</span>
                                    <p className="text-xs font-bold text-slate-900 dark:text-white p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                                        {previewModal.subject.replace(/\{\{firstName\}\}/g, "Guddu").replace(/\{\{companyName\}\}/g, "Savills Real Estate")}
                                    </p>
                                </div>
                            )}

                            <div>
                                <span className="text-[10px] font-bold uppercase text-slate-400">Substituted Message Body:</span>
                                <div className="text-xs text-slate-700 dark:text-slate-200 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono whitespace-pre-wrap">
                                    {previewModal.message.replace(/\{\{firstName\}\}/g, "Guddu").replace(/\{\{companyName\}\}/g, "Savills Real Estate")}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button onClick={() => setPreviewModal(null)} className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold">Close Preview</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
