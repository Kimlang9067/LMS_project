export const CLOSED_STATUSES = [
  "Approved", "Resolved", "Completed", "Paid", "Published",
  "Activated", "Deployed", "Shipped", "Verified", "Generated",
  "Archived", "Closed", "Retired", "Submitted", "Waived",
  "Withdrawn", "Released", "Rejected",
];

export const ACTION_STATUS = {
  Approve: "Approved",
  Activate: "Activated",
  Publish: "Published",
  Generate: "Generated",
  Renew: "Active",
  Paid: "Paid",
  Resolve: "Resolved",
  Verify: "Verified",
  Deploy: "Deployed",
  Submit: "Submitted",
  Ship: "Shipped",
  Complete: "Completed",
  Suspend: "Suspended",
  Archive: "Archived",
  Close: "Closed",
  Retire: "Retired",
  Hold: "On Hold",
  Waive: "Waived",
  Withdraw: "Withdrawn",
  Reject: "Rejected",
  Investigate: "Under Review",
  Restore: "Restored",
  Reopen: "Reopened",
  Release: "Released",
  Review: "Under Review",
  Resume: "Active",
  Revise: "Revised",
  "Run Now": "Running",
};

export function formatLabel(key) {
  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .trim();
}

// ── Module configurations keyed by the last URL segment ──────────────────────

export const ROLE_MODULES = {

  // Super Admin
  users: {
    title: "User Management",
    summary: "Manage all library user accounts.",
    formTitle: "Add New User",
    fields: [
      { name: "name",  label: "Full Name", placeholder: "e.g. John Doe" },
      { name: "email", label: "Email",     placeholder: "user@library.com" },
      { name: "role",  label: "Role",      placeholder: "e.g. Member" },
    ],
    columns: ["name", "email", "role", "status"],
    actions: ["Activate", "Suspend"],
    initialRecords: [
      { id: 1, name: "Alice Smith",  email: "alice@library.com", role: "Member", status: "Active",  updatedAt: "Today"     },
      { id: 2, name: "Bob Lee",      email: "bob@library.com",   role: "Member", status: "Pending", updatedAt: "Yesterday" },
    ],
  },

  admins: {
    title: "Admin Management",
    summary: "Create and manage administrator accounts.",
    formTitle: "Add New Admin",
    fields: [
      { name: "name",       label: "Full Name",   placeholder: "e.g. Jane Admin"  },
      { name: "email",      label: "Email",       placeholder: "admin@library.com" },
      { name: "department", label: "Department",  placeholder: "e.g. Operations"  },
    ],
    columns: ["name", "email", "department", "status"],
    actions: ["Activate", "Suspend"],
    initialRecords: [
      { id: 1, name: "Library Admin", email: "admin@library.com", department: "Operations", status: "Active", updatedAt: "Today" },
    ],
  },

  books: {
    title: "Book Management",
    summary: "Add and manage the book inventory.",
    formTitle: "Add New Book",
    fields: [
      { name: "title",  label: "Title",  placeholder: "e.g. Clean Code"         },
      { name: "author", label: "Author", placeholder: "e.g. Robert C. Martin"   },
      { name: "isbn",   label: "ISBN",   placeholder: "978-0-13-235088-4"       },
    ],
    columns: ["title", "author", "isbn", "status"],
    actions: ["Approve", "Archive"],
    initialRecords: [
      { id: 1, title: "Clean Code",               author: "Robert C. Martin", isbn: "978-0-13-235088-4", status: "Active", updatedAt: "Today"     },
      { id: 2, title: "The Pragmatic Programmer", author: "David Thomas",     isbn: "978-0-13-595705-9", status: "Active", updatedAt: "Yesterday" },
    ],
  },

  notifications: {
    title: "Notifications Center",
    summary: "Send and manage system-wide notifications.",
    formTitle: "New Notification",
    fields: [
      { name: "title",    label: "Title",    placeholder: "e.g. System Maintenance" },
      { name: "message",  label: "Message",  placeholder: "Notification message…"   },
      { name: "audience", label: "Audience", placeholder: "e.g. All Members"        },
    ],
    columns: ["title", "message", "audience", "status"],
    actions: ["Publish", "Archive"],
    initialRecords: [
      { id: 1, title: "Library Hours Update", message: "Updated hours for the holiday season.", audience: "All Members", status: "Published", updatedAt: "Today" },
    ],
  },

  // Administrator
  policies: {
    title: "Policy Management",
    summary: "Define and manage library policies.",
    formTitle: "New Policy",
    fields: [
      { name: "name",        label: "Policy Name", placeholder: "e.g. Borrowing Limit Policy" },
      { name: "category",    label: "Category",    placeholder: "e.g. Circulation"            },
      { name: "description", label: "Description", placeholder: "Policy details…"             },
    ],
    columns: ["name", "category", "description", "status"],
    actions: ["Approve", "Archive"],
    initialRecords: [
      { id: 1, name: "Max Borrowing Limit", category: "Circulation", description: "Members can borrow up to 5 books at a time.", status: "Active", updatedAt: "Today"      },
      { id: 2, name: "Fine Rate Policy",    category: "Fines",       description: "$0.25 per day for overdue books.",             status: "Active", updatedAt: "Last week"  },
    ],
  },

  budget: {
    title: "Budget Management",
    summary: "Track and manage library budget allocations.",
    formTitle: "New Budget Entry",
    fields: [
      { name: "category", label: "Category",    placeholder: "e.g. Book Acquisition" },
      { name: "amount",   label: "Amount ($)",  placeholder: "e.g. 5000"             },
      { name: "quarter",  label: "Quarter",     placeholder: "e.g. Q1 2026"          },
    ],
    columns: ["category", "amount", "quarter", "status"],
    actions: ["Approve", "Close"],
    initialRecords: [
      { id: 1, category: "Book Acquisition",  amount: "$12,000", quarter: "Q1 2026", status: "Approved", updatedAt: "Today"     },
      { id: 2, category: "IT Infrastructure", amount: "$8,500",  quarter: "Q1 2026", status: "Pending",  updatedAt: "Yesterday" },
    ],
  },

  reports: {
    title: "Reports & Analytics",
    summary: "Generate and review library performance reports.",
    formTitle: "Request Report",
    fields: [
      { name: "name",   label: "Report Name", placeholder: "e.g. Monthly Circulation Report" },
      { name: "type",   label: "Type",        placeholder: "e.g. Circulation, Budget"        },
      { name: "period", label: "Period",      placeholder: "e.g. June 2026"                  },
    ],
    columns: ["name", "type", "period", "status"],
    actions: ["Generate", "Archive"],
    initialRecords: [
      { id: 1, name: "Monthly Circulation", type: "Circulation", period: "May 2026",  status: "Generated", updatedAt: "Today"     },
      { id: 2, name: "Q1 Budget Summary",   type: "Budget",      period: "Q1 2026",   status: "Pending",   updatedAt: "Last week" },
    ],
  },

  // Librarian
  members: {
    title: "Member Management",
    summary: "Register and manage library member accounts.",
    formTitle: "Register Member",
    fields: [
      { name: "name",           label: "Full Name",       placeholder: "e.g. Sarah Johnson"       },
      { name: "email",          label: "Email",           placeholder: "member@example.com"        },
      { name: "membershipType", label: "Membership Type", placeholder: "e.g. Student, Faculty"    },
    ],
    columns: ["name", "email", "membershipType", "status"],
    actions: ["Activate", "Suspend"],
    initialRecords: [
      { id: 1, name: "John Student", email: "john@rupp.edu",    membershipType: "Student", status: "Active", updatedAt: "Today"     },
      { id: 2, name: "Dr. Faculty",  email: "faculty@rupp.edu", membershipType: "Faculty", status: "Active", updatedAt: "Yesterday" },
    ],
  },

  fines: {
    title: "Fines Management",
    summary: "Track and process overdue book fines.",
    formTitle: "Issue Fine",
    fields: [
      { name: "member", label: "Member Name",     placeholder: "e.g. John Student" },
      { name: "book",   label: "Book Title",      placeholder: "e.g. Clean Code"   },
      { name: "amount", label: "Fine Amount ($)", placeholder: "e.g. 2.50"         },
    ],
    columns: ["member", "book", "amount", "status"],
    actions: ["Paid", "Waive"],
    initialRecords: [
      { id: 1, member: "Alice Smith", book: "Design Patterns", amount: "$3.50", status: "Pending", updatedAt: "Today"     },
      { id: 2, member: "Bob Lee",     book: "Clean Code",      amount: "$1.25", status: "Paid",    updatedAt: "Yesterday" },
    ],
  },

};
