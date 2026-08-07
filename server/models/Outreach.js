const mongoose = require("mongoose");

const outreachSchema = new mongoose.Schema({

    prospect: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prospect",
        required: true
    },

    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MessageTemplate",
        required: true
    },

    templateVersion: {
        type: String,
        enum: [
            "A",
            "B",
            "C"
        ]
    },

    channel: {
        type: String,
        enum: [
            "LinkedIn",
            "Email",
            "Phone"
        ],
        required: true
    },

    sequenceType: {
        type: String,
        enum: [
            "Initial",
            "Follow Up 1",
            "Follow Up 2"
        ],
        default: "Initial"
    },

    sequenceStep: {
        type: Number,
        default: 1,
        min: 1,
        max: 3
    },

    status: {
        type: String,
        enum: [
            "Draft",
            "Scheduled",
            "Sent",
            "Delivered",
            "Opened",
            "Replied",
            "Booked",
            "Failed",
            "Cancelled"
        ],
        default: "Draft"
    },

    subject: {
        type: String,
        trim: true,
        default: ""
    },

    message: {
        type: String,
        trim: true,
        default: ""
    },

    scheduledAt: {
        type: Date
    },

    sentAt: {
        type: Date
    },

    openedAt: {
        type: Date
    },

    repliedAt: {
        type: Date
    },

    bookedAt: {
        type: Date
    },

    followUpNumber: {
        type: Number,
        default: 0,
        min: 0,
        max: 2
    },

    outcome: {
        type: String,
        enum: [
            "Interested",
            "Not Interested",
            "Call Later",
            "No Response",
            "Meeting Booked",
            "Other"
        ],
        default: "Other"
    },

    notes: {
        type: String,
        trim: true,
        default: ""
    },

    providerMessageId: {
        type: String,
        default: ""
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

outreachSchema.index({
    prospect: 1
});

outreachSchema.index({
    channel: 1
});

outreachSchema.index({
    status: 1
});

outreachSchema.index({
    assignedTo: 1
});

outreachSchema.index({
    prospect: 1,
    channel: 1,
    sequenceStep: 1
});

outreachSchema.index({
    createdAt: -1
});

module.exports = mongoose.model(
    "Outreach",
    outreachSchema
);