const Joi = require("joi");


exports.createContactSchema = Joi.object({

    firstName:Joi.string()
        .trim()
        .required(),


    lastName:Joi.string()
        .trim()
        .allow("")
        .optional(),


    jobTitle:Joi.string()
        .trim()
        .allow("")
        .optional(),


    linkedinUrl:Joi.string()
        .uri()
        .allow("")
        .optional(),


    email:Joi.string()
        .email()
        .allow("")
        .optional(),


    emailVerified:Joi.boolean()
        .optional(),


    phone:Joi.string()
        .allow("")
        .optional(),


    notes:Joi.string()
        .allow("")
        .optional()

});



exports.updateContactSchema = Joi.object({

    firstName:Joi.string()
        .trim()
        .optional(),


    lastName:Joi.string()
        .trim()
        .optional(),


    jobTitle:Joi.string()
        .trim()
        .optional(),


    linkedinUrl:Joi.string()
        .uri()
        .optional(),


    email:Joi.string()
        .email()
        .optional(),


    phone:Joi.string()
        .optional(),


    emailVerified:Joi.boolean()
        .optional(),


    notes:Joi.string()
        .optional()

});