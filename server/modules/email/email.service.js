const { Resend } = require("resend");
const transporter = require("../../config/mail");

const {
    welcomeEmailTemplate,
    interviewConfirmationTemplate,
    interviewResearcherNotificationTemplate,
    interviewReminderTemplate,
    interviewCancelledTemplate,
    interviewRescheduledTemplate
} = require("./email.template");

// Initialize Resend instance if RESEND_API_KEY is present
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const sendEmail = async ({ to, subject, html }) => {
    if (!to) {
        console.warn("⚠️ sendEmail warning: Recipient 'to' address is missing");
        return false;
    }

    // 1. Primary: Use Resend HTTPS API (Bypasses Render SMTP Blocking)
    if (resend) {
        try {
            let sender = process.env.EMAIL_FROM || "LeadFlow CRM <onboarding@resend.dev>";
            if (!sender.includes("onboarding@resend.dev") && (sender.includes("@gmail.com") || sender.includes("@yahoo.com") || sender.includes("@outlook.com"))) {
                sender = "LeadFlow CRM <onboarding@resend.dev>";
            }

            const response = await resend.emails.send({
                from: sender,
                to: Array.isArray(to) ? to : [to],
                subject,
                html
            });

            if (response.error) {
                console.error("❌ Resend API returned error:", response.error.message);
                const errMsg = response.error.message || "";
                if (errMsg.includes("only send testing emails") || response.error.name === "validation_error" || errMsg.includes("verify a domain")) {
                    const ownerEmail = process.env.TEST_EMAIL_RECIPIENT || "bt23cse242@shivalikcollege.edu.in";
                    console.log(`ℹ️ Resend test mode restriction: Forwarding email intended for ${to} to owner ${ownerEmail}`);
                    const retryResponse = await resend.emails.send({
                        from: sender,
                        to: [ownerEmail],
                        subject: `[LeadFlow Outreach to ${to}] ${subject}`,
                        html: `<div style="padding:10px 14px;background:#f0fdf4;border:1px solid #bbf7d0;margin-bottom:15px;border-radius:8px;font-family:sans-serif;font-size:12px;color:#166534;">
                                <strong>LeadFlow Test Mode Dispatch</strong><br/>
                                Originally addressed to recipient: <code>${to}</code><br/>
                                <span style="font-size:11px;color:#15803d;">(Delivered to verified owner email via Resend API Free Tier)</span>
                               </div>` + html
                    });

                    if (!retryResponse.error) {
                        console.log(`✅ Resend Test Mode email delivered to ${ownerEmail} (ID: ${retryResponse.data?.id})`);
                        return { messageId: retryResponse.data?.id, provider: "Resend HTTPS API (Test Mode Owner Dispatch)" };
                    }
                }
                throw new Error(response.error.message);
            }

            console.log(`✅ Resend API Email sent successfully to ${to} (ID: ${response.data?.id})`);
            return { messageId: response.data?.id, provider: "Resend HTTPS API" };
        } catch (resendErr) {
            console.warn(`⚠️ Resend API failed (${resendErr.message}), falling back to SMTP...`);
        }
    }

    // 2. Secondary Fallback: Use Nodemailer SMTP Transporter
    const senderEmail = (process.env.EMAIL_USER || "gudducse2005@gmail.com").trim();
    try {
        const info = await transporter.sendMail({
            from: `"LeadFlow CRM" <${senderEmail}>`,
            to,
            subject,
            html
        });
        console.log(`✅ SMTP Email sent successfully to ${to} (Message ID: ${info.messageId})`);
        return { messageId: info.messageId, provider: "Nodemailer SMTP" };
    } catch (err) {
        console.error(`❌ Failed to send email to ${to}:`, err.message);
        throw err;
    }
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