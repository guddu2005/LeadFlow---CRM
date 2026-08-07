const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const dashboardService = require("./dashboard.service");

// Dashboard Overview
const getOverview = asyncHandler(async (req, res) => {

    const overview =
        await dashboardService.getOverview();

    res.status(200).json(

        new ApiResponse(

            200,

            "Dashboard overview fetched successfully",

            overview

        )

    );

});

// Sales Funnel
const getFunnel = asyncHandler(async (req, res) => {

    const funnel =
        await dashboardService.getFunnel();

    res.status(200).json(

        new ApiResponse(

            200,

            "Sales funnel fetched successfully",

            funnel

        )

    );

});

// Outreach Analytics
const getOutreachAnalytics = asyncHandler(async (req, res) => {

    const analytics =
        await dashboardService.getOutreachAnalytics();

    res.status(200).json(

        new ApiResponse(

            200,

            "Outreach analytics fetched successfully",

            analytics

        )

    );

});

// Interview Analytics
const getInterviewAnalytics = asyncHandler(async (req, res) => {

    const analytics =
        await dashboardService.getInterviewAnalytics();

    res.status(200).json(

        new ApiResponse(

            200,

            "Interview analytics fetched successfully",

            analytics

        )

    );

});

// Recent Activities
const getRecentActivities = asyncHandler(async (req, res) => {

    const activities =
        await dashboardService.getRecentActivities();

    res.status(200).json(

        new ApiResponse(

            200,

            "Recent activities fetched successfully",

            activities

        )

    );

});

// Monthly Growth
const getMonthlyGrowth = asyncHandler(async (req, res) => {

    const growth =
        await dashboardService.getMonthlyGrowth();

    res.status(200).json(

        new ApiResponse(

            200,

            "Monthly growth fetched successfully",

            growth

        )

    );

});

module.exports = {

    getOverview,

    getFunnel,

    getOutreachAnalytics,

    getInterviewAnalytics,

    getRecentActivities,

    getMonthlyGrowth

};