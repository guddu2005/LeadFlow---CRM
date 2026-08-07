const Joi = require("joi");


const createProspectValidation = Joi.object({

    companyName: Joi.string()
        .required()
        .trim(),

    website: Joi.string()
        .allow("")
        .optional(),

    location: Joi.object({

        country: Joi.string()
            .allow("")
            .optional(),

        city: Joi.string()
            .allow("")
            .optional()

    }).optional(),

    estimatedUnits: Joi.number()
        .min(0)
        .optional(),

    employeeCount: Joi.number()
        .min(0)
        .optional(),

    contactName: Joi.string()
        .required()
        .trim(),

    jobTitle: Joi.string()
        .allow("")
        .optional(),

    linkedinUrl: Joi.string()
        .allow("")
        .optional(),

    email: Joi.string()
        .email()
        .allow("")
        .optional(),

    phone: Joi.string()
        .allow("")
        .optional(),

    currentSoftware: Joi.string()
        .allow("")
        .optional(),

    signal: Joi.string()
        .allow("")
        .optional(),

    source: Joi.string()
        .allow("")
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

    notes: Joi.string()
        .allow("")
        .optional(),

    assignedTo: Joi.string()
        .optional()

});


const updateProspectValidation = Joi.object({

    companyName: Joi.string()
        .trim()
        .optional(),

    website: Joi.string()
        .allow("")
        .optional(),

    location: Joi.object({

        country: Joi.string()
            .allow("")
            .optional(),

        city: Joi.string()
            .allow("")
            .optional()

    }).optional(),

    estimatedUnits: Joi.number()
        .min(0)
        .optional(),

    employeeCount: Joi.number()
        .min(0)
        .optional(),

    contactName: Joi.string()
        .trim()
        .optional(),

    jobTitle: Joi.string()
        .allow("")
        .optional(),

    linkedinUrl: Joi.string()
        .allow("")
        .optional(),

    email: Joi.string()
        .email()
        .allow("")
        .optional(),

    phone: Joi.string()
        .allow("")
        .optional(),

    currentSoftware: Joi.string()
        .allow("")
        .optional(),

    signal: Joi.string()
        .allow("")
        .optional(),

    source: Joi.string()
        .allow("")
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

    lastContacted: Joi.date()
        .optional(),

    notes: Joi.string()
        .allow("")
        .optional(),

    assignedTo: Joi.string()
        .optional()

});


module.exports = {
    createProspectValidation,
    updateProspectValidation
};