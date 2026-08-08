import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import api from "../../utils/api";
import { Bell, CheckCircle2, Zap, MessageSquare, Calendar, Trash2, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function NotificationsDropdown() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [notifications, setNotifications] = useState([]);

    // Click Outside Listener to Automatically Close Dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    // Socket.IO Real-time Connection Setup
    useEffect(() => {
        const token = localStorage.getItem("leadflow_token");
        const socketUrl = import.meta.env.VITE_API_URL 
            ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")
            : "https://leadflow-crm-1-kn1w.onrender.com";
        const socket = io(socketUrl, {
            auth: { token },
            transports: ["polling", "websocket"],
            reconnectionAttempts: 5,
        });

        socket.on("connect", () => {
            console.log("Real-time Socket.IO connected 🟢:", socket.id);
        });

        socket.on("connect_error", (err) => {
            console.log("Socket.IO polling fallback info:", err.message);
        });

        socket.on("newNotification", (data) => {
            console.log("Real-time notification received via Socket.IO 🔔:", data);
            
            const notifId = data._id || `notif-${Date.now()}`;
            const notifTitle = data.title || "Real-time Notification";
            const notifMsg = data.message || "New CRM event triggered.";

            setNotifications((prev) => {
                const alreadyExists = prev.some((n) => n._id === notifId || (n.title === notifTitle && n.message === notifMsg));
                if (alreadyExists) return prev;

                // Show toast pop-up only when it's new
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-slate-900 text-white shadow-2xl rounded-2xl p-4 flex items-start gap-3 border border-slate-700`}>
                        <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
                            <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h4 className="font-bold text-xs text-white">{notifTitle}</h4>
                            <p className="text-xs text-slate-300">{notifMsg}</p>
                        </div>
                    </div>
                ));

                return [{
                    _id: notifId,
                    title: notifTitle,
                    message: notifMsg,
                    createdAt: data.createdAt || new Date().toISOString(),
                    isRead: false,
                    type: data.type || "lead",
                }, ...prev];
            });
        });

        // Initial fetch from backend
        fetchBackendNotifications();

        return () => {
            socket.disconnect();
        };
    }, []);

    const fetchBackendNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            const dataObj = res.data?.data || res.data?.message;
            if (Array.isArray(dataObj)) {
                setNotifications(dataObj);
            } else if (dataObj?.notifications) {
                setNotifications(dataObj.notifications);
            }
        } catch (err) {
            console.error("Fetch notifications notice:", err);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const handleMarkAllRead = async () => {
        try {
            await api.patch("/notifications/read-all");
        } catch (err) {
            // Local fallback
        }
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("All notifications marked as read");
    };

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setOpen(!open)}
                aria-label="Open notifications"
                className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                                Real-time Notifications
                            </h4>
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" />
                                <span>Mark read</span>
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400">No notifications found</div>
                        ) : (
                            notifications.map((n, idx) => (
                                <div
                                    key={n._id || idx}
                                    className={`p-3.5 flex items-start gap-3 transition-colors ${
                                        !n.isRead
                                            ? "bg-blue-50/50 dark:bg-blue-950/20"
                                            : "bg-white dark:bg-slate-900"
                                    }`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                                        {n.type === "interview" ? (
                                            <Calendar className="w-4 h-4" />
                                        ) : n.type === "outreach" ? (
                                            <MessageSquare className="w-4 h-4" />
                                        ) : (
                                            <Zap className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <h5 className="font-bold text-slate-900 dark:text-white">
                                                {n.title}
                                            </h5>
                                            <span className="text-[10px] text-slate-400">
                                                {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {n.message}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-center">
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                            <span>Socket.IO Real-time Connection Active 🟢</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
