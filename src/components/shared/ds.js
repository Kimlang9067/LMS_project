// ── Design System Tokens ──────────────────────────────────────────────────────
// Single source of truth for all visual constants across all roles.

export const DS = {
  // Sidebar
  sidebarBg:       '#000000',
  sidebarWidth:    '240px',
  navColor:        '#94a3b8',
  navHoverBg:      '#161616',
  navHoverColor:   '#ffffff',
  navActiveBg:     'rgba(0,204,255,0.08)',
  navActiveColor:  '#00ccff',
  iconColor:       '#6b7280',
  iconActiveColor: '#ffffff',
  logoutColor:     '#ef4444',
  logoutHoverBg:   'rgba(239,68,68,0.1)',
  logoSystemColor: '#ef4444',

  // Content
  contentBg:    '#f4f6f9',
  topbarBg:     '#ffffff',
  topbarBorder: '#e2e8f0',
  topbarHeight: '70px',

  // Typography
  font:      'system-ui, -apple-system, sans-serif',
  textDark:  '#0f172a',
  textMid:   '#475569',
  textLight: '#64748b',
  textMuted: '#94a3b8',

  // Cards
  cardBg:     '#ffffff',
  cardBorder: '#e2e8f0',
  cardRadius: '12px',
  cardShadow: '0 1px 4px rgba(0,0,0,0.06)',
  cardPad:    '24px',
};

// Shared card style object — spread into any container style
export const CARD = {
  backgroundColor: DS.cardBg,
  border:          `1px solid ${DS.cardBorder}`,
  borderRadius:    DS.cardRadius,
  boxShadow:       DS.cardShadow,
  padding:         DS.cardPad,
};

// Base nav button / link style (used inside AppLayout sidebar)
export const NAV_BASE = {
  color:          DS.navColor,
  background:     'none',
  border:         'none',
  padding:        '12px 14px',
  borderRadius:   '8px',
  fontSize:       '15px',
  fontWeight:     '600',
  display:        'flex',
  alignItems:     'center',
  gap:            '12px',
  cursor:         'pointer',
  width:          '100%',
  textAlign:      'left',
  textDecoration: 'none',
  transition:     'background 0.15s, color 0.15s',
};
