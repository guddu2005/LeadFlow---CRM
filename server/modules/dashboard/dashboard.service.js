const Company = require("../../models/Company");
const Prospect = require("../../models/Prospect");
const Lead = require("../../models/Lead");
const Outreach = require("../../models/Outreach");
const Interview = require("../../models/Interview");
const Notification = require("../../models/Notification");

const getOverview = async () => {
    const [companies, prospects, leads, outreachs, interviews, notifications] = await Promise.all([
        Company.countDocuments({ isDeleted: false }),
        Prospect.countDocuments({ isDeleted: false }),
        Lead.countDocuments({ isDeleted: false }),
        Outreach.countDocuments({ isDeleted: false }),
        Interview.countDocuments({ isDeleted: false }),
        Notification.countDocuments({ isDeleted: false }),
    ]);

    return { companies, prospects, leads, outreachs, interviews, notifications };
};

const getFunnel = async () => {
    const [prospects, contacted, replied, booked, converted] = await Promise.all([
        Prospect.countDocuments({ isDeleted: false }),
        Prospect.countDocuments({ isDeleted: false, status: "Contacted" }),
        Prospect.countDocuments({ isDeleted: false, status: "Replied" }),
        Prospect.countDocuments({ isDeleted: false, status: "Booked" }),
        Lead.countDocuments({ isDeleted: false }),
    ]);

    const conversionRate = prospects ? Number(((converted / prospects) * 100).toFixed(2)) : 0;

    return { prospects, contacted, replied, booked, converted, conversionRate };
};

const getUpcomingInterviews = async () => {
    const now = new Date();
    const interviews = await Interview.find({
        isDeleted: false,
        status: { $in: ["Scheduled", "Rescheduled"] },
        scheduledAt: { $gte: now },
    })
        .populate({
            path: "lead",
            populate: [
                { path: "company", select: "companyName country city" },
                { path: "contact", select: "firstName lastName email phone" },
            ],
        })
        .sort({ scheduledAt: 1 })
        .limit(10);

    return interviews;
};

const getLeadAnalytics = async () => {
    const statusStats = await Lead.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);

    const priorityStats = await Lead.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    return { statusStats, priorityStats };
};

const getOutreachAnalytics = async () => {
    const [
        totalOutreachs,
        sent,
        opened,
        replied,
        booked,
        failed,
        cancelled,
        scheduled,
        draft,
        channelStats,
        statusStats,
        typeStats,
    ] = await Promise.all([
        Outreach.countDocuments({ isDeleted: false }),
        Outreach.countDocuments({ isDeleted: false, sentAt: { $ne: null } }),
        Outreach.countDocuments({ isDeleted: false, openedAt: { $ne: null } }),
        Outreach.countDocuments({ isDeleted: false, repliedAt: { $ne: null } }),
        Outreach.countDocuments({ isDeleted: false, status: "Booked" }),
        Outreach.countDocuments({ isDeleted: false, status: "Failed" }),
        Outreach.countDocuments({ isDeleted: false, status: "Cancelled" }),
        Outreach.countDocuments({ isDeleted: false, status: "Scheduled" }),
        Outreach.countDocuments({ isDeleted: false, status: "Draft" }),
        Outreach.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$channel", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        Outreach.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        Outreach.aggregate([
            { $match: { isDeleted: false } },
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
    ]);

    const openRate = sent > 0 ? Number(((opened / sent) * 100).toFixed(2)) : 0;
    const replyRate = sent > 0 ? Number(((replied / sent) * 100).toFixed(2)) : 0;
    const bookingRate = sent > 0 ? Number(((booked / sent) * 100).toFixed(2)) : 0;
    const positiveReplyRate = replied > 0 ? Number(((booked / replied) * 100).toFixed(2)) : 0;

    return {
        overview: {
            totalOutreachs,
            draft,
            scheduled,
            sent,
            opened,
            replied,
            booked,
            failed,
            cancelled,
            openRate,
            replyRate,
            positiveReplyRate,
            bookingRate,
        },
        channelStats,
        statusStats,
        typeStats,
    };
};

const getInterviewAnalytics = async () => {
    const totalInterviews = await Interview.countDocuments({ isDeleted: false });
    const statusStats = await Interview.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
    ]);

    const scheduled = statusStats.find((item) => item._id === "Scheduled")?.count || 0;
    const completed = statusStats.find((item) => item._id === "Completed")?.count || 0;
    const cancelled = statusStats.find((item) => item._id === "Cancelled")?.count || 0;
    const noShow = statusStats.find((item) => item._id === "No Show")?.count || 0;
    const successRate = totalInterviews ? Number(((completed / totalInterviews) * 100).toFixed(2)) : 0;

    return { totalInterviews, scheduled, completed, cancelled, noShow, successRate, statusStats };
};

const getMonthlyData = async (Model) => {
    return await Model.aggregate([
        { $match: { isDeleted: false } },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
};

const getMonthlyGrowth = async () => {
    const [companies, prospects, leads, outreachs, interviews] = await Promise.all([
        getMonthlyData(Company),
        getMonthlyData(Prospect),
        getMonthlyData(Lead),
        getMonthlyData(Outreach),
        getMonthlyData(Interview),
    ]);

    return { companies, prospects, leads, outreachs, interviews };
};

const getRecentActivities = async () => {
    const [recentLeads, recentInterviews, recentOutreach] = await Promise.all([
        Lead.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5),
        Interview.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5),
        Outreach.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5),
    ]);

    const activities = [
        ...recentLeads.map((l) => ({
            id: l._id,
            title: `Lead Activity`,
            desc: `New lead created for ${l.companyName || "Company"}`,
            time: new Date(l.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: l.createdAt,
        })),
        ...recentInterviews.map((i) => ({
            id: i._id,
            title: `Interview ${i.status}`,
            desc: `Meeting with candidate scheduled`,
            time: new Date(i.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: i.createdAt,
        })),
        ...recentOutreach.map((o) => ({
            id: o._id,
            title: `Outreach ${o.channel}`,
            desc: o.subject || `Campaign ${o.status}`,
            time: new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            createdAt: o.createdAt,
        })),
    ]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

    return activities;
};

module.exports = {
    getOverview,
    getFunnel,
    getUpcomingInterviews,
    getLeadAnalytics,
    getOutreachAnalytics,
    getInterviewAnalytics,
    getMonthlyGrowth,
    getRecentActivities,
};