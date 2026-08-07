const Joi = require("joi");

const createLeadSchema = Joi.object({
    company: Joi.string()
        .hex()
        .length(24)
        .required(),

    contact: Joi.string()
        .hex()
        .length(24)
        .required(),

    assignedTo: Joi.string()
        .hex()
        .length(24)
        .optional()
        .allow(null, ""),

    source: Joi.string()
        .valid(
            "LinkedIn",
            "Companies House",
            "ARLA Propertymark",
            "NRLA",
            "Rightmove",
            "Zoopla",
            "Property Ombudsman",
            "Competitor Website",
            "Referral",
            "Manual",
            "Other"
        )
        .optional(),

    status: Joi.string()
        .valid(
            "Not Contacted",
            "Contacted",
            "Replied",
            "Booked",
            "Declined"
        )
        .optional(),

    priority: Joi.string()
        .valid(
            "Low",
            "Medium",
            "High"
        )
        .optional(),

    signal: Joi.string()
        .trim()
        .allow("")
        .optional(),

    lastContacted: Joi.date()
        .optional()
        .allow(null),

    nextFollowUp: Joi.date()
        .optional()
        .allow(null),

    notes: Joi.string()
        .trim()
        .allow("")
        .optional(),

    tags: Joi.array()
        .items(Joi.string().trim())
        .optional()
});

const updateLeadSchema = Joi.object({
    company: Joi.string()
        .hex()
        .length(24)
        .optional(),

    contact: Joi.string()
        .hex()
        .length(24)
        .optional(),
    source: Joi.string()
        .valid(
            "LinkedIn",
            "Companies House",
            "ARLA Propertymark",
            "NRLA",
            "Rightmove",
            "Zoopla",
            "Property Ombudsman",
            "Competitor Website",
            "Referral",
            "Manual",
            "Other"
        )
        .optional(),

    status: Joi.string()
        .valid(
            "Not Contacted",
            "Contacted",
            "Replied",
            "Booked",
            "Declined"
        )
        .optional(),

    priority: Joi.string()
        .valid(
            "Low",
            "Medium",
            "High"
        )
        .optional(),

    signal: Joi.string()
        .trim()
        .allow("")
        .optional(),

    lastContacted: Joi.date()
        .optional()
        .allow(null),

    nextFollowUp: Joi.date()
        .optional()
        .allow(null),

    notes: Joi.string()
        .trim()
        .allow("")
        .optional(),

    tags: Joi.array()
        .items(Joi.string().trim())
        .optional()
}).min(1);

const assignLeadValidation = Joi.object({

    assignedTo: Joi.string()
        .required()

});

module.exports = {
    createLeadSchema,
    updateLeadSchema,
    assignLeadValidation
};