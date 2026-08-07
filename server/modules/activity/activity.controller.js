const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const activityService = require("./activity.service");

// Create Activity
exports.createActivity = asyncHandler(async (req, res) => {

    const activity = await activityService.createActivity(
        req.body,
        req.user._id
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Activity created successfully",
            activity
        )
    );
});

// Get All Activities
exports.getActivities = asyncHandler(async (req, res) => {

    const activities = await activityService.getActivities(
        req.query
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Activities fetched successfully",
            activities
        )
    );
});

// Get Activity By ID
exports.getActivityById = asyncHandler(async (req, res) => {

    const activity = await activityService.getActivityById(
        req.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Activity fetched successfully",
            activity
        )
    );
});

// Get Activities By Lead
exports.getActivitiesByLead = asyncHandler(async (req, res) => {

    const activities = await activityService.getActivitiesByLead(
        req.params.leadId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Lead activities fetched successfully",
            activities
        )
    );
});

// Update Activity
exports.updateActivity = asyncHandler(async (req, res) => {

    const activity = await activityService.updateActivity(
        req.params.id,
        req.body,
        req.user._id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Activity updated successfully",
            activity
        )
    );
});

// Delete Activity
exports.deleteActivity = asyncHandler(async (req, res) => {

    await activityService.deleteActivity(
        req.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Activity deleted successfully"
        )
    );
});

// Restore Activity
exports.restoreActivity = asyncHandler(async (req, res) => {

    const activity = await activityService.restoreActivity(
        req.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Activity restored successfully",
            activity
        )
    );
});

// Activity Statistics
exports.getActivityStats = asyncHandler(async (req, res) => {

    const stats = await activityService.getActivityStats();

    res.status(200).json(
        new ApiResponse(
            200,
            "Activity statistics fetched successfully",
            stats
        )
    );
});