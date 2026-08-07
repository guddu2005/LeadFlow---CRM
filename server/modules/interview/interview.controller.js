const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const interviewService = require("./interview.service");

exports.scheduleInterview = asyncHandler(async (req, res) => {

    const interview = await interviewService.scheduleInterview(
        req.body,
        req.user._id
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Interview scheduled successfully",
            interview
        )
    );

});

exports.getInterviews = asyncHandler(async (req, res) => {

    const interviews = await interviewService.getInterviews(
        req.query
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Interviews fetched successfully",
            interviews
        )
    );

});

exports.getInterviewById = asyncHandler(async (req, res) => {

    const interview = await interviewService.getInterviewById(
        req.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Interview fetched successfully",
            interview
        )
    );

});

exports.updateInterview = asyncHandler(async (req, res) => {

    const interview = await interviewService.updateInterview(
        req.params.id,
        req.body,
        req.user._id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Interview updated successfully",
            interview
        )
    );

});

exports.cancelInterview = asyncHandler(async (req, res) => {

    const interview = await interviewService.cancelInterview(
        req.params.id,
        req.user._id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Interview cancelled successfully",
            interview
        )
    );

});

exports.completeInterview = asyncHandler(async (req, res) => {

    const interview = await interviewService.completeInterview(
        req.params.id,
        req.body.feedback,
        req.user._id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Interview completed successfully",
            interview
        )
    );

});

exports.deleteInterview = asyncHandler(async (req, res) => {

    await interviewService.deleteInterview(
        req.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Interview deleted successfully"
        )
    );

});

exports.restoreInterview = asyncHandler(async (req, res) => {

    const interview = await interviewService.restoreInterview(
        req.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Interview restored successfully",
            interview
        )
    );

});

exports.getInterviewStats = asyncHandler(async (req, res) => {

    const stats = await interviewService.getInterviewStats();

    res.status(200).json(
        new ApiResponse(
            200,
            "Interview statistics fetched successfully",
            stats
        )
    );

});

exports.markNoShow = asyncHandler(async (req, res) => {

    const interview = await interviewService.markNoShow(
        req.params.id,
        req.user._id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Interview marked as No Show",
            interview
        )
    );

});