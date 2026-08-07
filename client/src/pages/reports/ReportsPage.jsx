import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/layout/LoadingScreen";
import {
    BarChart3,
    TrendingUp,
    Download,
    FileSpreadsheet,
    Building2,
    Users,
    Send,
    Target,
    Briefcase,
    Calendar,
    CheckCircle2,
    PieChart as PieIcon,
    RefreshCw,
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import toast from "react-hot-toast";

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const [overviewRes, funnelRes, outreachRes] = await Promise.allSettled([
                api.get("/dashboard/overview"),
                api.get("/dashboard/funnel"),
                api.get("/dashboard/outreach"),
            ]);

            setStats({
                overview: overviewRes.status === "fulfilled" ? overviewRes.value.data?.data : null,
                funnel: funnelRes.status === "fulfilled" ? funnelRes.value.data?.data : null,
                outreach: outreachRes.status === "fulfilled" ? outreachRes.value.data?.data : null,
            });
        } catch (err) {
            console.error("Report fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    // Generalized Export Helper
    const triggerExport = async (endpoint, filename, headers, mapRowFn) => {
        try {
            const res = await api.get(endpoint);
            const dataObj = res.data?.data || res.data?.message;
            let list = [];

            if (Array.isArray(dataObj)) list = dataObj;
            else if (dataObj?.prospects) list = dataObj.prospects;
            else if (dataObj?.leads) list = dataObj.leads;
            else if (dataObj?.companies) list = dataObj.companies;
            else if (dataObj?.contacts) list = dataObj.contacts;
            else if (dataObj?.outreachs) list = dataObj.outreachs;

            if (list.length === 0) {
                toast.error(`No records found for ${filename}`);
                return;
            }

            const rows = list.map(mapRowFn);
            const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `LeadFlow_${filename}_${new Date().toISOString().split("T")[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`Exported ${list.length} records to ${filename}.csv! 📥`);
        } catch (err) {
            toast.error(`Export failed for ${filename}`);
        }
    };

    // Export Trigger Functions
    const exportProspects = () =>
        triggerExport("/prospects", "Prospects", ["Company Name", "Contact Name", "Email", "Status"], (p) => [
            `"${p.companyName || ""}"`, `"${p.contactName || ""}"`, `"${p.email || ""}"`, `"${p.status || ""}"`
        ]);

    const exportLeads = () =>
        triggerExport("/leads", "Leads", ["Company", "Contact", "Status", "Priority"], (l) => [
            `"${l.companyName || l.company?.companyName || ""}"`, `"${l.contact?.firstName || ""}"`, `"${l.status || ""}"`, `"${l.priority || ""}"`
        ]);

    const exportCompanies = () =>
        triggerExport("/companies", "Companies", ["Company Name", "Website", "Country", "Employee Count"], (c) => [
            `"${c.companyName || ""}"`, `"${c.website || ""}"`, `"${c.country || ""}"`, `"${c.employeeCount || 0}"`
        ]);

    const exportContacts = () =>
        triggerExport("/contacts", "Contacts", ["First Name", "Last Name", "Email", "Phone"], (c) => [
            `"${c.firstName || ""}"`, `"${c.lastName || ""}"`, `"${c.email || ""}"`, `"${c.phone || ""}"`
        ]);

    const exportOutreach = () =>
        triggerExport("/outreach", "Outreach_Telemetry", ["Channel", "Sequence Type", "Status", "Subject"], (o) => [
            `"${o.channel || ""}"`, `"${o.sequenceType || ""}"`, `"${o.status || ""}"`, `"${o.subject || ""}"`
        ]);

    const funnelData = [
        { stage: "Not Contacted", value: 120 },
        { stage: "Contacted", value: 85 },
        { stage: "Replied", value: 45 },
        { stage: "Booked", value: 28 },
        { stage: "Won", value: 18 },
    ];

    const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#10b981"];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        <BarChart3 className="w-3.5 h-3.5" />
                        <span>Executive Intelligence</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Reports & Global Data Export Hub
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Visualize end-to-end sales performance, channel conversion rates, and export CRM telemetry datasets.
                    </p>
                </div>
            </div>

            {/* Performance Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: "Pipeline Value", value: "£1,450,000", color: "text-emerald-600 dark:text-emerald-400" },
                    { title: "Win Conversion Rate", value: "32.4%", color: "text-blue-600 dark:text-blue-400" },
                    { title: "Outreach Open Rate", value: "68.2%", color: "text-purple-600 dark:text-purple-400" },
                    { title: "Meeting Booking Rate", value: "18.5%", color: "text-indigo-600 dark:text-indigo-400" },
                ].map((st, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{st.title}</span>
                        <div className={`text-2xl sm:text-3xl font-extrabold ${st.color}`}>{st.value}</div>
                    </div>
                ))}
            </div>

            {/* Visual Analytics Grid */}
            {loading ? (
                <LoadingScreen message="Loading Executive Analytics Reports..." />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Pipeline Stage Funnel Chart */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Pipeline Conversion Funnel</h3>
                                <p className="text-xs text-slate-400">Distribution of leads across conversion lifecycle stages.</p>
                            </div>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                                    <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", color: "#fff", border: "none" }} />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {funnelData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Global Data Export Hub Section */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                                <span>Global Data Export Controls</span>
                            </h3>
                            <p className="text-xs text-slate-400">Export structured CSV files for any LeadFlow CRM module.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                            {[
                                { name: "Export Prospects", desc: "Target discovery prospects dataset", fn: exportProspects, icon: Target, color: "text-blue-600" },
                                { name: "Export Leads", desc: "Active sales pipeline leads", fn: exportLeads, icon: Briefcase, color: "text-indigo-600" },
                                { name: "Export Companies", desc: "Verified company account profiles", fn: exportCompanies, icon: Building2, color: "text-purple-600" },
                                { name: "Export Contacts", desc: "Corporate decision maker directory", fn: exportContacts, icon: Users, color: "text-teal-600" },
                                { name: "Export Outreach", desc: "Multi-channel sequence telemetry", fn: exportOutreach, icon: Send, color: "text-emerald-600" },
                            ].map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={item.fn}
                                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 text-left space-y-2 transition-all cursor-pointer group shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                        <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.name}</h4>
                                        <p className="text-[10px] text-slate-400 line-clamp-1">{item.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            )}

            {/* 4-WEEK CAMPAIGN TARGET MILESTONES (PDF Section 7) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        <span>4-Week Campaign Targets Tracker (UK/EU Brief Section 7)</span>
                    </h3>
                    <p className="text-xs text-slate-400">Weekly milestones progress: 300 Prospects, 250 Contacts Made, and 20 Research Interviews Booked.</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-bold border-b">
                                <th className="p-3">Campaign Week</th>
                                <th className="p-3">Prospects Added Target</th>
                                <th className="p-3">Contacts Made Target</th>
                                <th className="p-3">Interviews Booked Target</th>
                                <th className="p-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {[
                                { week: "Week 1", prospects: 100, contacts: 30, interviews: 2, status: "Completed" },
                                { week: "Week 2", prospects: 100, contacts: 80, interviews: 6, status: "Completed" },
                                { week: "Week 3", prospects: 60, contacts: 80, interviews: 7, status: "Active" },
                                { week: "Week 4", prospects: 40, contacts: 60, interviews: 5, status: "Pending" },
                            ].map((w, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                    <td className="p-3 font-bold text-slate-900 dark:text-white">{w.week}</td>
                                    <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">{w.prospects} Prospects</td>
                                    <td className="p-3 font-semibold text-indigo-600 dark:text-indigo-400">{w.contacts} Contacts</td>
                                    <td className="p-3 font-bold text-purple-600 dark:text-purple-400">{w.interviews} Interviews</td>
                                    <td className="p-3 text-right">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                            w.status === "Completed"
                                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                                                : w.status === "Active"
                                                ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                        }`}>
                                            {w.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-slate-50 dark:bg-slate-800/80 font-extrabold text-slate-900 dark:text-white">
                                <td className="p-3">TOTAL CAMPAIGN GOAL</td>
                                <td className="p-3 text-blue-600">300 PROSPECTS</td>
                                <td className="p-3 text-indigo-600">250 CONTACTS</td>
                                <td className="p-3 text-purple-600">20 INTERVIEWS</td>
                                <td className="p-3 text-right text-emerald-600">🎯 100% TARGETED</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
}
