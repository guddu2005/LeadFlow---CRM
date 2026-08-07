import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/layout/LoadingScreen";
import mockLeads from "../../utils/mock-data/leads";
import {
    Briefcase,
    Building2,
    Users,
    Mail,
    Phone,
    Search,
    Filter,
    Plus,
    Download,
    CheckCircle2,
    Edit3,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Calendar,
    Video,
    Clock,
    Bell,
    Tag,
} from "lucide-react";
import toast from "react-hot-toast";

export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Built-in Native Calendar Book Meeting Modal State
    const [showMeetingModal, setShowMeetingModal] = useState(false);
    const [selectedMeetingLead, setSelectedMeetingLead] = useState(null);
    const [meetingForm, setMeetingForm] = useState({
        scheduledAt: "",
        duration: 30,
        meetingLink: "https://meet.google.com/ina-cmdg-frr",
        notes: "Research interview meeting scheduled via LeadFlow CRM",
    });
    const [bookingMeeting, setBookingMeeting] = useState(false);

    const [formData, setFormData] = useState({
        companyName: "",
        contactFirstName: "",
        contactLastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        status: "Not Contacted",
        priority: "Medium",
        source: "Manual",
        notes: "",
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (searchQuery) params.search = searchQuery;
            if (statusFilter !== "all") params.status = statusFilter;
            if (priorityFilter !== "all") params.priority = priorityFilter;

            const [listRes, statsRes] = await Promise.allSettled([
                api.get("/leads", { params }),
                api.get("/leads/stats"),
            ]);

            if (listRes.status === "fulfilled") {
                const dataObj = listRes.value.data?.data || listRes.value.data?.message;
                if (dataObj && Array.isArray(dataObj.leads)) {
                    setLeads(dataObj.leads);
                    setTotalPages(dataObj.pagination?.totalPages || 1);
                } else if (Array.isArray(dataObj)) {
                    setLeads(dataObj);
                } else {
                    setLeads(mockLeads);
                }
            } else {
                setLeads(mockLeads);
            }

            if (statsRes.status === "fulfilled") {
                setStats(statsRes.value.data?.data || statsRes.value.data?.message);
            }
        } catch (err) {
            console.error("Fetch leads error:", err);
            setLeads(mockLeads);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, statusFilter, priorityFilter]);

    // Open Modal
    const handleOpenModal = (leadItem = null) => {
        if (leadItem) {
            setEditingLead(leadItem);
            setFormData({
                companyName: leadItem.companyName || leadItem.company?.companyName || "",
                contactFirstName: leadItem.contact?.firstName || "",
                contactLastName: leadItem.contact?.lastName || "",
                email: leadItem.contact?.email || "",
                phone: leadItem.contact?.phone || "",
                jobTitle: leadItem.contact?.jobTitle || "",
                status: leadItem.status || "Not Contacted",
                priority: leadItem.priority || "Medium",
                source: leadItem.source || "Manual",
                notes: leadItem.notes || "",
            });
        } else {
            setEditingLead(null);
            setFormData({
                companyName: "",
                contactFirstName: "",
                contactLastName: "",
                email: "",
                phone: "",
                jobTitle: "",
                status: "Not Contacted",
                priority: "Medium",
                source: "Manual",
                notes: "",
            });
        }
        setShowModal(true);
    };

    // Open Built-in Calendar Modal for Lead
    const handleOpenBookMeeting = (lead) => {
        setSelectedMeetingLead(lead);
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 1);
        defaultDate.setHours(14, 0, 0, 0);

        setMeetingForm({
            scheduledAt: defaultDate.toISOString().slice(0, 16),
            duration: 30,
            meetingLink: "https://meet.google.com/ina-cmdg-frr",
            notes: `Research interview meeting for ${lead.companyName || lead.company?.companyName || "Lead"}`,
        });
        setShowMeetingModal(true);
    };

    // Confirm & Save Meeting in CRM + Dispatch Dual Emails + Set 24h & 1h Reminders
    const handleConfirmMeeting = async (e) => {
        e.preventDefault();
        if (!selectedMeetingLead || !meetingForm.scheduledAt) {
            toast.error("Please select a valid date and time from the calendar");
            return;
        }

        setBookingMeeting(true);
        try {
            await api.post("/interviews", {
                lead: selectedMeetingLead._id,
                scheduledAt: meetingForm.scheduledAt,
                duration: Number(meetingForm.duration),
                meetingLink: meetingForm.meetingLink || "https://meet.google.com/ina-cmdg-frr",
                notes: meetingForm.notes,
                bookingSource: "Direct",
            });

            toast.success("Meeting booked on Google Meet! Confirmation email sent & automated reminders (1 day & 1 hr before) scheduled! 📅🔔");
            setShowMeetingModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to book meeting");
        } finally {
            setBookingMeeting(false);
        }
    };

    // Save Lead
    const handleSaveLead = async (e) => {
        e.preventDefault();
        if (!formData.companyName || !formData.contactFirstName) {
            toast.error("Company Name and Contact First Name are required");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingLead) {
                await api.patch(`/leads/${editingLead._id}`, formData);
                toast.success("Lead details updated! 🚀");
            } else {
                await api.post("/leads", formData);
                toast.success("New CRM Lead created! 🎯");
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save lead");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Convert Lead to Company Account
    const handleConvertToCompany = async (leadId) => {
        try {
            await api.post(`/leads/${leadId}/convert-company`);
            toast.success("Lead converted & stored in Companies collection! 🏢");
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to convert lead to company";
            toast.error(msg);
        }
    };

    // Quick Status Update
    const handleUpdateStatus = async (leadId, newStatus) => {
        try {
            await api.patch(`/leads/${leadId}`, { status: newStatus });
            toast.success(`Lead status updated to ${newStatus}`);
            fetchData();
        } catch (err) {
            toast.error("Failed to update lead status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead?")) return;
        try {
            await api.delete(`/leads/${id}`);
            toast.success("Lead deleted");
            fetchData();
        } catch (err) {
            toast.error("Failed to delete lead");
        }
    };

    const handleExportCSV = () => {
        if (leads.length === 0) {
            toast.error("No leads to export");
            return;
        }

        const headers = ["Company Name", "Contact Name", "Email", "Phone", "Status", "Priority", "Source", "Converted to Company"];
        const rows = leads.map((l) => [
            `"${l.companyName || l.company?.companyName || ""}"`,
            `"${l.contact?.firstName ? `${l.contact.firstName} ${l.contact.lastName || ""}` : ""}"`,
            `"${l.contact?.email || ""}"`,
            `"${l.contact?.phone || ""}"`,
            `"${l.status || ""}"`,
            `"${l.priority || ""}"`,
            `"${l.source || ""}"`,
            `"${l.isConvertedToCompany || l.company ? "Yes" : "No"}"`,
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LeadFlow_Leads_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${leads.length} leads to CSV! 📥`);
    };

    const filteredLeads = leads.filter((l) => {
        const comp = (l.companyName || l.company?.companyName || "").toLowerCase();
        const cont = (l.contact?.firstName || "").toLowerCase();
        const matchesStatus = statusFilter === "all" || l.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || l.priority === priorityFilter;
        const matchesSearch = !searchQuery || comp.includes(searchQuery.toLowerCase()) || cont.includes(searchQuery.toLowerCase());
        return matchesStatus && matchesPriority && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Sales Pipeline Stage</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        CRM Lead Pipeline & Meeting Booking
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Book research meetings on Google Meet with automated email confirmation & time-to-time reminders.
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
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Lead</span>
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Total Active Leads", value: stats?.overview?.totalLeads || leads.length, color: "text-indigo-600 dark:text-indigo-400" },
                    { title: "Not Contacted", value: leads.filter(l => (l.status || "Not Contacted") === "Not Contacted").length, color: "text-slate-600 dark:text-slate-400" },
                    { title: "In Outreach / Replied", value: leads.filter(l => l.status === "Contacted" || l.status === "Replied").length, color: "text-purple-600 dark:text-purple-400" },
                    { title: "Converted to Company", value: leads.filter(l => l.isConvertedToCompany || l.company).length, color: "text-emerald-600 dark:text-emerald-400" },
                ].map((st, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{st.title}</span>
                        <div className={`text-2xl font-extrabold ${st.color}`}>{st.value}</div>
                    </div>
                ))}
            </div>

            {/* Search & Status Filters */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="relative w-full lg:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search lead or company name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    <span className="text-xs font-semibold text-slate-500">Status:</span>
                    {["all", "Not Contacted", "Contacted", "Replied", "Booked"].map((st) => (
                        <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                                statusFilter === st
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            {st === "all" ? "All" : st}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop Table & Mobile View */}
            {loading ? (
                <LoadingScreen message="Loading CRM Lead Pipeline..." />
            ) : (
                <div className="space-y-4">
                    
                    {/* Desktop Table */}
                    <div className="hidden lg:block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                                        <th className="py-3.5 px-4">Company & Contact</th>
                                        <th className="py-3.5 px-4">Contact Info</th>
                                        <th className="py-3.5 px-4">Pipeline Status</th>
                                        <th className="py-3.5 px-4">Schedule Meeting</th>
                                        <th className="py-3.5 px-4">Company Conversion</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredLeads.map((l) => {
                                        const compName = l.companyName || l.company?.companyName || "Lead Company";
                                        const contName = l.contact?.firstName ? `${l.contact.firstName} ${l.contact.lastName || ""}` : "Primary Contact";
                                        const isConverted = l.isConvertedToCompany || l.company;

                                        return (
                                            <tr key={l._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                                
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                                                            {compName[0]}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 dark:text-white">{compName}</h4>
                                                            <p className="text-[11px] text-slate-500">{contName} {l.contact?.jobTitle ? `• ${l.contact.jobTitle}` : ""}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 space-y-0.5">
                                                    {l.contact?.email && (
                                                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{l.contact.email}</span>
                                                        </div>
                                                    )}
                                                    {l.contact?.phone && (
                                                        <div className="flex items-center gap-1.5 text-slate-500">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{l.contact.phone}</span>
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <select
                                                        value={l.status || "Not Contacted"}
                                                        onChange={(e) => handleUpdateStatus(l._id, e.target.value)}
                                                        className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 cursor-pointer"
                                                    >
                                                        <option value="Not Contacted">Not Contacted</option>
                                                        <option value="Contacted">Contacted</option>
                                                        <option value="Replied">Replied</option>
                                                        <option value="Booked">Booked</option>
                                                        <option value="Declined">Declined</option>
                                                    </select>
                                                </td>

                                                {/* Book Meeting Button (Calendar Modal) */}
                                                <td className="py-3.5 px-4">
                                                    <button
                                                        onClick={() => handleOpenBookMeeting(l)}
                                                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                                                    >
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>Book Meeting</span>
                                                    </button>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    {isConverted ? (
                                                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] inline-flex items-center gap-1">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                            <span>Stored in Companies</span>
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleConvertToCompany(l._id)}
                                                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-[11px] font-semibold border transition-all flex items-center gap-1.5 cursor-pointer"
                                                        >
                                                            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                                                            <span>Convert to Company</span>
                                                        </button>
                                                    )}
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button onClick={() => handleOpenModal(l)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-600"><Edit3 className="w-3.5 h-3.5" /></button>
                                                        <button onClick={() => handleDelete(l._id)} className="p-1.5 rounded-lg border border-red-200 dark:border-red-950 hover:bg-red-50 text-red-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                                                    </div>
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
                        {filteredLeads.map((l) => {
                            const compName = l.companyName || l.company?.companyName || "Lead Company";
                            const contName = l.contact?.firstName ? `${l.contact.firstName} ${l.contact.lastName || ""}` : "Primary Contact";
                            const isConverted = l.isConvertedToCompany || l.company;

                            return (
                                <div key={l._id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{compName}</h4>
                                        <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded">{l.status || "Not Contacted"}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{contName}</p>

                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <button onClick={() => handleOpenBookMeeting(l)} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold">Book Meeting</button>
                                        <button onClick={() => handleDelete(l._id)} className="p-1.5 rounded-lg border border-red-200 text-red-600"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            );
                        })}
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

            {/* NATIVE CALENDAR BOOK MEETING & AUTOMATED REMINDER MODAL */}
            {showMeetingModal && selectedMeetingLead && (
                <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Book Research Meeting</h3>
                                    <p className="text-xs text-slate-400">
                                        Client: <strong>{selectedMeetingLead.contact?.firstName || "Candidate"}</strong> ({selectedMeetingLead.companyName || selectedMeetingLead.company?.companyName || "Lead"})
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowMeetingModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
                        </div>

                        {/* Meeting & Reminders Notice Banner */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-800/80 space-y-1.5 text-xs">
                            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
                                <Video className="w-4 h-4 text-blue-600" />
                                <span>Google Meet Video Call & Email Reminders</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300">
                                Confirming this booking sends instant confirmation emails to both <strong>Client</strong> and <strong>Host</strong>, and schedules <strong>automated 24-hour and 1-hour reminders</strong>.
                            </p>
                        </div>

                        {/* Meeting Schedule Form */}
                        <form onSubmit={handleConfirmMeeting} className="space-y-4">
                            
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Select Date & Time from Calendar *</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={meetingForm.scheduledAt}
                                    onChange={(e) => setMeetingForm({ ...meetingForm, scheduledAt: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
                                    <Video className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Backend Google Meet Link</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={meetingForm.meetingLink}
                                    onChange={(e) => setMeetingForm({ ...meetingForm, meetingLink: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold"
                                />
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                    <Bell className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Automated Reminder Schedule:</span>
                                </span>
                                <ul className="text-[10px] text-slate-500 list-disc pl-4 space-y-0.5">
                                    <li><strong>1 Day Before (24h)</strong>: Email + Socket.IO push notification sent automatically.</li>
                                    <li><strong>1 Hour Before</strong>: Email + Socket.IO starting-soon reminder sent automatically.</li>
                                </ul>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowMeetingModal(false)} className="px-4 py-2 rounded-xl border text-xs font-semibold">Cancel</button>
                                <button type="submit" disabled={bookingMeeting} className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20">
                                    {bookingMeeting ? "Booking Meeting..." : "Book Meeting & Send Emails ✉️"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* ADD / EDIT LEAD MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {editingLead ? "Edit Lead Details" : "Create New CRM Lead"}
                            </h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleSaveLead} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Company Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Contact First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.contactFirstName}
                                        onChange={(e) => setFormData({ ...formData, contactFirstName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Contact Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.contactLastName}
                                        onChange={(e) => setFormData({ ...formData, contactLastName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    >
                                        <option value="Not Contacted">Not Contacted</option>
                                        <option value="Contacted">Contacted</option>
                                        <option value="Replied">Replied</option>
                                        <option value="Booked">Booked</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-xs">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold">
                                    {isSubmitting ? "Saving..." : "Save Lead"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
