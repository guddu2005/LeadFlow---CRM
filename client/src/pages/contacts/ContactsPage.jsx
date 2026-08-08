import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/layout/LoadingScreen";

import {
    Users,
    Mail,
    Phone,
    Briefcase,
    Building2,
    Search,
    Plus,
    Download,
    RefreshCw,
    Edit3,
    Trash2,
    X,
    UserCheck,
    Send,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ContactsPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Direct Quick Email Modal State
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailForm, setEmailForm] = useState({ to: "", subject: "", html: "" });
    const [sendingEmail, setSendingEmail] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        jobTitle: "",
        company: "",
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get("/contacts");
            const dataObj = res.data?.data || res.data?.message;

            if (Array.isArray(dataObj)) {
                setContacts(dataObj);
            } else if (dataObj?.contacts) {
                setContacts(dataObj.contacts);
            } else {
                setContacts([]);
            }
        } catch (err) {
            console.error("Fetch contacts error:", err);
            setContacts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveContact = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.email) {
            toast.error("First Name and Email are required");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingContact) {
                await api.patch(`/contacts/${editingContact._id}`, formData);
                toast.success("Contact details updated! 👤");
            } else {
                await api.post("/contacts", formData);
                toast.success("New contact added! 👤");
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save contact");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenQuickEmail = (contact) => {
        setEmailForm({
            to: contact.email || "",
            subject: `LeadFlow Research Invitation for ${contact.firstName || "Contact"}`,
            html: `Hi ${contact.firstName || "there"},\n\nI came across your profile as ${contact.jobTitle || "Executive"}. We are conducting a research study on real estate operations.\n\nWould you be open for a short 15-minute conversation next week?\n\nBest regards,\nGuddu Kumar`,
        });
        setShowEmailModal(true);
    };

    const handleSendQuickEmail = async (e) => {
        e.preventDefault();
        if (!emailForm.to || !emailForm.subject || !emailForm.html) {
            toast.error("All fields are required");
            return;
        }

        setSendingEmail(true);
        try {
            await api.post("/emails/send", emailForm);
            toast.success(`Email dispatched directly to ${emailForm.to}! ✉️`);
            setShowEmailModal(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send email");
        } finally {
            setSendingEmail(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) return;
        try {
            await api.delete(`/contacts/${id}`);
            toast.success("Contact deleted");
            fetchData();
        } catch (err) {
            toast.error("Failed to delete contact");
        }
    };

    const handleExportCSV = () => {
        if (contacts.length === 0) {
            toast.error("No contacts to export");
            return;
        }

        const headers = ["First Name", "Last Name", "Email", "Phone", "Job Title"];
        const rows = contacts.map((c) => [
            `"${c.firstName || ""}"`,
            `"${c.lastName || ""}"`,
            `"${c.email || ""}"`,
            `"${c.phone || ""}"`,
            `"${c.jobTitle || ""}"`,
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LeadFlow_Contacts_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${contacts.length} contacts to CSV! 📥`);
    };

    const filteredContacts = contacts.filter((c) => {
        const full = `${c.firstName || ""} ${c.lastName || ""} ${c.email || ""}`.toLowerCase();
        return !searchQuery || full.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        <Users className="w-3.5 h-3.5" />
                        <span>People Directory</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Contacts & Key Decision Makers
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Maintain verified corporate contact profiles, dispatches emails, and manages executive details.
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
                        onClick={() => {
                            setEditingContact(null);
                            setFormData({
                                firstName: "",
                                lastName: "",
                                email: "",
                                phone: "",
                                jobTitle: "",
                                company: "",
                            });
                            setShowModal(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Contact</span>
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Total Contacts", value: contacts.length, color: "text-emerald-600 dark:text-emerald-400" },
                    { title: "Verified Emails", value: contacts.filter(c => c.email).length, color: "text-blue-600 dark:text-blue-400" },
                    { title: "Executive Level", value: contacts.filter(c => (c.jobTitle || "").toLowerCase().includes("head") || (c.jobTitle || "").toLowerCase().includes("director")).length, color: "text-purple-600 dark:text-purple-400" },
                    { title: "Direct Phones", value: contacts.filter(c => c.phone).length, color: "text-indigo-600 dark:text-indigo-400" },
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
                        placeholder="Search name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </div>

            {/* Desktop Table & Mobile View */}
            {loading ? (
                <LoadingScreen message="Loading Contacts Directory..." />
            ) : (
                <div className="space-y-4">
                    
                    {/* Desktop Table */}
                    <div className="hidden lg:block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                                        <th className="py-3.5 px-4">Contact Name</th>
                                        <th className="py-3.5 px-4">Email</th>
                                        <th className="py-3.5 px-4">Phone</th>
                                        <th className="py-3.5 px-4">Job Title</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredContacts.map((c) => {
                                        const fullName = `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Decision Maker";
                                        return (
                                            <tr key={c._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                                
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                                                            {fullName[0]}
                                                        </div>
                                                        <span className="font-bold text-slate-900 dark:text-white">{fullName}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{c.email || "N/A"}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-500">
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{c.phone || "N/A"}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className="px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                                                        {c.jobTitle || "Executive"}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => handleOpenQuickEmail(c)}
                                                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow"
                                                        >
                                                            <Send className="w-3 h-3" />
                                                            <span>Send Email</span>
                                                        </button>

                                                        <button onClick={() => { setEditingContact(c); setFormData({ firstName: c.firstName || "", lastName: c.lastName || "", email: c.email || "", phone: c.phone || "", jobTitle: c.jobTitle || "", company: c.company || "" }); setShowModal(true); }} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600"><Edit3 className="w-3.5 h-3.5" /></button>
                                                        <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg border border-red-200 text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
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
                        {filteredContacts.map((c) => {
                            const fullName = `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Decision Maker";
                            return (
                                <div key={c._id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fullName}</h4>
                                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">{c.jobTitle || "Executive"}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{c.email}</p>
                                    <div className="flex justify-end gap-2 pt-2 border-t">
                                        <button onClick={() => handleOpenQuickEmail(c)} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold">Send Email</button>
                                        <button onClick={() => handleDelete(c._id)} className="p-1.5 border border-red-200 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            )}

            {/* QUICK EMAIL DISPATCH MODAL */}
            {showEmailModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Send className="w-4 h-4 text-blue-600" />
                                <span>Send Direct Cold Email</span>
                            </h3>
                            <button onClick={() => setShowEmailModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleSendQuickEmail} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">To Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    value={emailForm.to}
                                    onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject Line *</label>
                                <input
                                    type="text"
                                    required
                                    value={emailForm.subject}
                                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Message Body *</label>
                                <textarea
                                    rows={6}
                                    required
                                    value={emailForm.html}
                                    onChange={(e) => setEmailForm({ ...emailForm, html: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono"
                                />
                            </div>

                            <div className="pt-3 border-t flex justify-end gap-3">
                                <button type="button" onClick={() => setShowEmailModal(false)} className="px-4 py-2 rounded-xl border text-xs">Cancel</button>
                                <button type="submit" disabled={sendingEmail} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold">
                                    {sendingEmail ? "Dispatching..." : "Send Email Now"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADD/EDIT CONTACT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {editingContact ? "Edit Contact Profile" : "Create Contact"}
                            </h3>
                            <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleSaveContact} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        value={formData.jobTitle}
                                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border text-xs">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold">
                                    {isSubmitting ? "Saving..." : "Save Contact"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
