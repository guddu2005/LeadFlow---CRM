const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");
const ApiError = require("./utils/ApiError");
dotenv.config();

// routes imports
const authRoutes = require("./modules/auth/auth.routes");
const companyRoutes = require("./modules/company/company.routes");
const contactRoutes = require("./modules/contact/contact.routes");
const leadRoutes = require("./modules/lead/lead.routes");
const activityRoutes = require("./modules/activity/activity.routes");
const emailRoutes = require("./modules/email/email.routes");
const interviewRoutes = require("./modules/interview/interview.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const notificationRoutes = require("./modules/notification/notification.routes");
const prospectRoutes = require("./modules/prospect/prospect.routes");
const outreachRoutes = require("./modules/outreach/outreach.routes");
const templateRoutes = require("./modules/template/template.routes");
const reportRoutes = require("./modules/report/report.routes");


connectDB();

const app = express();


app.use(
    cors({
        origin:"*",
        credentials:true
    })
);


app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));

// this is test 
app.get("/error", (req, res, next) => {
    next(new ApiError(400, "This is a test error"));
});

// Health check route for keep-alive pings & uptime monitoring
app.get(["/health", "/api/health"], (req, res) => {
    res.status(200).json({
        success: true,
        message: "LeadFlow CRM API is healthy and awake! 🚀",
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
    });
});

// Live Email Subsystem Diagnostic Endpoint
app.get("/api/test-email", async (req, res) => {
    const targetEmail = req.query.to || "gudducse2005@gmail.com";
    try {
        const emailService = require("./modules/email/email.service");
        const info = await emailService.sendTestEmail(targetEmail);
        res.status(200).json({
            success: true,
            message: `🎉 Email successfully delivered to ${targetEmail}!`,
            messageId: info?.messageId || "Sent",
            envUser: process.env.EMAIL_USER ? "Configured ✅" : "MISSING ❌"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "❌ Live SMTP Email Delivery Failed",
            error: err.message,
            envUser: process.env.EMAIL_USER ? "Configured ✅" : "MISSING ❌"
        });
    }
});


// routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/contacts",contactRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/prospects", prospectRoutes);
app.use("/api/outreach", outreachRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the LeadFlow API 🚀",
  })
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

app.use(errorHandler);

const http = require("http");

const {
    initSocket
} = require("./socket/socket");


// Create HTTP server
const server = http.createServer(app);


// Initialize Socket.io
initSocket(server);



const PORT = process.env.PORT || 8000;

const { startReminderCron } = require("./jobs/reminderCron");

server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    startReminderCron();
});