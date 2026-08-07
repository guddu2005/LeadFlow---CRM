const mongoose = require("mongoose");

const prospectSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },

        website: {
            type: String,
            trim: true
        },

        location: {
            country: {
                type: String,
                trim: true
            },

            city: {
                type: String,
                trim: true
            }
        },

        estimatedUnits: {
            type: Number,
            default: 0
        },

        employeeCount: {
            type: Number,
            default: 0
        },

        contactName: {
            type: String,
            required: true,
            trim: true
        },

        jobTitle: {
            type: String,
            trim: true
        },

        linkedinUrl: {
            type: String,
            trim: true
        },

        email: {
            type: String,
            trim: true,
            lowercase: true
        },

        phone: {
            type: String,
            trim: true
        },

        currentSoftware: {
            type: String,
            trim: true
        },

        signal: {
            type: String,
            trim: true
        },

        source: {
            type: String,
            trim: true
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

        lastContacted: {
            type: Date,
            default: null
        },

        notes: {
            type: String,
            default: ""
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

        convertedToLead: {
            type: Boolean,
            default: false
        },

        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        converted: {
            type: Boolean,
            default: false
        },

        convertedLead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            default: null
        },

        convertedAt: {
            type: Date,
            default: null
        }

    },
    {
        timestamps: true
    });


module.exports = mongoose.model(
    "Prospect",
    prospectSchema
);