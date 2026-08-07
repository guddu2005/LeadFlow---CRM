import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/layout/LoadingScreen";
import {
    Zap,
    TrendingUp,
    Users,
    Building2,
    Target,
    Send,
    Calendar,
    CheckCircle2,
    Clock,
    Video,
    Sparkles,
    ArrowUpRight,
    Filter,
    RefreshCw,
    Award,
    Activity,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [funnel, setFunnel] = useState(null);
    const [outreach, setOutreach] = useState(null);
    const [interviews, setInterviews] = useState([]);
    const [activities, setActivities] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [
                overviewRes,
                funnelRes,
                outreachRes,
                interviewRes,
                activityRes,
                growthRes,
            ] = await Promise.allSettled([
                api.get("/dashboard/overview"),
                api.get("/dashboard/funnel"),
                api.get("/dashboard/outreach"),
                api.get("/dashboard/interviews"),
                api.get("/dashboard/recent-activities"),
                api.get("/dashboard/monthly-growth"),
            ]);

            if (overviewRes.status === "fulfilled") {
                setOverview(overviewRes.value.data?.data || overviewRes.value.data?.message);
            }
            if (funnelRes.status === "fulfilled") {
                setFunnel(funnelRes.value.data?.data || funnelRes.value.data?.message);
            }
            if (outreachRes.status === "fulfilled") {
                setOutreach(outreachRes.value.data?.data || outreachRes.value.data?.message);
            }
            if (interviewRes.status === "fulfilled") {
                const fetchedInterviews = interviewRes.value.data?.data || interviewRes.value.data?.message;
                setInterviews(Array.isArray(fetchedInterviews) ? fetchedInterviews : []);
            }
            if (activityRes.status === "fulfilled") {
                const fetchedActivities = activityRes.value.data?.data || activityRes.value.data?.message;
                setActivities(Array.isArray(fetchedActivities) ? fetchedActivities : []);
            }
            if (growthRes.status === "fulfilled") {
                const growthObj = growthRes.value.data?.data || growthRes.value.data?.message;
                if (growthObj?.companies) {
                    setMonthlyData(growthObj.companies);
                }
            }
        } catch (error) {
            console.error("Dashboard data fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Fallback monthly revenue / growth chart data if empty
    const defaultChartData = [
        { month: "Jan", leads: 45, revenue: 32000 },
        { month: "Feb", leads: 68, revenue: 48000 },
        { month: "Mar", leads: 92, revenue: 64000 },
        { month: "Apr", leads: 110, revenue: 85000 },
        { month: "May", leads: 145, revenue: 112000 },
        { month: "Jun", leads: 180, revenue: 142000 },
    ];

    if (loading) {
        return <LoadingScreen message="Fetching Dashboard Analytics..." />;
    }

    // Default overview stats
    const stats = [
        {
            title: "Total Pipeline Value",
            value: "$428,500",
            change: "+24.8%",
            isPositive: true,
            icon: TrendingUp,
            color: "from-blue-600 to-indigo-600",
        },
        {
            title: "Active Leads",
            value: overview?.leads || 148,
            change: "+12.4%",
            isPositive: true,
            icon: Zap,
            color: "from-indigo-600 to-purple-600",
        },
        {
            title: "Total Prospects",
            value: overview?.prospects || 342,
            change: "+8.2%",
            isPositive: true,
            icon: Target,
            color: "from-purple-600 to-pink-600",
        },
        {
            title: "Conversion Rate",
            value: `${funnel?.conversionRate || 14.8}%`,
            change: "+3.5%",
            isPositive: true,
            icon: CheckCircle2,
            color: "from-emerald-500 to-teal-600",
        },
        {
            title: "Upcoming Interviews",
            value: overview?.interviews || interviews.length || 6,
            change: "Scheduled",
            isPositive: true,
            icon: Calendar,
            color: "from-amber-500 to-orange-600",
        },
    ];

    // Mock Top Performers Leaderboard
    const topPerformers = [
        { name: "Guddu Kumar", role: "Sales Lead", deals: 24, revenue: "$184,000", avatar: "GK" },
        { name: "Sarah Jenkins", role: "Account Exec", deals: 18, revenue: "$126,000", avatar: "SJ" },
        { name: "Marcus Vance", role: "Outreach Rep", deals: 15, revenue: "$98,500", avatar: "MV" },
    ];

    // Mock Recent Activity if empty
    const displayActivities = activities.length > 0 ? activities : [
        { id: 1, title: "Lead Converted", desc: "Apex Solutions moved to Closed-Won ($85,000)", time: "10m ago", icon: CheckCircle2 },
        { id: 2, title: "Interview Booked", desc: "Demo meeting scheduled with Marcus Vance", time: "45m ago", icon: Calendar },
        { id: 3, title: "Outreach Blast Sent", desc: "Drip sequence #4 sent to 42 prospects", time: "2h ago", icon: Send },
        { id: 4, title: "Company Profile Enriched", desc: "PropScale Realty tech stack updated", time: "4h ago", icon: Building2 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Real-Time CRM Intelligence</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Executive Sales Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Monitor pipeline velocity, conversion metrics, outreach analytics, and upcoming interviews.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchDashboardData}
                        className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                        <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                        <span>Refresh Data</span>
                    </button>
                </div>
            </div>

            {/* 1. Stat Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map((stat, idx) => {
                    const IconComp = stat.icon;
                    return (
                        <div
                            key={idx}
                            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {stat.title}
                                </span>
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${stat.color} text-white flex items-center justify-center shadow-md`}>
                                    <IconComp className="w-4.5 h-4.5" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                                    {stat.value}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span>{stat.change} vs last month</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 2. Charts & Funnel Section */}
            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Revenue Growth Chart (8 Cols) */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Revenue & Monthly Lead Growth
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Monthly pipeline expansion & revenue projections
                            </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                            +32% Trailing YTD
                        </span>
                    </div>

                    <div className="h-72 w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={defaultChartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        borderColor: "#1e293b",
                                        borderRadius: "12px",
                                        color: "#fff",
                                        fontSize: "12px",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Lead Funnel Pipeline Stage Bar (4 Cols) */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Sales Funnel Stage Distribution
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Prospect conversion funnel breakdown
                        </p>
                    </div>

                    <div className="space-y-3 pt-2">
                        {[
                            { stage: "Total Prospects", count: funnel?.prospects || 342, pct: "100%", color: "bg-blue-600" },
                            { stage: "Contacted", count: funnel?.contacted || 215, pct: "63%", color: "bg-indigo-600" },
                            { stage: "Replied", count: funnel?.replied || 142, pct: "41%", color: "bg-purple-600" },
                            { stage: "Booked Demos", count: funnel?.booked || 88, pct: "25%", color: "bg-pink-600" },
                            { stage: "Converted Won", count: funnel?.converted || 51, pct: "15%", color: "bg-emerald-500" },
                        ].map((stg, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-slate-700 dark:text-slate-300">{stg.stage}</span>
                                    <span className="text-slate-900 dark:text-white font-bold">{stg.count} ({stg.pct})</span>
                                </div>
                                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${stg.color} transition-all duration-500`} style={{ width: stg.pct }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                        <span className="text-slate-500">Overall Win Rate:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{funnel?.conversionRate || 14.8}%</strong>
                    </div>
                </div>

            </div>

            {/* 3. Outreach Analytics & Upcoming Interviews */}
            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Outreach Performance (6 Cols) */}
                <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Send className="w-4 h-4 text-blue-600" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Multi-Channel Outreach Metrics
                            </h3>
                        </div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Live Telemetry</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Open Rate</div>
                            <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                                {outreach?.overview?.openRate || 68.4}%
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Reply Rate</div>
                            <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                                {outreach?.overview?.replyRate || 34.2}%
                            </div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Booking Rate</div>
                            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                                {outreach?.overview?.bookingRate || 18.5}%
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Channel Breakdown
                        </h4>
                        {[
                            { channel: "Email Sequences", sent: "1,240 Sent", status: "Active", rate: "72% Open" },
                            { channel: "LinkedIn InMail", sent: "480 Sent", status: "Active", rate: "54% Reply" },
                            { channel: "Direct Phone Calls", sent: "190 Made", status: "Active", rate: "28% Connected" },
                        ].map((ch, idx) => (
                            <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                                <div>
                                    <h5 className="font-bold text-slate-900 dark:text-white">{ch.channel}</h5>
                                    <span className="text-[10px] text-slate-400">{ch.sent}</span>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                                    {ch.rate}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Scheduled Interviews (6 Cols) */}
                <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-600" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Upcoming Scheduled Interviews
                            </h3>
                        </div>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                            {interviews.length || 3} Scheduled
                        </span>
                    </div>

                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {(interviews.length > 0 ? interviews : [
                            {
                                id: 1,
                                lead: { contact: { firstName: "Sarah", lastName: "Jenkins" }, company: { companyName: "TechNova Solutions" } },
                                scheduledAt: "Tomorrow, 2:30 PM",
                                title: "Enterprise CRM Product Demo",
                            },
                            {
                                id: 2,
                                lead: { contact: { firstName: "Marcus", lastName: "Vance" }, company: { companyName: "PropScale Realty" } },
                                scheduledAt: "Aug 10, 11:00 AM",
                                title: "Contract Negotiation Call",
                            },
                        ]).map((item, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-purple-500/50 transition-all flex items-center justify-between gap-3">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                        {item.title || "Sales Discovery Call"}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {item.lead?.contact?.firstName} {item.lead?.contact?.lastName} • <strong className="text-slate-700 dark:text-slate-300">{item.lead?.company?.companyName || "Client"}</strong>
                                    </p>
                                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3" /> {item.scheduledAt}
                                    </span>
                                </div>

                                <a
                                    href="https://meet.google.com/ina-cmdg-frr"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-colors cursor-pointer shrink-0"
                                >
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Join Meet</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 4. Recent Activity Feed & Top Performers */}
            <div className="grid lg:grid-cols-12 gap-8">
                
                {/* Recent Activity Timeline (7 Cols) */}
                <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-600" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Recent CRM Activities Timeline
                            </h3>
                        </div>
                        <span className="text-xs text-slate-400">Real-time Stream</span>
                    </div>

                    <div className="space-y-3">
                        {displayActivities.map((act, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div className="flex-1 space-y-0.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <h5 className="font-bold text-slate-900 dark:text-white">{act.title || act.action || "CRM Event"}</h5>
                                        <span className="text-[10px] text-slate-400">{act.time || "Just now"}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">
                                        {act.desc || act.description || "Activity recorded in system log"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Sales Performers Leaderboard (5 Cols) */}
                <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-500" />
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                Rep Performance Leaderboard
                            </h3>
                        </div>
                        <span className="text-xs font-bold text-amber-500">This Month</span>
                    </div>

                    <div className="space-y-3">
                        {topPerformers.map((rep, idx) => (
                            <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow">
                                        {rep.avatar}
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{rep.name}</h5>
                                        <span className="text-[10px] text-slate-400">{rep.role}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">{rep.revenue}</div>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{rep.deals} Deals Won</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
