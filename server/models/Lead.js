const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            trim: true,
            default: ""
        },

        website: {
            type: String,
            trim: true,
            default: ""
        },

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            default: null
        },

        isConvertedToCompany: {
            type: Boolean,
            default: false
        },

        convertedCompany: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            default: null
        },

        contact: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Contact",
            required: true
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        source: {
            type: String,
            enum: [
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
            ],
            default: "Manual"
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

        signal: {
            type: String,
            trim: true,
            default: ""
        },

        lastContacted: {
            type: Date,
            default: null
        },

        nextFollowUp: {
            type: Date,
            default: null
        },

        notes: {
            type: String,
            trim: true,
            default: ""
        },

        tags: [
            {
                type: String,
                trim: true
            }
        ],

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

// Indexes
leadSchema.index({ status: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Lead", leadSchema);