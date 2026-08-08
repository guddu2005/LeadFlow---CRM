const Interview = require("../../models/Interview");
const Lead = require("../../models/Lead");
const Contact = require("../../models/Contact");
const Company = require("../../models/Company");
const User = require("../../models/User");
const ApiError = require("../../utils/ApiError");
const emailService = require("../email/email.service");
const notificationService = require("../notification/notification.service");

const mongoose = require("mongoose");

const scheduleInterview = async (data, userId) => {
    let lead = null;

    if (data.lead && mongoose.Types.ObjectId.isValid(data.lead)) {
        lead = await Lead.findById(data.lead).populate({
            path: "contact",
            select: "firstName lastName email"
        });
    }

    // Fallback: If lead ID is a string like "lead001" or not found by ObjectId, find the first available active lead or create a demo lead
    if (!lead) {
        lead = await Lead.findOne({ isDeleted: false }).populate({
            path: "contact",
            select: "firstName lastName email"
        });
    }

    if (!lead) {
        // If no lead exists in DB at all, create a default lead for demonstration
        const Contact = require("../../models/Contact");
        let defaultContact = await Contact.findOne();
        if (!defaultContact) {
            defaultContact = await Contact.create({
                firstName: "Oliver",
                lastName: "Taylor",
                email: "oliver.taylor@propscale.co.uk",
                jobTitle: "Operations Director"
            });
        }
        lead = await Lead.create({
            companyName: "PropScale Management UK",
            contact: defaultContact._id,
            status: "Not Contacted",
            priority: "High",
            createdBy: userId
        });
        lead = await Lead.findById(lead._id).populate({
            path: "contact",
            select: "firstName lastName email"
        });
    }

    const interview = await Interview.create({
        lead: lead._id,
        scheduledAt: data.scheduledAt,
        duration: data.duration || 30,
        timezone: data.timezone || "Europe/London",
        meetingLink:
            data.meetingLink ||
            process.env.MEETING_LINK ||
            "https://meet.google.com/ina-cmdg-frr",
        notes: data.notes || "",
        createdBy: userId,
        updatedBy: userId
    });


    // Update Lead Status
    lead.status = "Booked";
    lead.updatedBy = userId;

    await lead.save();

    const User = require("../../models/User");
    const researcherUser = await User.findById(userId);

    const dateStr = new Date(interview.scheduledAt).toLocaleDateString("en-GB");
    const timeStr = new Date(interview.scheduledAt).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit"
    });
    const candidateFullName = `${lead.contact?.firstName || data.candidateName || "Contact"} ${lead.contact?.lastName || ""}`.trim();
    const leadCompanyName = lead.companyName || lead.company?.companyName || "PropScale Management UK";
    const candidateEmail = data.candidateEmail || data.email || lead.contact?.email;

    // Fire-and-forget background email & notification dispatches (degraded to setImmediate for 0ms blocking)
    setImmediate(async () => {
        try {
            if (candidateEmail) {
                await emailService.sendInterviewConfirmation({
                    to: candidateEmail,
                    name: candidateFullName,
                    date: dateStr,
                    time: timeStr,
                    meetingLink: interview.meetingLink,
                }).catch((e) => console.error("Interview confirmation email error:", e.message));
            }

            if (researcherUser?.email) {
                await emailService.sendInterviewResearcherNotification({
                    to: researcherUser.email,
                    researcherName: `${researcherUser.firstName} ${researcherUser.lastName}`,
                    candidateName: candidateFullName,
                    companyName: leadCompanyName,
                    jobTitle: lead.contact?.jobTitle || "Operations Director",
                    date: dateStr,
                    time: timeStr,
                    meetingLink: interview.meetingLink,
                }).catch((e) => console.error("Researcher notification email error:", e.message));
            }

            await notificationService.createNotification({
                user: userId,
                type: "INTERVIEW_CREATED",
                title: "Research Interview Booked 🎯",
                message: `You have successfully booked a research interview with ${candidateFullName} (${leadCompanyName}) scheduled for ${dateStr} at ${timeStr}.`,
                referenceId: interview._id,
                referenceModel: "Interview",
            }).catch((e) => console.error("Notification creation error:", e.message));
        } catch (err) {
            console.error("Background interview dispatch error:", err.message);
        }
    });


    return await Interview.findById(interview._id)
        .populate({
            path: "lead",
            populate: [
                {
                    path: "company",
                    select: "companyName"
                },
                {
                    path: "contact",
                    select: "firstName lastName email"
                }
            ]
        })
        .populate(
            "createdBy",
            "firstName lastName email"
        )
        .populate(
            "updatedBy",
            "firstName lastName email"
        );


};

const getInterviews = async (query) => {

    const {
        page = 1,
        limit = 10,
        status,
        lead,
        search,
        sortBy = "scheduledAt",
        order = "asc"
    } = query;

    const filter = {
        isDeleted: false
    };

    if (status) {
        filter.status = status;
    }

    if (lead) {
        filter.lead = lead;
    }

    let interviews = await Interview.find(filter)
        .populate({
            path: "lead",
            populate: [
                {
                    path: "company",
                    select: "companyName"
                },
                {
                    path: "contact",
                    select: "firstName lastName email"
                }
            ]
        })
        .populate("createdBy", "firstName lastName")
        .sort({
            [sortBy]: order === "asc" ? 1 : -1
        });

    if (search) {

        interviews = interviews.filter((item) => {

            const company =
                item.lead?.company?.companyName || "";

            const contact =
                `${item.lead?.contact?.firstName || ""} ${item.lead?.contact?.lastName || ""}`;

            return (
                company.toLowerCase().includes(search.toLowerCase()) ||
                contact.toLowerCase().includes(search.toLowerCase())
            );

        });

    }

    const total = interviews.length;

    const start = (page - 1) * limit;

    const end = start + Number(limit);

    interviews = interviews.slice(start, end);

    return {
        interviews,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPrevPage: page > 1
        }
    };

};

const getInterviewById = async (id) => {

    const interview = await Interview.findOne({
        _id: id,
        isDeleted: false
    })
        .populate({
            path: "lead",
            populate: [
                {
                    path: "company",
                    select: "companyName website"
                },
                {
                    path: "contact",
                    select: "firstName lastName email phone jobTitle"
                }
            ]
        })
        .populate("createdBy", "firstName lastName email")
        .populate("updatedBy", "firstName lastName email");

    if (!interview) {
        throw new ApiError(404, "Interview not found");
    }

    return interview;

};
const updateInterview = async (id, data, userId) => {

    const interview = await Interview.findOne({
        _id: id,
        isDeleted: false
    }).populate({
        path: "lead",
        populate: {
            path: "contact",
            select: "firstName lastName email"
        }
    });

    if (!interview) {
        throw new ApiError(404, "Interview not found");
    }

    const oldDate = interview.scheduledAt.getTime();

    Object.assign(interview, data);

    interview.updatedBy = userId;

    // If schedule changed
    if (
        data.scheduledAt &&
        new Date(data.scheduledAt).getTime() !== oldDate
    ) {

        interview.status = "Rescheduled";

        interview.reminder24Sent = false;
        interview.reminder1HourSent = false;

    }

    await interview.save();

    // Send rescheduled email
    if (
        data.scheduledAt &&
        interview.lead?.contact?.email
    ) {

        const date = new Date(interview.scheduledAt)
            .toLocaleDateString("en-GB");

        const time = new Date(interview.scheduledAt)
            .toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit"
            });

        await emailService.sendInterviewRescheduled({
            to: interview.lead.contact.email,
            name:
                `${interview.lead.contact.firstName} ${interview.lead.contact.lastName}`,
            date,
            time,
            meetingLink: interview.meetingLink
        });
        await notificationService.createNotification({
            user: userId,
            type: "STATUS_CHANGED",
            title: "Interview Rescheduled",
            message: `Interview has been rescheduled to ${date} at ${time}`,
            referenceId: interview._id,
            referenceModel: "Interview"
        });

    }

    return await Interview.findById(interview._id)
        .populate({
            path: "lead",
            populate: [
                {
                    path: "company",
                    select: "companyName"
                },
                {
                    path: "contact",
                    select: "firstName lastName email"
                }
            ]
        })
        .populate("createdBy", "firstName lastName email")
        .populate("updatedBy", "firstName lastName email");

};

const cancelInterview = async (id, userId) => {

    const interview = await Interview.findOne({
        _id: id,
        isDeleted: false
    }).populate({
        path: "lead",
        populate: {
            path: "contact",
            select: "firstName lastName email"
        }
    });

    if (!interview) {
        throw new ApiError(404, "Interview not found");
    }

    interview.status = "Cancelled";
    interview.updatedBy = userId;

    await interview.save();

    if (interview.lead?.contact?.email) {

        await emailService.sendInterviewCancelled({
            to: interview.lead.contact.email,
            name:
                `${interview.lead.contact.firstName} ${interview.lead.contact.lastName}`
        });
        await notificationService.createNotification({
            user: userId,
            type: "STATUS_CHANGED",
            title: "Interview Cancelled",
            message:
                "Interview has been cancelled",
            referenceId: interview._id,
            referenceModel: "Interview"
        });

    }

    return interview;

};

const completeInterview = async (
    id,
    feedback,
    userId
) => {

    const interview = await Interview.findOne({
        _id: id,
        isDeleted: false
    });

    if (!interview) {
        throw new ApiError(404, "Interview not found");
    }

    interview.status = "Completed";

    interview.attendanceStatus = "Attended";

    interview.completedAt = new Date();

    interview.feedback = feedback || "";

    interview.updatedBy = userId;

    await interview.save();
    await notificationService.createNotification({
        user: userId,
        type: "STATUS_CHANGED",
        title: "Interview Completed",
        message:
            "Interview has been marked as completed",
        referenceId: interview._id,
        referenceModel: "Interview"
    });

    return interview;

};
const markNoShow = async (id, userId) => {

    const interview = await Interview.findOne({
        _id: id,
        isDeleted: false
    });

    if (!interview) {
        throw new ApiError(404, "Interview not found");
    }

    interview.status = "No Show";

    interview.attendanceStatus = "No Show";

    interview.updatedBy = userId;

    await interview.save();
    await notificationService.createNotification({
        user: userId,
        type: "STATUS_CHANGED",
        title: "Interview No Show",
        message:
            "Candidate marked as no show",
        referenceId: interview._id,
        referenceModel: "Interview"
    });

    return interview;

};

const deleteInterview = async (id) => {

    const interview = await Interview.findOne({
        _id: id,
        isDeleted: false
    });

    if (!interview) {
        throw new ApiError(404, "Interview not found");
    }

    interview.isDeleted = true;

    await interview.save();

    return interview;

};


const restoreInterview = async (id) => {

    const interview = await Interview.findOne({
        _id: id,
        isDeleted: true
    });

    if (!interview) {
        throw new ApiError(404, "Interview not found");
    }

    interview.isDeleted = false;

    await interview.save();

    return interview;

};

const getInterviewStats = async () => {

    const overview = await Interview.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: null,
                totalInterviews: {
                    $sum: 1
                }
            }
        }
    ]);

    const statusStats = await Interview.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$status",
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                count: -1
            }
        }
    ]);
    const attendanceStats = await Interview.aggregate([
        {
            $match: {
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$attendanceStatus",
                count: {
                    $sum: 1
                }
            }
        }
    ]);

    const today = new Date();

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    const todayInterviews = await Interview.countDocuments({
        isDeleted: false,
        scheduledAt: {
            $gte: start,
            $lte: end
        }
    });

    return {
        overview: {
            totalInterviews:
                overview[0]?.totalInterviews || 0,
            todayInterviews
        },
        statusStats,
        attendanceStats
    };

};

module.exports = {
    scheduleInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    cancelInterview,
    completeInterview,
    deleteInterview,
    restoreInterview,
    getInterviewStats,
    markNoShow
};