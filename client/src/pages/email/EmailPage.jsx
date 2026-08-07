import React, { useState } from "react";
import api from "../../utils/api";
import {
    Mail,
    Send,
    CheckCircle2,
    Clock,
    FileText,
    Sparkles,
    AlertCircle,
    X,
    Inbox,
    ShieldCheck,
    Download,
    Eye,
} from "lucide-react";
import toast from "react-hot-toast";

export default function EmailPage() {
    const [activeTab, setActiveTab] = useState("composer");

    // Cold Email Form
    const [emailForm, setEmailForm] = useState({
        to: "",
        subject: "",
        html: "",
    });
    const [sendingCustom, setSendingCustom] = useState(false);

    // Test Email Form
    const [testEmailAddress, setTestEmailAddress] = useState("");
    const [sendingTest, setSendingTest] = useState(false);

    // Outbound Log History State
    const [emailLogs, setEmailLogs] = useState([
        {
            id: "eml-101",
            to: "alex.morton@savills.co.uk",
            subject: "Automated Lead Generation for Savills Real Estate",
            status: "Delivered",
            sentAt: "2026-08-07T14:30:00Z",
            body: "Hi Alex, We noticed Savills is expanding rapidly. We help real estate businesses automate prospecting...",
        },
        {
            id: "eml-102",
            to: "sarah.j@cbre.com",
            subject: "Following Up - LeadFlow CRM Integration",
            status: "Opened",
            sentAt: "2026-08-07T11:15:00Z",
            body: "Hi Sarah, Just checking if you had a chance to review my previous message regarding automated prospecting...",
        },
    ]);

    const [selectedEmailLog, setSelectedEmailLog] = useState(null);

    const handleSendCustomEmail = async (e) => {
        e.preventDefault();
        if (!emailForm.to || !emailForm.subject || !emailForm.html) {
            toast.error("Please fill in recipient email, subject, and message body");
            return;
        }

        setSendingCustom(true);
        try {
            await api.post("/emails/send", emailForm);
            toast.success(`Cold email successfully sent to ${emailForm.to}! ✉️`);

            // Append to outbound log
            const newLog = {
                id: `eml-${Date.now()}`,
                to: emailForm.to,
                subject: emailForm.subject,
                status: "Sent",
                sentAt: new Date().toISOString(),
                body: emailForm.html,
            };
            setEmailLogs((prev) => [newLog, ...prev]);

            // Reset form
            setEmailForm({ to: "", subject: "", html: "" });
        } catch (err) {
            console.error("Send custom email error:", err);
            toast.error(err.response?.data?.message || "Failed to send email. Check SMTP server settings.");
        } finally {
            setSendingCustom(false);
        }
    };

    const handleSendTestEmail = async (e) => {
        e.preventDefault();
        if (!testEmailAddress) {
            toast.error("Please enter a target test email address");
            return;
        }

        setSendingTest(true);
        try {
            await api.post("/emails/test", { email: testEmailAddress });
            toast.success(`Test email sent successfully to ${testEmailAddress}! 🎉`);
            setTestEmailAddress("");
        } catch (err) {
            console.error("Send test email error:", err);
            toast.error(err.response?.data?.message || "Test email delivery failed");
        } finally {
            setSendingTest(false);
        }
    };

    const loadTemplate = (tmpl) => {
        if (tmpl === "intro") {
            setEmailForm({
                to: emailForm.to || "prospect@company.com",
                subject: "Helping {{companyName}} Automate Lead Pipeline Generation",
                html: `Hi {{firstName}},\n\nI hope you're doing well.\n\nI noticed {{companyName}} is growing rapidly. We help real estate and tech companies automate prospecting and generate qualified lead appointments.\n\nWould you be open for a short 15-minute call next week?\n\nBest regards,\nGuddu Kumar\nLeadFlow CRM Team`,
            });
            toast.success("Loaded Cold Email Introduction template! 📝");
        } else if (tmpl === "followup") {
            setEmailForm({
                to: emailForm.to || "prospect@company.com",
                subject: "Following up regarding lead generation for {{companyName}}",
                html: `Hi {{firstName}},\n\nJust checking whether you had a chance to review my previous message regarding LeadFlow CRM.\n\nI'd love to share a quick 5-minute video demo of how we automate prospecting.\n\nLet me know if you have time for a quick chat.`,
            });
            toast.success("Loaded Follow Up email template! 📝");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Dispatcher & SMTP Engine</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Email Outreach & System Mailer
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Dispatch cold emails directly to decision makers, verify SMTP configuration, and inspect dispatch logs.
                    </p>
                </div>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                {[
                    { id: "composer", label: "Cold Email Composer", icon: Send },
                    { id: "logs", label: "Outbound Dispatch Logs", icon: Inbox },
                    { id: "test", label: "Test SMTP Connection", icon: ShieldCheck },
                ].map((tab) => {
                    const IconComp = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                                isActive
                                    ? "border-blue-600 text-blue-600 dark:text-blue-400"
                                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <IconComp className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: COLD EMAIL COMPOSER */}
            {activeTab === "composer" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left 2 Cols: Form */}
                    <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Send className="w-4 h-4 text-blue-600" />
                                <span>Compose & Send Email</span>
                            </h3>
                        </div>

                        <form onSubmit={handleSendCustomEmail} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">To Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. decisionmaker@company.com"
                                    value={emailForm.to}
                                    onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject Line *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Automated Prospecting Partnership"
                                    value={emailForm.subject}
                                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Body (Plain Text or HTML) *</label>
                                <textarea
                                    rows={8}
                                    required
                                    placeholder="Hi {{firstName}}, I noticed {{companyName}}..."
                                    value={emailForm.html}
                                    onChange={(e) => setEmailForm({ ...emailForm, html: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={sendingCustom}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/25 cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{sendingCustom ? "Dispatching Email..." : "Send Email Now"}</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Col: Quick Templates */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 h-fit">
                        <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                <span>Quick Template Loader</span>
                            </h3>
                            <p className="text-xs text-slate-400">Click to insert pre-made email copy into composer.</p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => loadTemplate("intro")}
                                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 bg-slate-50 dark:bg-slate-800/40 text-left space-y-1 transition-all cursor-pointer group"
                            >
                                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">Cold Outreach Introduction</h4>
                                <p className="text-[11px] text-slate-400 line-clamp-2">
                                    {"Hi {{firstName}}, We noticed {{companyName}} is growing rapidly..."}
                                </p>
                            </button>

                            <button
                                onClick={() => loadTemplate("followup")}
                                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 bg-slate-50 dark:bg-slate-800/40 text-left space-y-1 transition-all cursor-pointer group"
                            >
                                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">Sequence Follow Up V1</h4>
                                <p className="text-[11px] text-slate-400 line-clamp-2">
                                    {"Hi {{firstName}}, Just checking whether you had a chance to review..."}
                                </p>
                            </button>
                        </div>

                    </div>

                </div>
            )}

            {/* TAB 2: OUTBOUND DISPATCH LOGS */}
            {activeTab === "logs" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Inbox className="w-4 h-4 text-emerald-600" />
                            <span>Outbound Email Dispatch Log</span>
                        </h3>
                        <p className="text-xs text-slate-400">History of outbound emails dispatched via LeadFlow SMTP engine.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase">
                                    <th className="p-3">Recipient</th>
                                    <th className="p-3">Subject Line</th>
                                    <th className="p-3">Delivery Status</th>
                                    <th className="p-3">Sent Timestamp</th>
                                    <th className="p-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {emailLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                        <td className="p-3 font-bold text-slate-900 dark:text-white">{log.to}</td>
                                        <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{log.subject}</td>
                                        <td className="p-3">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-slate-400">{new Date(log.sentAt).toLocaleString()}</td>
                                        <td className="p-3 text-right">
                                            <button onClick={() => setSelectedEmailLog(log)} className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold text-blue-600 cursor-pointer">
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB 3: TEST SMTP CONNECTION */}
            {activeTab === "test" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md space-y-4">
                    <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>SMTP Mail Server Connection Test</span>
                        </h3>
                        <p className="text-xs text-slate-400">Send a system verification test email via configured Nodemailer credentials.</p>
                    </div>

                    <form onSubmit={handleSendTestEmail} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Target Test Email *</label>
                            <input
                                type="email"
                                required
                                placeholder="yourname@gmail.com"
                                value={testEmailAddress}
                                onChange={(e) => setTestEmailAddress(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={sendingTest}
                            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow cursor-pointer"
                        >
                            {sendingTest ? "Sending Test Email..." : "Run Test Email Dispatch"}
                        </button>
                    </form>
                </div>
            )}

            {/* EMAIL LOG PREVIEW MODAL */}
            {selectedEmailLog && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Email Log Details</h3>
                            <button onClick={() => setSelectedEmailLog(null)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-2 text-xs">
                            <p><span className="font-bold text-slate-400">To:</span> {selectedEmailLog.to}</p>
                            <p><span className="font-bold text-slate-400">Subject:</span> {selectedEmailLog.subject}</p>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 font-mono whitespace-pre-wrap mt-2">
                                {selectedEmailLog.body}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
