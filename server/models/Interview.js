const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
    {
        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            required: true
        },

        scheduledAt: {
            type: Date,
            required: true
        },

        duration: {
            type: Number,
            default: 30
        },

        timezone: {
            type: String,
            default: "Europe/London"
        },

        meetingLink: {
            type: String,
            default: process.env.MEETING_LINK || "https://calendly.com/leadflow-research/30min"
        },

        bookingSource: {
            type: String,
            enum: ["Calendly", "Manual", "Direct"],
            default: "Calendly"
        },

        calendlyLink: {
            type: String,
            default: "https://calendly.com/leadflow-research/30min"
        },

        calendlyEventUri: {
            type: String,
            default: ""
        },


        status: {
            type: String,
            enum: [
                "Scheduled",
                "Completed",
                "Cancelled",
                "No Show",
                "Rescheduled"
            ],
            default: "Scheduled"
        },

        reminder24Sent: {
            type: Boolean,
            default: false
        },

        reminder1HourSent: {
            type: Boolean,
            default: false
        },

        notes: {
            type: String,
            default: ""
        },

        feedback: {
            type: String,
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
        },
        attendanceStatus: {
            type: String,
            enum: ["Pending", "Attended", "No Show"],
            default: "Pending"
        },

        completedAt: {
            type: Date,
            default: null
        },
        type: {
            type: String,
            enum: [
                "LEAD_ASSIGNED",
                "INTERVIEW_CREATED",
                "INTERVIEW_REMINDER",
                "FOLLOW_UP_REMINDER",
                "COMPANY_VERIFIED",
                "EMAIL_SENT",
                "STATUS_CHANGED"
            ]
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Interview", interviewSchema);