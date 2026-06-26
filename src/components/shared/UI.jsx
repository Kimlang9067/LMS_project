import React from 'react';
import { DS, CARD } from './ds';
import { useTheme } from '../../utils/theme';

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div style={{
      ...CARD,
      backgroundColor: isDark ? '#1e293b' : CARD.backgroundColor,
      border: `1px solid ${isDark ? '#334155' : CARD.border}`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
      <div>
        <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '800', color: isDark ? '#f1f5f9' : DS.textDark }}>{title}</h1>
        {subtitle && <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#94a3b8' : DS.textLight }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, color = DS.textDark, bg = '#f1f5f9', sub }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div style={{ ...CARD, backgroundColor: isDark ? '#1e293b' : '#ffffff', border: `1px solid ${isDark ? '#334155' : CARD.border}`, display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: '11px', fontWeight: '700', color: isDark ? '#94a3b8' : DS.textLight, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: color === DS.textDark && isDark ? '#f1f5f9' : color }}>{value}</p>
        {sub && <p style={{ margin: '2px 0 0', fontSize: '11px', color: isDark ? '#64748b' : DS.textMuted }}>{sub}</p>}
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
const BADGE_MAP = {
  active:         { bg: '#dcfce7',             text: '#166534' },
  approved:       { bg: '#dcfce7',             text: '#166534' },
  completed:      { bg: '#dcfce7',             text: '#166534' },
  deployed:       { bg: '#dcfce7',             text: '#166534' },
  verified:       { bg: '#dcfce7',             text: '#166534' },
  published:      { bg: '#dcfce7',             text: '#166534' },
  resolved:       { bg: '#dcfce7',             text: '#166534' },
  paid:           { bg: '#dcfce7',             text: '#166534' },
  shipped:        { bg: '#dcfce7',             text: '#166534' },
  activated:      { bg: '#dcfce7',             text: '#166534' },
  generated:      { bg: '#dcfce7',             text: '#166534' },
  pending:        { bg: '#fef9c3',             text: '#854d0e' },
  'on hold':      { bg: '#fef9c3',             text: '#854d0e' },
  running:        { bg: '#fef9c3',             text: '#854d0e' },
  'under review': { bg: '#fef9c3',             text: '#854d0e' },
  revised:        { bg: '#fef9c3',             text: '#854d0e' },
  suspended:      { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
  rejected:       { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
  overdue:        { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
  archived:       { bg: '#f1f5f9',             text: '#64748b' },
  closed:         { bg: '#f1f5f9',             text: '#64748b' },
  withdrawn:      { bg: '#f1f5f9',             text: '#64748b' },
};

export function Badge({ status = '' }) {
  const c = BADGE_MAP[status.toLowerCase()] ?? { bg: '#f1f5f9', text: DS.textMid };
  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: c.bg,
      color: c.text,
      fontSize: '11px',
      fontWeight: '700',
      padding: '3px 10px',
      borderRadius: '20px',
      letterSpacing: '0.3px',
    }}>
      {status}
    </span>
  );
}

// ── Buttons ───────────────────────────────────────────────────────────────────
export function PrimaryBtn({ onClick, children, style, type = 'button', disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: '#0f172a', color: '#fff', border: 'none',
        padding: '10px 20px', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ onClick, children, style, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        backgroundColor: '#f1f5f9', color: DS.textMid, border: 'none',
        padding: '10px 20px', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
        transition: 'background 0.15s',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── Form Field ────────────────────────────────────────────────────────────────
export function FormField({ label, value, onChange, type = 'text', disabled, placeholder }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const borderCol = isDark ? '#334155' : DS.cardBorder;
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: isDark ? '#94a3b8' : DS.textMid, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 14px',
          border: `1px solid ${borderCol}`, borderRadius: '8px',
          fontSize: '14px', outline: 'none', boxSizing: 'border-box',
          backgroundColor: disabled ? (isDark ? '#0f172a' : '#f8fafc') : (isDark ? '#1F2937' : '#fff'),
          color: disabled ? (isDark ? '#475569' : DS.textMuted) : (isDark ? '#f1f5f9' : DS.textDark),
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color 0.15s',
        }}
        onFocus={e  => !disabled && (e.target.style.borderColor = '#3b82f6')}
        onBlur={e   => (e.target.style.borderColor = borderCol)}
      />
    </div>
  );
}

// ── Info Row (read-only label + value) ────────────────────────────────────────
export function InfoRow({ label, value }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '13px 0', borderBottom: `1px solid ${isDark ? '#334155' : DS.cardBorder}` }}>
      <span style={{ width: '140px', flexShrink: 0, fontSize: '13px', fontWeight: '600', color: isDark ? '#94a3b8' : DS.textLight }}>{label}</span>
      <span style={{ fontSize: '14px', color: isDark ? '#f1f5f9' : DS.textDark, fontWeight: '500' }}>{value || '—'}</span>
    </div>
  );
}

// ── Data Table wrapper ────────────────────────────────────────────────────────
export function DataTable({ columns, children, footer }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div style={{ ...CARD, backgroundColor: isDark ? '#1e293b' : '#ffffff', border: `1px solid ${isDark ? '#334155' : CARD.border}`, padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderBottom: `1px solid ${isDark ? '#334155' : DS.cardBorder}` }}>
              {columns.map(col => (
                <th key={col} style={{ padding: '12px 20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: isDark ? '#cbd5e1' : DS.textLight }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
      {footer && (
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${isDark ? '#334155' : DS.cardBorder}`, backgroundColor: isDark ? '#0f172a' : '#f8fafc', fontSize: '12px', color: isDark ? '#94a3b8' : DS.textLight }}>
          {footer}
        </div>
      )}
    </div>
  );
}
