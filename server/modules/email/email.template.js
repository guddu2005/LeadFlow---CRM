// 1. WELCOME EMAIL TEMPLATE
exports.welcomeEmailTemplate = ({ firstName, email, role }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6f9; margin:0; padding:40px 20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
            
            <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding:40px 30px; text-align:center; color:white;">
                <h1 style="margin:0; font-size:26px; font-weight:800; tracking-tight: -0.025em;">Welcome to LeadFlow CRM! 🚀</h1>
                <p style="margin:8px 0 0 0; font-size:14px; opacity:0.9;">UK/EU Property Management Lead Generation & Pipeline Engine</p>
            </div>

            <div style="padding:32px 30px;">
                <p style="font-size:16px; color:#1e293b; margin-top:0;">Hello <strong>${firstName}</strong> 👋,</p>
                <p style="font-size:14px; color:#475569; line-height:1.6;">
                    Your account has been successfully created on <strong>LeadFlow CRM</strong>. You are now equipped to manage target prospects, run multi-channel outreach, book research interviews, and track pipeline metrics.
                </p>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin:24px 0;">
                    <h4 style="margin:0 0 12px 0; color:#0f172a; font-size:14px;">👤 Account Details:</h4>
                    <table cellpadding="6" style="width:100%; font-size:13px; color:#334155;">
                        <tr><td style="width:120px; font-weight:bold;">Email Address:</td><td>${email}</td></tr>
                        <tr><td style="font-weight:bold;">Assigned Role:</td><td><span style="background:#dbeafe; color:#1e40af; padding:3px 10px; border-radius:12px; font-weight:bold; font-size:11px; text-transform:uppercase;">${role || "User"}</span></td></tr>
                    </table>
                </div>

                <div style="text-align:center; margin:30px 0 20px 0;">
                    <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/login" style="display:inline-block; padding:14px 32px; background:#2563eb; color:#ffffff; font-weight:bold; font-size:14px; text-decoration:none; border-radius:12px; box-shadow:0 4px 12px rgba(37,99,235,0.3);">
                        Access LeadFlow Dashboard 🚀
                    </a>
                </div>
            </div>

            <div style="background:#f8fafc; padding:20px 30px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="font-size:12px; color:#94a3b8; margin:0;">LeadFlow CRM • Enterprise Sales & Research Intelligence</p>
            </div>

        </div>
    </body>
    </html>
    `;
};

// 2. RESEARCH INTERVIEW CONFIRMATION (FOR CONTACT / CLIENT)
exports.interviewConfirmationTemplate = ({ name, date, time, meetingLink }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6f9; margin:0; padding:40px 20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e2e8f0; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);">
            
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding:36px 30px; text-align:center; color:white;">
                <span style="background:rgba(255,255,255,0.2); padding:4px 12px; border-radius:12px; font-size:11px; font-weight:bold; uppercase tracking-wider;">RESEARCH STUDY CONFIRMATION</span>
                <h2 style="margin:10px 0 0 0; font-size:22px; font-weight:800;">Thank You for Booking a Research Call! 🎉</h2>
            </div>

            <div style="padding:32px 30px;">
                <p style="font-size:15px; color:#1e293b; margin-top:0;">Dear <strong>${name}</strong>,</p>
                <p style="font-size:14px; color:#475569; line-height:1.6;">
                    Thank you for agreeing to share your valuable operational feedback for our <strong>UK/EU Property Management Research Study</strong>. Your time is greatly appreciated!
                </p>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin:24px 0;">
                    <h4 style="margin:0 0 12px 0; color:#0f172a; font-size:14px;">📅 Confirmed Call Details:</h4>
                    <table cellpadding="6" style="width:100%; font-size:13px; color:#334155;">
                        <tr><td style="width:120px; font-weight:bold;">Scheduled Date:</td><td>${date}</td></tr>
                        <tr><td style="font-weight:bold;">Scheduled Time:</td><td>${time}</td></tr>
                        <tr><td style="font-weight:bold;">Video Link:</td><td><a href="${meetingLink}" style="color:#2563eb; font-weight:bold; text-decoration:none;">Join Google Meet 📹</a></td></tr>
                    </table>
                </div>

                <div style="text-align:center; margin:24px 0;">
                    <a href="${meetingLink}" style="display:inline-block; padding:12px 28px; background:#10b981; color:#ffffff; font-weight:bold; font-size:13px; text-decoration:none; border-radius:10px;">
                        Join Google Meet Call 📹
                    </a>
                </div>
            </div>

            <div style="background:#f8fafc; padding:20px 30px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="font-size:12px; color:#94a3b8; margin:0;">LeadFlow CRM • Executive Research Operations Team</p>
            </div>

        </div>
    </body>
    </html>
    `;
};

// 3. RESEARCHER NOTIFICATION TEMPLATE (FOR RESEARCHER / HOST)
exports.interviewResearcherNotificationTemplate = ({ researcherName, candidateName, companyName, jobTitle, date, time, meetingLink }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6f9; margin:0; padding:40px 20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e2e8f0;">
            
            <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding:36px 30px; text-align:center; color:white;">
                <h2 style="margin:0; font-size:22px; font-weight:800;">New Research Interview Booked! 🎯</h2>
            </div>

            <div style="padding:32px 30px;">
                <p style="font-size:15px; color:#1e293b; margin-top:0;">Hello <strong>${researcherName}</strong>,</p>
                <p style="font-size:14px; color:#475569; line-height:1.6;">
                    You have successfully booked a research interview with <strong>${candidateName}</strong> (${jobTitle || "Executive"}) from <strong>${companyName || "Lead Account"}</strong>.
                </p>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:20px; margin:24px 0;">
                    <h4 style="margin:0 0 12px 0; color:#0f172a; font-size:14px;">📋 Candidate & Meeting Telemetry:</h4>
                    <table cellpadding="6" style="width:100%; font-size:13px; color:#334155;">
                        <tr><td style="width:130px; font-weight:bold;">Candidate Name:</td><td>${candidateName}</td></tr>
                        <tr><td style="font-weight:bold;">Company Account:</td><td>${companyName}</td></tr>
                        <tr><td style="font-weight:bold;">Job Title:</td><td>${jobTitle || "Executive"}</td></tr>
                        <tr><td style="font-weight:bold;">Purpose:</td><td>UK/EU Property Management Research Study</td></tr>
                        <tr><td style="font-weight:bold;">Scheduled Date:</td><td>${date}</td></tr>
                        <tr><td style="font-weight:bold;">Scheduled Time:</td><td>${time}</td></tr>
                    </table>
                </div>

                <div style="text-align:center; margin:24px 0;">
                    <a href="${meetingLink}" style="display:inline-block; padding:12px 28px; background:#4f46e5; color:#ffffff; font-weight:bold; font-size:13px; text-decoration:none; border-radius:10px;">
                        Open Google Meet Host Link 📹
                    </a>
                </div>
            </div>

            <div style="background:#f8fafc; padding:20px 30px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="font-size:12px; color:#94a3b8; margin:0;">LeadFlow CRM System</p>
            </div>

        </div>
    </body>
    </html>
    `;
};

// 4. INTERVIEW REMINDER TEMPLATE (24H & 1H REMINDERS)
exports.interviewReminderTemplate = ({ name, date, time, meetingLink }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6f9; margin:0; padding:40px 20px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e2e8f0;">
            
            <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding:36px 30px; text-align:center; color:white;">
                <h2 style="margin:0; font-size:22px; font-weight:800;">⏰ Research Interview Reminder</h2>
            </div>

            <div style="padding:32px 30px;">
                <p style="font-size:15px; color:#1e293b; margin-top:0;">Hello <strong>${name}</strong>,</p>
                <p style="font-size:14px; color:#475569; line-height:1.6;">
                    This is a reminder for your upcoming UK/EU Property Management Research Interview.
                </p>

                <div style="background:#fffbeb; border:1px solid #fef3c7; border-radius:14px; padding:20px; margin:24px 0;">
                    <p style="margin:0; font-size:14px; color:#92400e;">
                        <b>Date:</b> ${date}<br>
                        <b>Time:</b> ${time}
                    </p>
                </div>

                <div style="text-align:center; margin:24px 0;">
                    <a href="${meetingLink}" style="display:inline-block; padding:12px 28px; background:#d97706; color:#ffffff; font-weight:bold; font-size:13px; text-decoration:none; border-radius:10px;">
                        Join Google Meet Call 📹
                    </a>
                </div>
            </div>

            <div style="background:#f8fafc; padding:20px 30px; border-top:1px solid #e2e8f0; text-align:center;">
                <p style="font-size:12px; color:#94a3b8; margin:0;">LeadFlow CRM System</p>
            </div>

        </div>
    </body>
    </html>
    `;
};

// 5. INTERVIEW CANCELLED TEMPLATE
exports.interviewCancelledTemplate = ({ name }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; background:#f4f6f9; padding:30px;">
        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:16px; border:1px solid #e2e8f0;">
            <h2 style="color:#ef4444;">Interview Cancelled</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your scheduled research interview has been cancelled. We apologize for any inconvenience.</p>
        </div>
    </body>
    </html>
    `;
};

// 6. INTERVIEW RESCHEDULED TEMPLATE
exports.interviewRescheduledTemplate = ({ name, date, time, meetingLink }) => {
    return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="font-family: Arial, sans-serif; background:#f4f6f9; padding:30px;">
        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:16px; border:1px solid #e2e8f0;">
            <h2 style="color:#2563eb;">Interview Rescheduled</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your interview has been rescheduled to <b>${date}</b> at <b>${time}</b>.</p>
            <p><a href="${meetingLink}" style="color:#2563eb; font-weight:bold;">Join Google Meet Call 📹</a></p>
        </div>
    </body>
    </html>
    `;
};