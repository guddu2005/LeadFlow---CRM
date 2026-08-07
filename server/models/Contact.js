const mongoose = require("mongoose");


const contactSchema = new mongoose.Schema({

    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    isPrimary: {
        type: Boolean,
        default: false
    },

    department: {
        type: String,
        enum: [
            "Operations",
            "Management",
            "Maintenance",
            "Finance",
            "Other"
        ],
        default: "Operations"
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },


    lastName: {
        type: String,
        trim: true,
        default: ""
    },


    jobTitle: {
        type: String,
        trim: true,
        default: ""
    },


    linkedinUrl: {
        type: String,
        trim: true,
        default: ""
    },


    email: {
        type: String,
        trim: true,
        lowercase: true,
        default: ""
    },


    emailVerified: {
        type: Boolean,
        default: false
    },


    phone: {
        type: String,
        trim: true,
        default: ""
    },


    notes: {
        type: String,
        trim: true,
        default: ""
    },


    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },


    isDeleted: {
        type: Boolean,
        default: false
    }


}, {
    timestamps: true
});



contactSchema.index({
    company: 1
});


contactSchema.index({
    email: 1
});


module.exports = mongoose.model(
    "Contact",
    contactSchema
);