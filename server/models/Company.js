const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },

        logo: {
            type: String,
            default: null
        },

        logoPublicId: {
            type: String,
            default: null
        }
        ,
        website: {
            type: String,
            trim: true,
            lowercase: true,
            default: ""
        },

        companyType: {
            type: String,
            enum: [
                "Residential Property Management",
                "Lettings Agency",
                "Build-to-Rent",
                "Estate Agency",
                "Other"
            ],
            default: "Residential Property Management"
        },

        country: {
            type: String,
            required: true,
            trim: true
        },

        city: {
            type: String,
            trim: true,
            default: ""
        },

        estimatedUnits: {
            type: Number,
            default: 0,
            min: 0
        },

        employeeCount: {
            type: Number,
            default: 0,
            min: 0
        },
        contactsCount: {
            type: Number,
            default: 0
        },
        leadCount: {
            type: Number,
            default: 0
        },
        currentSoftware: {
            type: String,
            trim: true,
            default: ""
        },

        signal: {
            type: String,
            trim: true,
            default: ""
        },

        source: {
            type: String,
            enum: [
                "LinkedIn",
                "Rightmove",
                "Company Website",
                "Referral",
                "Manual",
                "Other"
            ],
            default: "Manual"
        },

        sourceUrl: {
            type: String,
            trim: true,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "Not Contacted",
                "Contacted",
                "Replied",
                "Booked",
                "Declined"
            ],
            default: "Not Contacted"
        },

        priority: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High"
            ],
            default: "Medium"
        },

        verificationStatus: {
            type: String,
            enum: [
                "Pending",
                "Verified",
                "Rejected"
            ],
            default: "Pending"
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        lastContacted: {
            type: Date,
            default: null
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        },

        tags: [{
            type: String,
            trim: true
        }],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

companySchema.index({ companyName: 1, isDeleted: 1 });
companySchema.index({ country: 1 });
companySchema.index({ city: 1 });
companySchema.index({ status: 1 });
companySchema.index({ source: 1 });
companySchema.index({ assignedTo: 1 });
companySchema.index({ createdBy: 1 });

module.exports = mongoose.model("Company", companySchema);