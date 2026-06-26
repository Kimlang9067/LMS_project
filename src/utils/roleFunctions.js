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

  // ── Super Admin exclusive modules ────────────────────────────────────────────

  catalog: {
    title: "Books & Catalog",
    summary: "Add, edit, and manage the full library catalog of books and resources.",
    formTitle: "Add Book",
    fields: [
      { name: "title",     label: "Title",       placeholder: "e.g. Clean Code"           },
      { name: "author",    label: "Author",       placeholder: "e.g. Robert C. Martin"     },
      { name: "isbn",      label: "ISBN",         placeholder: "978-0-13-235088-4"         },
      { name: "category",  label: "Category",     placeholder: "e.g. Software Engineering" },
    ],
    columns: ["title", "author", "isbn", "category"],
    actions: ["Approve", "Archive"],
    initialRecords: [
      { id: 1, title: "Clean Code",               author: "Robert C. Martin", isbn: "978-0-13-235088-4", category: "Software Engineering", status: "Active", updatedAt: "Today"     },
      { id: 2, title: "The Pragmatic Programmer", author: "David Thomas",     isbn: "978-0-13-595705-9", category: "Software Engineering", status: "Active", updatedAt: "Yesterday" },
      { id: 3, title: "Sapiens",                  author: "Yuval Noah Harari",isbn: "978-0-06-231609-7", category: "History",              status: "Active", updatedAt: "Last week" },
    ],
  },

  settings: {
    title: "System Settings",
    summary: "Configure global system preferences, integrations, and operational parameters.",
    formTitle: "Add Setting",
    fields: [
      { name: "key",         label: "Setting Key",   placeholder: "e.g. max_borrow_days"  },
      { name: "value",       label: "Value",         placeholder: "e.g. 14"               },
      { name: "description", label: "Description",   placeholder: "Setting description…"  },
    ],
    columns: ["key", "value", "description"],
    actions: ["Activate", "Archive"],
    initialRecords: [
      { id: 1, key: "max_borrow_days",  value: "14",    description: "Maximum number of days a book can be borrowed.",  status: "Active", updatedAt: "Today"    },
      { id: 2, key: "fine_per_day",     value: "$0.25", description: "Fine charged per day for overdue books.",         status: "Active", updatedAt: "Today"    },
      { id: 3, key: "max_books_limit",  value: "5",     description: "Maximum books a member can borrow at one time.",  status: "Active", updatedAt: "Today"    },
      { id: 4, key: "renewal_limit",    value: "2",     description: "Maximum number of times a loan can be renewed.",  status: "Active", updatedAt: "Last week"},
    ],
  },

  // ── Shared modules ────────────────────────────────────────────────────────────

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
