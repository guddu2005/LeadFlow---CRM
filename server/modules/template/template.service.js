const MessageTemplate = require("../../models/MessageTemplate");
const Prospect = require("../../models/Prospect");
const ApiError = require("../../utils/ApiError");

const createTemplate = async (data,userId)=>{

    const existingTemplate =
        await MessageTemplate.findOne({

            name:data.name,

            channel:data.channel,

            version:data.version || "A",

            isDeleted:false

        });

    if(existingTemplate){

        throw new ApiError(
            400,
            "Template already exists"
        );

    }

    const template =
        await MessageTemplate.create({

            ...data,

            createdBy:userId,

            updatedBy:userId

        });

    return template;

};

const getTemplates = async ()=>{

    return await MessageTemplate.find({

        isDeleted:false

    })
    .populate(
        "createdBy",
        "firstName lastName"
    )
    .sort({
        createdAt:-1
    });

};

const getTemplateById = async (id)=>{

    const template =
        await MessageTemplate.findOne({

            _id:id,

            isDeleted:false

        });

    if(!template){

        throw new ApiError(
            404,
            "Template not found"
        );

    }

    return template;

};

const updateTemplate = async (
    id,
    data,
    userId
)=>{

    const template =
        await MessageTemplate.findOne({

            _id:id,

            isDeleted:false

        });

    if(!template){

        throw new ApiError(
            404,
            "Template not found"
        );

    }

    Object.assign(
        template,
        data
    );

    template.updatedBy=userId;

    await template.save();

    return template;

};

const deleteTemplate = async (id)=>{

    const template =
        await MessageTemplate.findOne({

            _id:id,

            isDeleted:false

        });

    if(!template){

        throw new ApiError(
            404,
            "Template not found"
        );

    }

    template.isDeleted=true;

    await template.save();

    return template;

};

const previewTemplate = async (
    templateId,
    prospectId
)=>{

    const template =
        await MessageTemplate.findOne({

            _id:templateId,

            isDeleted:false

        });

    if(!template){

        throw new ApiError(
            404,
            "Template not found"
        );

    }

    const prospect =
        await Prospect.findOne({

            _id:prospectId,

            isDeleted:false

        });

    if(!prospect){

        throw new ApiError(
            404,
            "Prospect not found"
        );

    }

    let subject =
        template.subject;

    let message =
        template.message;

    const variables={

        companyName:
            prospect.companyName || "",

        contactName:
            prospect.contactName || "",

        jobTitle:
            prospect.jobTitle || "",

        currentSoftware:
            prospect.currentSoftware || "",

        email:
            prospect.email || "",

        phone:
            prospect.phone || "",

        country:
            prospect.location?.country || "",

        city:
            prospect.location?.city || ""

    };

    Object.keys(variables).forEach((key)=>{

        const regex =
            new RegExp(
                `{{${key}}}`,
                "g"
            );

        subject =
            subject.replace(
                regex,
                variables[key]
            );

        message =
            message.replace(
                regex,
                variables[key]
            );

    });

    return{

        subject,

        message

    };

};

module.exports={

    createTemplate,

    getTemplates,

    getTemplateById,

    updateTemplate,

    deleteTemplate,

    previewTemplate

};