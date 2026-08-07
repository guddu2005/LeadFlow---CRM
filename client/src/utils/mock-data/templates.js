const templates = [
  {
    "_id": "tmp001",
    "name": "Initial LinkedIn Outreach",
    "channel": "LinkedIn",
    "type": "Initial",
    "subject": "",
    "message": "Hi {{firstName}}, I came across {{companyName}} and was impressed by your work. We help real estate businesses generate qualified leads through automation and outreach. Would you be open to a quick 15-minute conversation next week?",
    "status": "Active",
    "createdBy": "usr001",
    "updatedBy": "usr001",
    "createdAt": "2026-08-01T09:00:00Z",
    "updatedAt": "2026-08-01T09:00:00Z"
  },
  {
    "_id": "tmp002",
    "name": "Follow Up 1 - LinkedIn",
    "channel": "LinkedIn",
    "type": "Follow Up 1",
    "subject": "",
    "message": "Hi {{firstName}}, just following up on my previous message. I'd love to show how we've helped companies like {{companyName}} improve their lead generation. Let me know if you'd be interested in a short call.",
    "status": "Active",
    "createdBy": "usr001",
    "updatedBy": "usr001",
    "createdAt": "2026-08-02T09:00:00Z",
    "updatedAt": "2026-08-02T09:00:00Z"
  },
  {
    "_id": "tmp003",
    "name": "Final Follow Up",
    "channel": "LinkedIn",
    "type": "Follow Up 2",
    "subject": "",
    "message": "Hi {{firstName}}, I know you're probably busy, so this will be my last follow-up. If improving your lead generation is a priority this quarter, I'd be happy to connect whenever the timing is right.",
    "status": "Active",
    "createdBy": "usr002",
    "updatedBy": "usr002",
    "createdAt": "2026-08-03T10:00:00Z",
    "updatedAt": "2026-08-03T10:00:00Z"
  },
  {
    "_id": "tmp004",
    "name": "Cold Email Introduction",
    "channel": "Email",
    "type": "Initial",
    "subject": "Helping {{companyName}} Generate More Qualified Leads",
    "message": "Hi {{firstName}},\n\nI hope you're doing well.\n\nI noticed {{companyName}} is growing rapidly. We help real estate businesses automate prospecting and increase qualified meetings.\n\nWould you be available for a quick 15-minute call next week?\n\nBest regards,\nGuddu Kumar",
    "status": "Active",
    "createdBy": "usr001",
    "updatedBy": "usr001",
    "createdAt": "2026-08-03T14:00:00Z",
    "updatedAt": "2026-08-03T14:00:00Z"
  },
  {
    "_id": "tmp005",
    "name": "Email Follow Up",
    "channel": "Email",
    "type": "Follow Up 1",
    "subject": "Following Up",
    "message": "Hi {{firstName}},\n\nJust checking whether you had a chance to review my previous email. I'd love to discuss how we can support {{companyName}} with lead generation.\n\nLooking forward to hearing from you.",
    "status": "Active",
    "createdBy": "usr002",
    "updatedBy": "usr002",
    "createdAt": "2026-08-04T10:00:00Z",
    "updatedAt": "2026-08-04T10:00:00Z"
  },
  {
    "_id": "tmp006",
    "name": "Meeting Reminder",
    "channel": "Email",
    "type": "Follow Up 2",
    "subject": "Reminder: Scheduled Meeting",
    "message": "Hi {{firstName}},\n\nThis is a reminder about our scheduled meeting tomorrow.\n\nLooking forward to speaking with you.\n\nBest regards.",
    "status": "Active",
    "createdBy": "usr003",
    "updatedBy": "usr003",
    "createdAt": "2026-08-05T09:00:00Z",
    "updatedAt": "2026-08-05T09:00:00Z"
  },
  {
    "_id": "tmp007",
    "name": "Phone Call Script",
    "channel": "Phone",
    "type": "Initial",
    "subject": "",
    "message": "Introduce yourself, explain the purpose of the call, understand the prospect's current process, identify pain points, and request a demo meeting.",
    "status": "Active",
    "createdBy": "usr001",
    "updatedBy": "usr001",
    "createdAt": "2026-08-05T11:00:00Z",
    "updatedAt": "2026-08-05T11:00:00Z"
  },
  {
    "_id": "tmp008",
    "name": "Call Follow Up",
    "channel": "Phone",
    "type": "Follow Up 1",
    "subject": "",
    "message": "Call again, reference the previous discussion, answer questions, and confirm interest in scheduling a meeting.",
    "status": "Active",
    "createdBy": "usr002",
    "updatedBy": "usr002",
    "createdAt": "2026-08-06T10:00:00Z",
    "updatedAt": "2026-08-06T10:00:00Z"
  }
];

export default templates;
