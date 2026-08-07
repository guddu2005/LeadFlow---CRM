const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const reportService = require("./report.service");

exports.getProspectReport = asyncHandler(async (req, res) => {

    const report =
        await reportService.getProspectReport();

    res.status(200).json(

        new ApiResponse(

            200,

            "Prospect report fetched successfully",

            report

        )

    );

});

exports.getOutreachReport = asyncHandler(async (req, res) => {

    const report =
        await reportService.getOutreachReport();

    res.status(200).json(

        new ApiResponse(

            200,

            "Outreach report fetched successfully",

            report

        )

    );

});

exports.getInterviewReport = asyncHandler(async (req, res) => {

    const report =
        await reportService.getInterviewReport();

    res.status(200).json(

        new ApiResponse(

            200,

            "Interview report fetched successfully",

            report

        )

    );

});


exports.getPerformanceReport = asyncHandler(async (req, res) => {

    const report =
        await reportService.getPerformanceReport();

    res.status(200).json(

        new ApiResponse(

            200,

            "Performance report fetched successfully",

            report

        )

    );

});