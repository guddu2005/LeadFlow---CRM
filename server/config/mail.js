const nodemailer = require("nodemailer");

// Use Nodemailer Gmail service configuration with port 587 STARTTLS fallback for Cloud/Render
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: (process.env.EMAIL_USER || "gudducse2005@gmail.com").trim(),
        pass: (process.env.EMAIL_PASS || "pvauimhropdbsnzl").replace(/\s+/g, "")
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify connection configuration on startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Gmail SMTP Connection Error:", error.message);
    } else {
        console.log("✅ Gmail SMTP Transporter is ready to send emails!");
    }
});

module.exports = transporter;