const notifications = [
  {
    "_id": "not001",
    "user": "usr001",
    "type": "COMPANY_CREATED",
    "title": "Company Added",
    "message": "Knight Frank has been added successfully.",
    "referenceId": "cmp001",
    "referenceModel": "Company",
    "isRead": false,
    "createdAt": "2026-08-01T09:30:00Z"
  },
  {
    "_id": "not002",
    "user": "usr001",
    "type": "CONTACT_CREATED",
    "title": "New Contact",
    "message": "James Anderson has been added as a contact.",
    "referenceId": "con001",
    "referenceModel": "Contact",
    "isRead": true,
    "createdAt": "2026-08-01T10:15:00Z"
  },
  {
    "_id": "not003",
    "user": "usr002",
    "type": "PROSPECT_CREATED",
    "title": "Prospect Created",
    "message": "New prospect created for Savills.",
    "referenceId": "pro002",
    "referenceModel": "Prospect",
    "isRead": false,
    "createdAt": "2026-08-02T11:00:00Z"
  },
  {
    "_id": "not004",
    "user": "usr003",
    "type": "LEAD_CREATED",
    "title": "Lead Converted",
    "message": "CBRE UK prospect has been converted into a lead.",
    "referenceId": "lead003",
    "referenceModel": "Lead",
    "isRead": false,
    "createdAt": "2026-08-03T09:20:00Z"
  },
  {
    "_id": "not005",
    "user": "usr001",
    "type": "OUTREACH_CREATED",
    "title": "Outreach Scheduled",
    "message": "LinkedIn outreach scheduled successfully.",
    "referenceId": "out001",
    "referenceModel": "Outreach",
    "isRead": true,
    "createdAt": "2026-08-03T10:00:00Z"
  },
  {
    "_id": "not006",
    "user": "usr002",
    "type": "OUTREACH_UPDATED",
    "title": "Prospect Replied",
    "message": "Savills replied to your email.",
    "referenceId": "out003",
    "referenceModel": "Outreach",
    "isRead": false,
    "createdAt": "2026-08-04T08:45:00Z"
  },
  {
    "_id": "not007",
    "user": "usr003",
    "type": "INTERVIEW_CREATED",
    "title": "Interview Scheduled",
    "message": "Interview scheduled with CBRE UK.",
    "referenceId": "int003",
    "referenceModel": "Interview",
    "isRead": false,
    "createdAt": "2026-08-05T09:00:00Z"
  },
  {
    "_id": "not008",
    "user": "usr002",
    "type": "INTERVIEW_COMPLETED",
    "title": "Interview Completed",
    "message": "Interview with Savills completed successfully.",
    "referenceId": "int002",
    "referenceModel": "Interview",
    "isRead": true,
    "createdAt": "2026-08-11T15:45:00Z"
  },
  {
    "_id": "not009",
    "user": "usr001",
    "type": "MEETING_REMINDER",
    "title": "Meeting Reminder",
    "message": "Interview with Knight Frank starts in 30 minutes.",
    "referenceId": "int001",
    "referenceModel": "Interview",
    "isRead": false,
    "createdAt": "2026-08-10T09:30:00Z"
  },
  {
    "_id": "not010",
    "user": "usr003",
    "type": "REPORT_GENERATED",
    "title": "Report Ready",
    "message": "Monthly outreach report has been generated.",
    "referenceId": null,
    "referenceModel": null,
    "isRead": true,
    "createdAt": "2026-08-12T08:00:00Z"
  },
  {
    "_id": "not011",
    "user": "usr002",
    "type": "LEAD_WON",
    "title": "Lead Won 🎉",
    "message": "Avison Young deal has been marked as Won.",
    "referenceId": "lead007",
    "referenceModel": "Lead",
    "isRead": false,
    "createdAt": "2026-08-13T11:10:00Z"
  },
  {
    "_id": "not012",
    "user": "usr001",
    "type": "SYSTEM",
    "title": "Welcome",
    "message": "Welcome to LeadFlow CRM.",
    "referenceId": null,
    "referenceModel": null,
    "isRead": true,
    "createdAt": "2026-08-01T08:00:00Z"
  }
];


export default notifications;