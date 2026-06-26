/**
 * credentialGenerator.js
 * Generates unique user IDs, system emails, and strong temporary passwords
 * for accounts created by Super Admin without manual credential entry.
 */

const ROLE_PREFIX = {
  administrator: 'ADM',
  librarian:     'LIB',
  member:        'STU',
  super_admin:   'SYS',
};

/** Strong 12-character password: upper + lower + digit + special, shuffled. */
export function generatePassword() {
  const upper   = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // exclude I, O (visually ambiguous)
  const lower   = 'abcdefghjkmnpqrstuvwxyz';  // exclude i, l, o
  const digits  = '23456789';                  // exclude 0, 1
  const special = '@#$!%*?&';
  const pool    = upper + lower + digits + special;

  // Guarantee at least one character from each group
  const chars = [
    upper  [Math.floor(Math.random() * upper.length)],
    lower  [Math.floor(Math.random() * lower.length)],
    digits [Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)],
  ];
  while (chars.length < 12) {
    chars.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  // Fisher-Yates shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

/**
 * Unique user ID in the form PREFIX-YY-NNNN
 * e.g. LIB-25-0003, STU-25-0012, ADM-25-0001
 */
export function generateUserId(role, existingAccounts = []) {
  const prefix = ROLE_PREFIX[role] || 'USR';
  const yr     = new Date().getFullYear().toString().slice(-2);
  const pattern = new RegExp(`^${prefix}-${yr}-(\\d+)$`);

  const used = existingAccounts
    .map(a => a.userId || '')
    .map(uid => { const m = uid.match(pattern); return m ? parseInt(m[1], 10) : 0; });

  const next = (Math.max(0, ...used) + 1).toString().padStart(4, '0');
  return `${prefix}-${yr}-${next}`;
}

/**
 * System email derived from full name + userId.
 * e.g. "Visal Chen" + "STU-25-0001" → visal.chen.stu250001@library.edu.kh
 */
export function generateEmail(fullName, userId) {
  const parts  = fullName.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const first  = parts[0] || 'user';
  const last   = parts.length > 1 ? parts[parts.length - 1] : '';
  const suffix = userId.toLowerCase().replace(/[^a-z0-9]/g, '');
  const base   = last ? `${first}.${last}` : first;
  return `${base}.${suffix}@library.edu.kh`;
}

/** Unique storage ID — timestamp + random suffix to avoid collisions. */
export function generateAccountId() {
  return `user-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}
