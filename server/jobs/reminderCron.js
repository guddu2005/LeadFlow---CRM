const Interview = require("../models/Interview");
const emailService = require("../modules/email/email.service");
const notificationService = require("../modules/notification/notification.service");

const checkAndSendReminders = async () => {
    try {
        const now = new Date();

        // 1. Check for 24-hour reminders (interviews scheduled 23 to 25 hours from now)
        const in24HoursStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
        const in24HoursEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

        const interviews24h = await Interview.find({
            isDeleted: false,
            status: "Scheduled",
            reminder24Sent: false,
            scheduledAt: { $gte: in24HoursStart, $lte: in24HoursEnd }
        }).populate({
            path: "lead",
            populate: { path: "contact", select: "firstName lastName email" }
        });

        for (const interview of interviews24h) {
            if (interview.lead?.contact?.email) {
                const date = new Date(interview.scheduledAt).toLocaleDateString("en-GB");
                const time = new Date(interview.scheduledAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

                await emailService.sendInterviewReminder({
                    to: interview.lead.contact.email,
                    name: `${interview.lead.contact.firstName} ${interview.lead.contact.lastName}`,
                    date,
                    time,
                    meetingLink: interview.meetingLink || process.env.MEETING_LINK || "https://meet.google.com/ina-cmdg-frr"
                });
            }

            interview.reminder24Sent = true;
            await interview.save();

            if (interview.createdBy) {
                await notificationService.createNotification({
                    user: interview.createdBy,
                    type: "INTERVIEW_REMINDER",
                    title: "⏰ 24-Hour Meeting Reminder Sent",
                    message: `24-hour email reminder dispatched for research interview on ${new Date(interview.scheduledAt).toLocaleString()}`,
                    referenceId: interview._id,
                    referenceModel: "Interview"
                });
            }
        }

        // 2. Check for 1-hour reminders (interviews scheduled 50 to 70 minutes from now)
        const in1HourStart = new Date(now.getTime() + 50 * 60 * 1000);
        const in1HourEnd = new Date(now.getTime() + 70 * 60 * 1000);

        const interviews1h = await Interview.find({
            isDeleted: false,
            status: "Scheduled",
            reminder1HourSent: false,
            scheduledAt: { $gte: in1HourStart, $lte: in1HourEnd }
        }).populate({
            path: "lead",
            populate: { path: "contact", select: "firstName lastName email" }
        });

        for (const interview of interviews1h) {
            if (interview.lead?.contact?.email) {
                const date = new Date(interview.scheduledAt).toLocaleDateString("en-GB");
                const time = new Date(interview.scheduledAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

                await emailService.sendInterviewReminder({
                    to: interview.lead.contact.email,
                    name: `${interview.lead.contact.firstName} ${interview.lead.contact.lastName}`,
                    date,
                    time,
                    meetingLink: interview.meetingLink || process.env.MEETING_LINK || "https://meet.google.com/ina-cmdg-frr"
                });
            }

            interview.reminder1HourSent = true;
            await interview.save();

            if (interview.createdBy) {
                await notificationService.createNotification({
                    user: interview.createdBy,
                    type: "INTERVIEW_REMINDER",
                    title: "🔔 1-Hour Meeting Starting Soon Reminder Sent",
                    message: `1-hour email reminder dispatched for research interview starting soon at ${new Date(interview.scheduledAt).toLocaleTimeString()}`,
                    referenceId: interview._id,
                    referenceModel: "Interview"
                });
            }
        }
    } catch (err) {
        console.error("Automated Reminder Cron Error:", err);
    }
};

const startReminderCron = () => {
    // Initial check on server start, then every 5 minutes
    checkAndSendReminders();
    setInterval(checkAndSendReminders, 5 * 60 * 1000);
};

module.exports = { startReminderCron, checkAndSendReminders };
