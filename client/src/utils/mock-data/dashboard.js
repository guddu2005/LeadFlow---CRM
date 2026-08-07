const dashboard = {
  "overview": {
    "totalCompanies": 10,
    "totalContacts": 10,
    "totalProspects": 8,
    "totalLeads": 8,
    "totalOutreachs": 8,
    "totalInterviews": 8,
    "conversionRate": 62.5,
    "replyRate": 37.5,
    "bookingRate": 25
  },

  "pipeline": [
    {
      "stage": "New",
      "count": 2
    },
    {
      "stage": "Qualified",
      "count": 2
    },
    {
      "stage": "Proposal Sent",
      "count": 1
    },
    {
      "stage": "Negotiation",
      "count": 1
    },
    {
      "stage": "Won",
      "count": 1
    },
    {
      "stage": "Lost",
      "count": 1
    }
  ],

  "outreachChannels": [
    {
      "channel": "LinkedIn",
      "count": 3
    },
    {
      "channel": "Email",
      "count": 4
    },
    {
      "channel": "Phone",
      "count": 1
    }
  ],

  "outreachStatus": [
    {
      "status": "Scheduled",
      "count": 1
    },
    {
      "status": "Sent",
      "count": 2
    },
    {
      "status": "Opened",
      "count": 2
    },
    {
      "status": "Replied",
      "count": 1
    },
    {
      "status": "Booked",
      "count": 1
    },
    {
      "status": "Cancelled",
      "count": 1
    }
  ],

  "interviewStatus": [
    {
      "status": "Scheduled",
      "count": 3
    },
    {
      "status": "Completed",
      "count": 2
    },
    {
      "status": "Cancelled",
      "count": 1
    },
    {
      "status": "No Show",
      "count": 1
    },
    {
      "status": "Rescheduled",
      "count": 1
    }
  ],

  "monthlyLeads": [
    {
      "month": "Jan",
      "count": 8
    },
    {
      "month": "Feb",
      "count": 12
    },
    {
      "month": "Mar",
      "count": 18
    },
    {
      "month": "Apr",
      "count": 22
    },
    {
      "month": "May",
      "count": 28
    },
    {
      "month": "Jun",
      "count": 34
    },
    {
      "month": "Jul",
      "count": 39
    },
    {
      "month": "Aug",
      "count": 47
    }
  ],

  "recentActivities": [
    {
      "id": 1,
      "type": "Lead",
      "title": "New Lead Created",
      "description": "Knight Frank converted to Lead.",
      "time": "5 minutes ago"
    },
    {
      "id": 2,
      "type": "Interview",
      "title": "Interview Scheduled",
      "description": "Meeting with Savills.",
      "time": "30 minutes ago"
    },
    {
      "id": 3,
      "type": "Outreach",
      "title": "Email Replied",
      "description": "CBRE UK replied to outreach.",
      "time": "1 hour ago"
    },
    {
      "id": 4,
      "type": "Company",
      "title": "Company Added",
      "description": "Avison Young added.",
      "time": "Yesterday"
    }
  ],

  "topPerformers": [
    {
      "user": "Guddu Kumar",
      "leads": 18,
      "meetings": 10,
      "conversionRate": 64
    },
    {
      "user": "John Smith",
      "leads": 15,
      "meetings": 8,
      "conversionRate": 58
    },
    {
      "user": "Emily Johnson",
      "leads": 11,
      "meetings": 5,
      "conversionRate": 49
    }
  ],

  "upcomingInterviews": [
    {
      "company": "Knight Frank",
      "contact": "James Anderson",
      "date": "2026-08-10",
      "time": "10:00 AM"
    },
    {
      "company": "Savills",
      "contact": "Oliver Brown",
      "date": "2026-08-11",
      "time": "02:30 PM"
    },
    {
      "company": "CBRE UK",
      "contact": "George Martin",
      "date": "2026-08-12",
      "time": "09:30 AM"
    }
  ]
};


export default dashboard;
