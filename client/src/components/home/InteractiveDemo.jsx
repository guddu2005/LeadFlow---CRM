import React, { useState } from "react";
import { Zap, Search, Building, Mail, Sparkles } from "lucide-react";

export default function InteractiveDemo() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeLeadId, setActiveLeadId] = useState(1);
    const [isSimulatingAI, setIsSimulatingAI] = useState(false);

    const [leads, setLeads] = useState([
        {
            id: 1,
            name: "Sarah Jenkins",
            company: "TechNova Solutions",
            email: "sarah@technova.io",
            phone: "+1 (555) 234-5678",
            stage: "In Negotiation",
            value: "$64,000",
            score: 92,
            intent: "High",
            category: "Enterprise",
            lastActivity: "Viewed proposal 10m ago",
        },
        {
            id: 2,
            name: "Marcus Vance",
            company: "PropScale Realty",
            email: "marcus@propscale.com",
            phone: "+1 (555) 987-6543",
            stage: "Proposal Sent",
            value: "$38,500",
            score: 85,
            intent: "Medium",
            category: "Real Estate",
            lastActivity: "Requested pricing deck 2h ago",
        },
        {
            id: 3,
            name: "Elena Rostova",
            company: "OmniHealth Global",
            email: "elena@omnihealth.org",
            phone: "+1 (555) 456-7890",
            stage: "Qualified",
            value: "$112,000",
            score: 96,
            intent: "High",
            category: "Enterprise",
            lastActivity: "Completed demo call yesterday",
        },
        {
            id: 4,
            name: "David Kim",
            company: "Vanguard Capital",
            email: "dkim@vanguardcap.com",
            phone: "+1 (555) 321-7654",
            stage: "New Lead",
            value: "$28,000",
            score: 74,
            intent: "Low",
            category: "Finance",
            lastActivity: "Downloaded Whitepaper 3h ago",
        },
    ]);

    const activeLead = leads.find((l) => l.id === activeLeadId) || leads[0];

    const stages = ["New Lead", "Qualified", "Proposal Sent", "In Negotiation", "Closed Won"];

    const handleStageChange = (newStage) => {
        setLeads((prev) =>
            prev.map((l) => (l.id === activeLeadId ? { ...l, stage: newStage } : l))
        );
    };

    const handleRunAIScore = () => {
        setIsSimulatingAI(true);
        setTimeout(() => {
            const newScore = Math.floor(Math.random() * 15) + 85;
            setLeads((prev) =>
                prev.map((l) => (l.id === activeLeadId ? { ...l, score: newScore, intent: "High" } : l))
            );
            setIsSimulatingAI(false);
        }, 800);
    };

    const filteredLeads = leads.filter((l) => {
        const matchesCategory = selectedCategory === "all" || l.category === selectedCategory;
        const matchesSearch =
            l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.company.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="demo" className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Interactive Playground</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Experience LeadFlow in Action
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg">
                        Test our interactive pipeline below. Select a lead, update deal stages, or trigger the AI Lead Scorer in real-time.
                    </p>
                </div>

                {/* Interactive Simulator Shell */}
                <div className="mt-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
                    
                    {/* Top App Bar */}
                    <div className="p-4 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                        {/* Search & Filter */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search leads or companies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-1.5 text-xs">
                                {["all", "Enterprise", "Real Estate", "Finance"].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                                            selectedCategory === cat
                                                ? "bg-blue-600 text-white"
                                                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}
                                    >
                                        {cat === "all" ? "All Leads" : cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Top Indicator */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                            <span>LeadFlow Engine: Active</span>
                        </div>
                    </div>

                    {/* Main Workspace Layout */}
                    <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800 min-h-[460px]">
                        
                        {/* Left Lead List */}
                        <div className="lg:col-span-5 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Active Pipeline Leads ({filteredLeads.length})
                                </span>
                                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Click lead to inspect</span>
                            </div>

                            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                                {filteredLeads.map((lead) => {
                                    const isSelected = lead.id === activeLeadId;
                                    return (
                                        <div
                                            key={lead.id}
                                            onClick={() => setActiveLeadId(lead.id)}
                                            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                                                isSelected
                                                    ? "bg-white dark:bg-slate-800 border-blue-500 shadow-md ring-1 ring-blue-500/20"
                                                    : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                                                        {lead.name.split(" ").map(n => n[0]).join("")}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                                            {lead.name}
                                                        </h4>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {lead.company}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                                                        {lead.value}
                                                    </span>
                                                    <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                                        Score {lead.score}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                                                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                                                    {lead.stage}
                                                </span>
                                                <span className="text-slate-400 dark:text-slate-500">
                                                    {lead.lastActivity}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Lead Detail & Interactive Stage Switcher */}
                        <div className="lg:col-span-7 p-6 space-y-6 bg-white dark:bg-slate-900">
                            
                            {/* Lead Header Info */}
                            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {activeLead.name}
                                        </h3>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                            {activeLead.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                                        <Building className="w-4 h-4 text-slate-400" />
                                        <span>{activeLead.company}</span>
                                        <span>•</span>
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span>{activeLead.email}</span>
                                    </p>
                                </div>

                                <button
                                    onClick={handleRunAIScore}
                                    disabled={isSimulatingAI}
                                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
                                >
                                    <Sparkles className={`w-3.5 h-3.5 ${isSimulatingAI ? "animate-spin" : ""}`} />
                                    <span>{isSimulatingAI ? "Calculating..." : "Recalculate AI Score"}</span>
                                </button>
                            </div>

                            {/* Key Stats Cards */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Deal Value</div>
                                    <div className="text-lg font-extrabold text-slate-900 dark:text-white">{activeLead.value}</div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">AI Intent Score</div>
                                    <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <span>{activeLead.score}/100</span>
                                        <Zap className="w-4 h-4 fill-current" />
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Current Stage</div>
                                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400 truncate">{activeLead.stage}</div>
                                </div>
                            </div>

                            {/* Interactive Stage Transition Bar */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Move Pipeline Stage
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                    {stages.map((stg) => {
                                        const isActive = activeLead.stage === stg;
                                        return (
                                            <button
                                                key={stg}
                                                onClick={() => handleStageChange(stg)}
                                                className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer text-center ${
                                                    isActive
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25"
                                                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                }`}
                                            >
                                                {stg}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Automated Outreach Trigger Alert */}
                            <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 flex items-start gap-3">
                                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <div className="space-y-1 text-xs text-blue-950 dark:text-blue-200">
                                    <h5 className="font-bold">Automated LeadFlow Sequence Active</h5>
                                    <p className="leading-relaxed">
                                        Moving <strong>{activeLead.name}</strong> to <em>"{activeLead.stage}"</em> will trigger personalized email template #4 and alert the account rep on Slack.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
