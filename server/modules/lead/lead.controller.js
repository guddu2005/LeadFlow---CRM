const asyncHandler = require("../../middleware/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const leadService = require("./lead.service");

// Create Lead
exports.createLead = asyncHandler(async (req, res) => {

    const lead = await leadService.createLead(
        req.body,
        req.user._id
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Lead created successfully",
            lead
        )
    );
});

// Get All Leads
exports.getLeads = asyncHandler(async (req, res) => {

    const leads = await leadService.getLeads(
        req.query
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Leads fetched successfully",
            leads
        )
    );
});

// Get Lead By ID
exports.getLeadById = asyncHandler(async (req, res) => {

    const lead = await leadService.getLeadById(
        req.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Lead fetched successfully",
            lead
        )
    );
});

// Update Lead
exports.updateLead = asyncHandler(async (req, res) => {

    const lead = await leadService.updateLead(
        req.params.id,
        req.body,
        req.user
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Lead updated successfully",
            lead
        )
    );
});

// Delete Lead
exports.deleteLead = asyncHandler(async (req, res) => {

    await leadService.deleteLead(
        req.params.id,
        req.user
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Lead deleted successfully"
        )
    );
});

// Restore Lead
exports.restoreLead = asyncHandler(async (req, res) => {

    const lead = await leadService.restoreLead(
        req.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Lead restored successfully",
            lead
        )
    );
});

// Lead Statistics
exports.getLeadStats = asyncHandler(async (req, res) => {

    const stats = await leadService.getLeadStats();

    res.status(200).json(
        new ApiResponse(
            200,
            "Lead statistics fetched successfully",
            stats
        )
    );
});

exports.assignLead = asyncHandler(async (req, res) => {

    const lead = await leadService.assignLead(
        req.params.id,
        req.body.assignedTo,
        req.user
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Lead assigned successfully",
            lead
        )
    );

});

exports.convertLeadToCompany = asyncHandler(async (req, res) => {
    const result = await leadService.convertLeadToCompany(
        req.params.id,
        req.user._id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Lead converted to Company successfully",
            result
        )
    );
});