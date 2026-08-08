const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const prospectService = require("./prospect.service");
const fs = require("fs");

const createProspect = asyncHandler(async (req, res) => {

    const prospect = await prospectService.createProspect(
        req.body,
        req.user
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Prospect created successfully",
            prospect
        )
    );

});


const getProspects = asyncHandler(async (req, res) => {

    const prospects = await prospectService.getProspects(
        req.query
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Prospects fetched successfully",
            prospects
        )
    );

});


const getProspectById = asyncHandler(async (req, res) => {

    const prospect =
        await prospectService.getProspectById(
            req.params.id
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Prospect fetched successfully",
            prospect
        )
    );

});


const updateProspect = asyncHandler(async (req, res) => {

    const prospect =
        await prospectService.updateProspect(
            req.params.id,
            req.body,
            req.user
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Prospect updated successfully",
            prospect
        )
    );

});


const deleteProspect = asyncHandler(async (req, res) => {

    const prospect =
        await prospectService.deleteProspect(
            req.params.id,
            req.user
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Prospect deleted successfully",
            prospect
        )
    );

});

const convertProspect = asyncHandler(async (req, res) => {

    const result =
        await prospectService.convertProspectToLead(
            req.params.id,
            req.user
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Prospect converted to lead successfully",
            result
        )
    );

});

const importProspects = asyncHandler(async (req, res) => {

    if (!req.file) {

        throw new Error("CSV file is required");

    }

    const result =
        await prospectService.importProspects(
            req.file.path,
            req.user._id
        );

    fs.unlinkSync(req.file.path);

    res.status(200).json(
        new ApiResponse(
            200,
            "Prospects imported successfully",
            result
        )
    );

});


module.exports = {
    createProspect,
    getProspects,
    getProspectById,
    updateProspect,
    deleteProspect,
    convertProspect ,
    importProspects
};