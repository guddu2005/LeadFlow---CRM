const reports = {
  "salesOverview": {
    "totalRevenue": 2850000,
    "monthlyRevenue": 475000,
    "averageDealSize": 356250,
    "closedDeals": 8,
    "wonDeals": 5,
    "lostDeals": 3,
    "winRate": 62.5
  },

  "leadAnalytics": {
    "totalLeads": 8,
    "new": 2,
    "qualified": 2,
    "proposalSent": 1,
    "negotiation": 1,
    "won": 1,
    "lost": 1
  },

  "outreachAnalytics": {
    "totalOutreachs": 8,
    "emailsSent": 4,
    "linkedinMessages": 3,
    "phoneCalls": 1,
    "opened": 2,
    "replied": 1,
    "booked": 1,
    "replyRate": 37.5,
    "bookingRate": 25
  },

  "interviewAnalytics": {
    "scheduled": 3,
    "completed": 2,
    "cancelled": 1,
    "rescheduled": 1,
    "noShow": 1,
    "completionRate": 66.67
  },

  "teamPerformance": [
    {
      "user": "Guddu Kumar",
      "companies": 4,
      "prospects": 18,
      "leads": 12,
      "meetings": 7,
      "closedDeals": 3,
      "revenue": 950000
    },
    {
      "user": "John Smith",
      "companies": 3,
      "prospects": 14,
      "leads": 10,
      "meetings": 5,
      "closedDeals": 2,
      "revenue": 820000
    },
    {
      "user": "Emily Johnson",
      "companies": 3,
      "prospects": 11,
      "leads": 8,
      "meetings": 4,
      "closedDeals": 1,
      "revenue": 560000
    }
  ],

  "monthlyRevenue": [
    {
      "month": "Jan",
      "revenue": 120000
    },
    {
      "month": "Feb",
      "revenue": 180000
    },
    {
      "month": "Mar",
      "revenue": 250000
    },
    {
      "month": "Apr",
      "revenue": 320000
    },
    {
      "month": "May",
      "revenue": 410000
    },
    {
      "month": "Jun",
      "revenue": 530000
    },
    {
      "month": "Jul",
      "revenue": 610000
    },
    {
      "month": "Aug",
      "revenue": 430000
    }
  ],

  "leadSources": [
    {
      "source": "LinkedIn",
      "count": 3
    },
    {
      "source": "Website",
      "count": 2
    },
    {
      "source": "Referral",
      "count": 2
    },
    {
      "source": "Cold Email",
      "count": 1
    }
  ],

  "conversionFunnel": [
    {
      "stage": "Prospects",
      "count": 50
    },
    {
      "stage": "Qualified",
      "count": 30
    },
    {
      "stage": "Leads",
      "count": 20
    },
    {
      "stage": "Meetings",
      "count": 12
    },
    {
      "stage": "Won",
      "count": 8
    }
  ],

  "topCompanies": [
    {
      "company": "Knight Frank",
      "value": 450000
    },
    {
      "company": "CBRE UK",
      "value": 600000
    },
    {
      "company": "Savills",
      "value": 250000
    },
    {
      "company": "Avison Young",
      "value": 850000
    }
  ],

  "recentReports": [
    {
      "id": "rep001",
      "name": "Monthly Sales Report",
      "type": "Sales",
      "generatedBy": "Guddu Kumar",
      "generatedAt": "2026-08-01T10:30:00Z"
    },
    {
      "id": "rep002",
      "name": "Lead Conversion Report",
      "type": "Lead",
      "generatedBy": "John Smith",
      "generatedAt": "2026-08-03T09:15:00Z"
    },
    {
      "id": "rep003",
      "name": "Outreach Analytics",
      "type": "Outreach",
      "generatedBy": "Emily Johnson",
      "generatedAt": "2026-08-05T02:45:00Z"
    }
  ]
};


export default reports;