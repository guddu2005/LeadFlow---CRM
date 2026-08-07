const Joi = require("joi");

const createActivitySchema = Joi.object({
    lead: Joi.string()
        .hex()
        .length(24)
        .required(),
    activityType: Joi.string()
        .valid(
            "LinkedIn Connection",
            "LinkedIn Message",
            "Email",
            "Phone Call",
            "Meeting",
            "Research Interview",
            "Note",
            "Status Change",
            "Other"
        )
        .required(),

    subject: Joi.string()
        .trim()
        .max(200)
        .required(),

    description: Joi.string()
        .trim()
        .allow("")
        .optional(),

    outcome: Joi.string()
        .valid(
            "Pending",
            "Completed",
            "No Response",
            "Interested",
            "Not Interested",
            "Booked"
        )
        .optional(),

    activityDate: Joi.date()
        .optional(),

    nextFollowUp: Joi.date()
        .allow(null)
        .optional()
});

const updateActivitySchema = Joi.object({
    lead: Joi.string()
        .hex()
        .length(24)
        .optional(),

    activityType: Joi.string()
        .valid(
            "LinkedIn Connection",
            "LinkedIn Message",
            "Email",
            "Phone Call",
            "Meeting",
            "Research Interview",
            "Note",
            "Status Change",
            "Other"
        )
        .optional(),

    subject: Joi.string()
        .trim()
        .max(200)
        .optional(),

    description: Joi.string()
        .trim()
        .allow("")
        .optional(),

    outcome: Joi.string()
        .valid(
            "Pending",
            "Completed",
            "No Response",
            "Interested",
            "Not Interested",
            "Booked"
        )
        .optional(),

    activityDate: Joi.date()
        .optional(),

    nextFollowUp: Joi.date()
        .allow(null)
        .optional()
}).min(1);

module.exports = {
    createActivitySchema,
    updateActivitySchema
};