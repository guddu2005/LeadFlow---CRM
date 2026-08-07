const Company = require("../../models/Company");
const Prospect = require("../../models/Prospect");
const Lead = require("../../models/Lead");
const Interview = require("../../models/Interview");
const dashboardService = require("../dashboard/dashboard.service");


const getProspectReport = async () => {

    const [
        totalProspects,
        newProspects,
        contacted,
        replied,
        booked,
        converted
    ] = await Promise.all([

        Prospect.countDocuments({
            isDeleted: false
        }),

        Prospect.countDocuments({
            isDeleted: false,
            status: "New"
        }),

        Prospect.countDocuments({
            isDeleted: false,
            status: "Contacted"
        }),

        Prospect.countDocuments({
            isDeleted: false,
            status: "Replied"
        }),

        Prospect.countDocuments({
            isDeleted: false,
            status: "Booked"
        }),

        Lead.countDocuments({
            isDeleted: false
        })

    ]);

    const conversionRate =
        totalProspects
            ? Number(
                (
                    (converted / totalProspects) * 100
                ).toFixed(2)
            )
            : 0;

    return {

        totalProspects,

        newProspects,

        contacted,

        replied,

        booked,

        converted,

        conversionRate

    };

};

const getOutreachReport = async () => {

    const analytics =
        await dashboardService.getOutreachAnalytics();

    return {

        generatedAt: new Date(),

        overview: analytics.overview,

        channelStats: analytics.channelStats,

        statusStats: analytics.statusStats,

        typeStats: analytics.typeStats

    };

};

const getInterviewReport = async () => {

    const [
        totalInterviews,
        scheduled,
        completed,
        cancelled,
        noShow
    ] = await Promise.all([

        Interview.countDocuments({
            isDeleted: false
        }),

        Interview.countDocuments({
            isDeleted: false,
            status: "Scheduled"
        }),

        Interview.countDocuments({
            isDeleted: false,
            status: "Completed"
        }),

        Interview.countDocuments({
            isDeleted: false,
            status: "Cancelled"
        }),

        Interview.countDocuments({
            isDeleted: false,
            status: "No Show"
        })

    ]);

    const completionRate =
        totalInterviews
            ? Number(
                (
                    (completed / totalInterviews) * 100
                ).toFixed(2)
            )
            : 0;

    return {

        totalInterviews,

        scheduled,

        completed,

        cancelled,

        noShow,

        completionRate

    };

};


const getPerformanceReport = async () => {

    const [
        totalCompanies,
        totalProspects,
        totalLeads,
        totalInterviews,
        outreachAnalytics
    ] = await Promise.all([

        Company.countDocuments({
            isDeleted: false
        }),

        Prospect.countDocuments({
            isDeleted: false
        }),

        Lead.countDocuments({
            isDeleted: false
        }),

        Interview.countDocuments({
            isDeleted: false
        }),

        dashboardService.getOutreachAnalytics()

    ]);

    const conversionRate =
        totalProspects
            ? Number(
                (
                    (totalLeads / totalProspects) * 100
                ).toFixed(2)
            )
            : 0;

    return {

        generatedAt: new Date(),

        summary: {

            totalCompanies,

            totalProspects,

            totalLeads,

            totalOutreachs:
                outreachAnalytics.overview.totalOutreachs,

            totalInterviews

        },

        performance: {

            conversionRate,

            openRate:
                outreachAnalytics.overview.openRate,

            replyRate:
                outreachAnalytics.overview.replyRate,

            bookingRate:
                outreachAnalytics.overview.bookingRate

        }

    };

};



module.exports = {

    getProspectReport,
    getOutreachReport,
    getInterviewReport,
    getPerformanceReport

};