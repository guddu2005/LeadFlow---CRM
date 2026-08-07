const Joi = require("joi");

const createTemplateValidation = Joi.object({

    name:Joi.string()
        .trim()
        .required(),

    channel:Joi.string()
        .valid(
            "Email",
            "LinkedIn",
            "Phone"
        )
        .required(),

    version:Joi.string()
        .valid(
            "A",
            "B",
            "C"
        )
        .optional(),

    subject:Joi.string()
        .allow("")
        .optional(),

    message:Joi.string()
        .required(),

    variables:Joi.array()
        .items(
            Joi.string()
        )
        .optional(),

    isActive:Joi.boolean()
        .optional()

});

const updateTemplateValidation = Joi.object({

    name:Joi.string()
        .trim()
        .optional(),

    channel:Joi.string()
        .valid(
            "Email",
            "LinkedIn",
            "Phone"
        )
        .optional(),

    version:Joi.string()
        .valid(
            "A",
            "B",
            "C"
        )
        .optional(),

    subject:Joi.string()
        .allow("")
        .optional(),

    message:Joi.string()
        .optional(),

    variables:Joi.array()
        .items(
            Joi.string()
        )
        .optional(),

    isActive:Joi.boolean()
        .optional()

}).min(1);

const previewTemplateValidation = Joi.object({

    templateId:Joi.string()
        .required(),

    prospectId:Joi.string()
        .required()

});

module.exports = {

    createTemplateValidation,

    updateTemplateValidation,

    previewTemplateValidation

};