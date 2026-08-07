const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema(
    {

        // User who will receive notification
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


        // Notification category
        type: {
            type: String,
            enum: [
                // Lead
                "LEAD_CREATED",
                "LEAD_UPDATED",
                "LEAD_ASSIGNED",
                "LEAD_DELETED",

                // Prospect
                "PROSPECT_CREATED",
                "PROSPECT_UPDATED",
                "PROSPECT_CONVERTED",
                "PROSPECT_DELETED",

                // Company
                "COMPANY_CREATED",
                "COMPANY_UPDATED",
                "COMPANY_VERIFIED",
                "COMPANY_DELETED",

                // Contact
                "CONTACT_CREATED",
                "CONTACT_UPDATED",
                "CONTACT_DELETED",

                // Interview
                "INTERVIEW_CREATED",
                "INTERVIEW_UPDATED",
                "INTERVIEW_CANCELLED",
                "INTERVIEW_COMPLETED",
                "INTERVIEW_REMINDER",
                "INTERVIEW_NO_SHOW",

                // Outreach
                "OUTREACH_CREATED",
                "OUTREACH_UPDATED",
                "OUTREACH_SENT",
                "OUTREACH_REPLIED",
                "OUTREACH_BOOKED",

                // Follow Up
                "FOLLOW_UP_CREATED",
                "FOLLOW_UP_REMINDER",
                "FOLLOW_UP_COMPLETED",

                // Email
                "EMAIL_SENT",
                "EMAIL_DELIVERED",
                "EMAIL_OPENED",
                "EMAIL_BOUNCED",

                // Status
                "STATUS_CHANGED",

                // User
                "USER_CREATED",
                "USER_UPDATED",

                // Compliance
                "COMPLIANCE_ALERT",

                // System
                "SYSTEM"
            ],
            required: true
        },


        // Notification heading
        title: {
            type: String,
            required: true,
            trim: true
        },


        // Notification description
        message: {
            type: String,
            required: true,
            trim: true
        },


        // Related document id
        // Example:
        // Lead ID
        // Interview ID
        // Company ID
        referenceId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },


        // Related model name
        referenceModel: {
            type: String,
            enum: [
                "Lead",
                "Prospect",
                "Company",
                "Contact",
                "Interview",
                "Outreach",
                "FollowUp",
                "User"
            ],
            default: null
        },


        // Read status
        isRead: {
            type: Boolean,
            default: false
        },


        // Soft delete
        isDeleted: {
            type: Boolean,
            default: false
        }

    },
    {
        timestamps: true
    }
);


// Indexes for faster fetching

notificationSchema.index({
    user: 1,
    isRead: 1
});


notificationSchema.index({
    createdAt: -1
});


module.exports = mongoose.model(
    "Notification",
    notificationSchema
);