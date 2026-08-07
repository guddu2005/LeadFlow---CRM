const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const templateService = require("./template.service");

const createTemplate = asyncHandler(async (req,res)=>{

    const template =
        await templateService.createTemplate(
            req.body,
            req.user._id
        );

    res.status(201).json(
        new ApiResponse(
            201,
            "Template created successfully",
            template
        )
    );

});

const getTemplates = asyncHandler(async (req,res)=>{

    const templates =
        await templateService.getTemplates();

    res.status(200).json(
        new ApiResponse(
            200,
            "Templates fetched successfully",
            templates
        )
    );

});

const getTemplateById = asyncHandler(async (req,res)=>{

    const template =
        await templateService.getTemplateById(
            req.params.id
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Template fetched successfully",
            template
        )
    );

});

const updateTemplate = asyncHandler(async (req,res)=>{

    const template =
        await templateService.updateTemplate(
            req.params.id,
            req.body,
            req.user._id
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Template updated successfully",
            template
        )
    );

});

const deleteTemplate = asyncHandler(async (req,res)=>{

    const template =
        await templateService.deleteTemplate(
            req.params.id
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Template deleted successfully",
            template
        )
    );

});

const previewTemplate = asyncHandler(async (req,res)=>{

    const preview =
        await templateService.previewTemplate(
            req.body.templateId,
            req.body.prospectId
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Template preview generated successfully",
            preview
        )
    );

});

module.exports={

    createTemplate,

    getTemplates,

    getTemplateById,

    updateTemplate,

    deleteTemplate,

    previewTemplate

};