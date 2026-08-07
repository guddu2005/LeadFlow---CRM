const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const outreachService = require("./outreach.service");

const createOutreach = asyncHandler(async (req,res)=>{

    const outreach = await outreachService.createOutreach(
        req.body,
        req.user._id
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Outreach created successfully",
            outreach
        )
    );

});

const getOutreachs = asyncHandler(async (req,res)=>{

    const outreachs = await outreachService.getOutreachs(
        req.query
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Outreach fetched successfully",
            outreachs
        )
    );

});

const getProspectTimeline = asyncHandler(async (req,res)=>{

    const timeline =
        await outreachService.getProspectTimeline(
            req.params.prospectId
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Timeline fetched successfully",
            timeline
        )
    );

});

const updateOutreach = asyncHandler(async (req,res)=>{

    const outreach =
        await outreachService.updateOutreach(
            req.params.id,
            req.body,
            req.user._id
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Outreach updated successfully",
            outreach
        )
    );

});

const updateOutreachStatus = asyncHandler(async (req,res)=>{

    const outreach =
        await outreachService.updateOutreachStatus(
            req.params.id,
            req.body.status,
            req.user._id
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Outreach status updated successfully",
            outreach
        )
    );

});

const deleteOutreach = asyncHandler(async (req,res)=>{

    const outreach =
        await outreachService.deleteOutreach(
            req.params.id,
            req.user._id
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Outreach deleted successfully",
            outreach
        )
    );

});

const getOutreachStats = asyncHandler(async (req,res)=>{

    const stats =
        await outreachService.getOutreachStats();

    res.status(200).json(
        new ApiResponse(
            200,
            "Outreach statistics fetched successfully",
            stats
        )
    );

});

module.exports = {

    createOutreach,

    getOutreachs,

    getProspectTimeline,

    updateOutreach,

    updateOutreachStatus,

    deleteOutreach,

    getOutreachStats

};