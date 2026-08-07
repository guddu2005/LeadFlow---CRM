const transporter = require("../../config/mail");

const {
    welcomeEmailTemplate,
    interviewConfirmationTemplate,
    interviewResearcherNotificationTemplate,
    interviewReminderTemplate,
    interviewCancelledTemplate,
    interviewRescheduledTemplate
} = require("./email.template");

const sendEmail = async ({ to, subject, html }) => {
    return await transporter.sendMail({
        from: `"LeadFlow CRM" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
};

const sendWelcomeEmail = async (user) => {
    return await sendEmail({
        to: user.email,
        subject: "Welcome to LeadFlow CRM! 🚀",
        html: welcomeEmailTemplate(user)
    });
};

const sendTestEmail = async (email) => {
    return await sendEmail({
        to: email,
        subject: "LeadFlow CRM Test Email",
        html: `
            <h2>Email Configuration Successful 🎉</h2>
            <p>Your email service is working correctly.</p>
        `
    });
};

const sendInterviewConfirmation = async (data) => {
    return await sendEmail({
        to: data.to,
        subject: "Thank You for Booking a Research Interview — LeadFlow Study",
        html: interviewConfirmationTemplate(data)
    });
};

const sendInterviewResearcherNotification = async (data) => {
    return await sendEmail({
        to: data.to,
        subject: `New Research Interview Booked with ${data.candidateName} (${data.companyName})`,
        html: interviewResearcherNotificationTemplate(data)
    });
};

const sendInterviewReminder = async (data) => {
    return await sendEmail({
        to: data.to,
        subject: "⏰ Research Interview Reminder — LeadFlow",
        html: interviewReminderTemplate(data)
    });
};

const sendInterviewCancelled = async (data) => {
    return await sendEmail({
        to: data.to,
        subject: "Interview Cancelled",
        html: interviewCancelledTemplate(data)
    });
};

const sendInterviewRescheduled = async (data) => {
    return await sendEmail({
        to: data.to,
        subject: "Interview Rescheduled",
        html: interviewRescheduledTemplate(data)
    });
};

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendTestEmail,
    sendInterviewConfirmation,
    sendInterviewResearcherNotification,
    sendInterviewReminder,
    sendInterviewCancelled,
    sendInterviewRescheduled
};