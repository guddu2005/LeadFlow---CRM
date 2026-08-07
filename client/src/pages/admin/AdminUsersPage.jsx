import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/layout/LoadingScreen";
import {
    ShieldAlert,
    UserCheck,
    Users,
    Mail,
    Shield,
    Briefcase,
    Search,
    Filter,
    Download,
    Plus,
    UserPlus,
    X,
    CheckCircle2,
    Clock,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Assign Lead Modal
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedLeadId, setSelectedLeadId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, leadsRes] = await Promise.allSettled([
                api.get("/auth/users"),
                api.get("/leads"),
            ]);

            if (usersRes.status === "fulfilled") {
                const dataObj = usersRes.value.data?.data || usersRes.value.data?.message;
                if (Array.isArray(dataObj)) {
                    setUsers(dataObj);
                } else if (dataObj?.users) {
                    setUsers(dataObj.users);
                }
            }

            if (leadsRes.status === "fulfilled") {
                const dataObj = leadsRes.value.data?.data || leadsRes.value.data?.message;
                const lList = dataObj?.leads || (Array.isArray(dataObj) ? dataObj : []);
                setLeads(lList);
            }
        } catch (err) {
            console.error("Fetch admin users error:", err);
            toast.error("Failed to load user management data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenAssignModal = (user) => {
        setSelectedUser(user);
        setSelectedLeadId(leads[0]?._id || "");
        setShowAssignModal(true);
    };

    const handleAssignLeadSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser || !selectedLeadId) {
            toast.error("Please select a lead to assign");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.patch(`/leads/${selectedLeadId}/assign`, {
                assignedTo: selectedUser._id,
            });
            toast.success(`Lead successfully assigned to ${selectedUser.firstName}! 🎯`);
            setShowAssignModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to assign lead");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExportCSV = () => {
        if (users.length === 0) {
            toast.error("No user records to export");
            return;
        }

        const headers = ["First Name", "Last Name", "Email", "Role", "Joined Date"];
        const rows = users.map((u) => [
            `"${u.firstName || ""}"`,
            `"${u.lastName || ""}"`,
            `"${u.email || ""}"`,
            `"${u.role || "researcher"}"`,
            `"${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}"`,
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LeadFlow_Team_Users_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`Exported ${users.length} user records to CSV! 📥`);
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case "admin":
                return "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200";
            case "manager":
                return "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200";
            default:
                return "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200";
        }
    };

    const filteredUsers = users.filter((u) => {
        const full = `${u.firstName || ""} ${u.lastName || ""} ${u.email || ""}`.toLowerCase();
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        const matchesSearch = !searchQuery || full.includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Admin Access Only</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        User Roles & Lead Assignment
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Manage registered team members, inspect assigned roles, and assign CRM pipeline leads to staff.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={handleExportCSV}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                        <Download className="w-4 h-4 text-emerald-600" />
                        <span>Export Team CSV</span>
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Total Registered Users", value: users.length, color: "text-rose-600 dark:text-rose-400" },
                    { title: "Admins", value: users.filter(u => u.role === "admin").length, color: "text-rose-600 dark:text-rose-400" },
                    { title: "Managers", value: users.filter(u => u.role === "manager").length, color: "text-indigo-600 dark:text-indigo-400" },
                    { title: "Researchers", value: users.filter(u => u.role === "researcher").length, color: "text-purple-600 dark:text-purple-400" },
                ].map((st, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{st.title}</span>
                        <div className={`text-2xl font-extrabold ${st.color}`}>{st.value}</div>
                    </div>
                ))}
            </div>

            {/* Search & Role Filters */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search user name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-500 shrink-0">Filter Role:</span>
                    {["all", "admin", "manager", "researcher"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer capitalize ${
                                roleFilter === r
                                    ? "bg-rose-600 text-white shadow-sm"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            {r === "all" ? "All Roles" : r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Table View */}
            {loading ? (
                <LoadingScreen message="Loading Team Directory & Roles..." />
            ) : (
                <div className="space-y-4">
                    
                    {/* Desktop Table */}
                    <div className="hidden lg:block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-bold">
                                        <th className="py-3.5 px-4">User Name</th>
                                        <th className="py-3.5 px-4">Email</th>
                                        <th className="py-3.5 px-4">Role Permission</th>
                                        <th className="py-3.5 px-4">Joined Date</th>
                                        <th className="py-3.5 px-4 text-right">Lead Assignment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredUsers.map((u) => {
                                        const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Team Member";
                                        return (
                                            <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                                
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                                                            {fullName[0]}
                                                        </div>
                                                        <span className="font-bold text-slate-900 dark:text-white">{fullName}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                        <span>{u.email}</span>
                                                    </div>
                                                </td>

                                                <td className="py-3.5 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase border ${getRoleBadge(u.role)}`}>
                                                        {u.role || "researcher"}
                                                    </span>
                                                </td>

                                                <td className="py-3.5 px-4 text-slate-500 font-semibold">
                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active"}
                                                </td>

                                                <td className="py-3.5 px-4 text-right">
                                                    <button
                                                        onClick={() => handleOpenAssignModal(u)}
                                                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                                                    >
                                                        <UserCheck className="w-3.5 h-3.5" />
                                                        <span>Assign Lead</span>
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
                        {filteredUsers.map((u) => {
                            const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Team Member";
                            return (
                                <div key={u._id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fullName}</h4>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getRoleBadge(u.role)}`}>
                                            {u.role || "researcher"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">{u.email}</p>
                                    <div className="flex justify-end pt-2 border-t">
                                        <button onClick={() => handleOpenAssignModal(u)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold">Assign Lead</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            )}

            {/* ASSIGN LEAD MODAL */}
            {showAssignModal && selectedUser && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Assign Lead to {selectedUser.firstName}</h3>
                            <button onClick={() => setShowAssignModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>

                        <form onSubmit={handleAssignLeadSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Select Lead from Pipeline *</label>
                                <select
                                    required
                                    value={selectedLeadId}
                                    onChange={(e) => setSelectedLeadId(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs cursor-pointer"
                                >
                                    {leads.map((l) => (
                                        <option key={l._id} value={l._id}>
                                            {l.companyName || l.company?.companyName || "Lead"} - ({l.contact?.firstName || "Contact"})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-2 flex justify-end gap-3 border-t">
                                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 rounded-xl border text-xs">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold">
                                    {isSubmitting ? "Assigning..." : "Confirm Assignment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
