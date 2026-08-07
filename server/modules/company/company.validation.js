const Joi = require("joi");

const createCompanySchema = Joi.object({
    companyName: Joi.string().trim().required(),

    website: Joi.string()
        .uri()
        .allow("", null),

    country: Joi.string().trim().required(),

    city: Joi.string()
        .trim()
        .allow("", null),

    estimatedUnits: Joi.number()
        .integer()
        .min(0)
        .default(0),

    employeeCount: Joi.number()
        .integer()
        .min(0)
        .default(0),

    currentSoftware: Joi.string()
        .trim()
        .allow("", null),

    signal: Joi.string()
        .trim()
        .allow("", null),

    source: Joi.string()
        .valid(
            "LinkedIn",
            "Rightmove",
            "Company Website",
            "Referral",
            "Manual",
            "Other"
        )
        .default("Manual"),

    status: Joi.string()
        .valid(
            "Not Contacted",
            "Contacted",
            "Replied",
            "Booked",
            "Declined"
        )
        .default("Not Contacted"),

    lastContacted: Joi.date()
        .optional()
        .allow(null),

    notes: Joi.string()
        .trim()
        .allow("", null)
});

const updateCompanySchema = Joi.object({
    companyName: Joi.string().trim(),

    website: Joi.string()
        .uri()
        .allow("", null),

    country: Joi.string().trim(),

    city: Joi.string()
        .trim()
        .allow("", null),

    estimatedUnits: Joi.number()
        .integer()
        .min(0),

    employeeCount: Joi.number()
        .integer()
        .min(0),

    currentSoftware: Joi.string()
        .trim()
        .allow("", null),

    signal: Joi.string()
        .trim()
        .allow("", null),

    source: Joi.string().valid(
        "LinkedIn",
        "Rightmove",
        "Company Website",
        "Referral",
        "Manual",
        "Other"
    ),

    status: Joi.string().valid(
        "Not Contacted",
        "Contacted",
        "Replied",
        "Booked",
        "Declined"
    ),

    lastContacted: Joi.date()
        .optional()
        .allow(null),

    notes: Joi.string()
        .trim()
        .allow("", null)
}).min(1);

module.exports = {
    createCompanySchema,
    updateCompanySchema
};