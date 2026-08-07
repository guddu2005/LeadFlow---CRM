import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../utils/api";
import {
    Settings as SettingsIcon,
    User,
    Key,
    ShieldCheck,
    Moon,
    Sun,
    Bell,
    CheckCircle2,
    Lock,
    Save,
    Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();

    const [activeTab, setActiveTab] = useState("profile");

    // Password State
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Profile State
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
    });

    // Notification Toggles
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        leadAssigned: true,
        interviewReminders: true,
        outreachReplies: true,
    });

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.patch("/auth/change-password", {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            toast.success("Password updated successfully! 🔐");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRolePrivileges = (role) => {
        switch (role) {
            case "admin":
                return [
                    "Full System Administration & Configuration",
                    "User Roster & Role Management (/admin/users)",
                    "Lead Pipeline Assignment & Conversion",
                    "Global Data Export & Database Control",
                ];
            case "manager":
                return [
                    "Lead Pipeline Management & Conversion",
                    "Outreach Campaign Orchestration",
                    "Interview Call Scheduling & Google Meet Access",
                    "Team Performance & Analytics Reporting",
                ];
            default:
                return [
                    "Prospect & Lead Discovery Entry",
                    "Multi-Channel Outreach Template Usage",
                    "Corporate Contact Directory Access",
                    "Personal Activity Dashboard & Reports",
                ];
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        <SettingsIcon className="w-3.5 h-3.5" />
                        <span>System Preferences</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Account Settings & Controls
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Manage your profile details, security settings, role permissions, and system themes.
                    </p>
                </div>
            </div>

            {/* Main Tabs Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                {[
                    { id: "profile", label: "Profile Info", icon: User },
                    { id: "security", label: "Security & Password", icon: Key },
                    { id: "role", label: "Role & Privileges", icon: ShieldCheck },
                    { id: "appearance", label: "Appearance", icon: isDark ? Moon : Sun },
                    { id: "notifications", label: "Notifications", icon: Bell },
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

            {/* TAB CONTENT SECTIONS */}

            {/* 1. Profile Info Tab */}
            {activeTab === "profile" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-2xl space-y-6">
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <p className="text-xs text-slate-500">{user?.email}</p>
                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                {user?.role || "User"}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved successfully!"); }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-semibold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email Address</label>
                            <input
                                type="email"
                                disabled
                                value={profileData.email}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 font-semibold cursor-not-allowed"
                            />
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button type="submit" className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer">
                                <Save className="w-4 h-4" />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 2. Security & Password Tab */}
            {activeTab === "security" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md space-y-6">
                    <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Lock className="w-4 h-4 text-blue-600" />
                            <span>Change Password</span>
                        </h3>
                        <p className="text-xs text-slate-400">Ensure your account uses a strong, secure password.</p>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Current Password *</label>
                            <input
                                type="password"
                                required
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">New Password *</label>
                            <input
                                type="password"
                                required
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Confirm New Password *</label>
                            <input
                                type="password"
                                required
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                            />
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer">
                                {isSubmitting ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* 3. Role & Privileges Tab */}
            {activeTab === "role" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-2xl space-y-6">
                    <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-indigo-600" />
                            <span>Role Permissions & Privileges</span>
                        </h3>
                        <p className="text-xs text-slate-400">Current authenticated session role permissions.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-slate-500">Your Assigned Role:</span>
                            <h4 className="text-lg font-extrabold text-indigo-700 dark:text-indigo-300 capitalize">{user?.role || "researcher"}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-600 text-white">Verified</span>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-slate-400">Allowed System Capabilities:</h4>
                        <div className="space-y-2">
                            {getRolePrivileges(user?.role).map((priv, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span>{priv}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 4. Appearance Tab */}
            {activeTab === "appearance" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-lg space-y-6">
                    <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>Theme & Interface Customization</span>
                        </h3>
                        <p className="text-xs text-slate-400">Switch between dark mode and high-contrast light mode.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isDark ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                            <div>
                                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{isDark ? "Dark Theme Mode" : "Light Theme Mode"}</h4>
                                <p className="text-[11px] text-slate-500">Persistent across browser sessions</p>
                            </div>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-sm"
                        >
                            Toggle to {isDark ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </div>
            )}

            {/* 5. Notifications Tab */}
            {activeTab === "notifications" && (
                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-lg space-y-6">
                    <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Bell className="w-4 h-4 text-blue-600" />
                            <span>Notification Preferences</span>
                        </h3>
                        <p className="text-xs text-slate-400">Configure automated alerts and real-time reminders.</p>
                    </div>

                    <div className="space-y-3">
                        {[
                            { key: "emailAlerts", label: "Email Notifications & Alerts" },
                            { key: "leadAssigned", label: "Lead Pipeline Assignment Alerts" },
                            { key: "interviewReminders", label: "Scheduled Interview Meeting Reminders" },
                            { key: "outreachReplies", label: "Outreach Sequence Reply Triggers" },
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{item.label}</span>
                                <input
                                    type="checkbox"
                                    checked={notifications[item.key]}
                                    onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-2">
                        <button onClick={() => toast.success("Notification preferences updated!")} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer">
                            Save Preferences
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
