import React, { useMemo } from 'react';
import { ROLES } from '../../utils/auth';
import { useTheme } from '../../utils/theme';

// ── Data helpers ──────────────────────────────────────────────────────────────

function safeJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; }
  catch { return fallback; }
}

function useStats() {
  return useMemo(() => {
    const accounts    = safeJSON('libraryStaffAccounts', []).filter(a => a && typeof a === 'object');
    const selfMember  = safeJSON('userAccount', null);
    const circulation = safeJSON('circulation', []).filter(r => r && typeof r === 'object');

    const admins     = accounts.filter(a => a.role === ROLES.ADMINISTRATOR).length;
    const librarians = accounts.filter(a => a.role === ROLES.LIBRARIAN).length;
    const superAdmins= accounts.filter(a => a.role === ROLES.SUPER_ADMIN).length;
    // count admin-created members + self-registered member
    const adminMembers = accounts.filter(a => a.role === ROLES.MEMBER).length;
    const members    = adminMembers + (selfMember ? 1 : 0);

    const borrowed   = circulation.filter(r => r.status === 'Borrowed').length;
    const overdue    = circulation.filter(r => r.status === 'Overdue').length;
    const returned   = circulation.filter(r => r.status === 'Returned').length;
    const totalCirc  = borrowed + overdue + returned;

    // Monthly borrows (last 6 months)
    const now = new Date();
    const monthlyMap = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[key] = 0;
    }
    circulation.forEach(r => {
      if (!r.issueDate) return;
      const month = r.issueDate.slice(0, 7);
      if (month in monthlyMap) monthlyMap[month]++;
    });
    const monthlyData = Object.entries(monthlyMap).map(([key, value]) => ({
      label: new Date(key + '-01').toLocaleString('default', { month: 'short' }),
      value,
    }));

    // Category distribution (from book records in circulation)
    const catMap = {};
    circulation.forEach(r => {
      const cat = r.category || r.type || 'Book';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });
    const catData = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 6);

    // Recent activity
    const recent = [...circulation]
      .sort((a, b) => (b.issueDate || '').localeCompare(a.issueDate || ''))
      .slice(0, 8);

    return { admins, librarians, superAdmins, members, borrowed, overdue, returned, totalCirc, monthlyData, catData, recent, totalStaff: admins + librarians };
  }, []);
}

// ── SVG Bar Chart ─────────────────────────────────────────────────────────────

function BarChart({ data, color = '#3b82f6', height = 160, isDark }) {
  if (!data.length) return <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>No data</p>;
  const max = Math.max(...data.map(d => d.value), 1);
  const W = 400, H = height, padB = 28, padT = 20, barW = Math.floor((W - 20) / data.length);

  return (
    <svg viewBox={`0 0 ${W} ${H + padB + padT}`} style={{ width: '100%' }} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(r => {
        const y = padT + H - r * H;
        return (
          <g key={r}>
            <line x1={10} y1={y} x2={W - 10} y2={y} stroke={isDark ? '#334155' : '#f1f5f9'} strokeWidth="1" />
            <text x={6} y={y + 4} fontSize="9" fill="#94a3b8" textAnchor="end">{Math.round(max * r)}</text>
          </g>
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const barH   = Math.max((d.value / max) * H, d.value > 0 ? 4 : 0);
        const x      = 14 + i * barW + (barW - Math.min(barW - 6, 36)) / 2;
        const bw     = Math.min(barW - 6, 36);
        const y      = padT + H - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={barH} fill={color} rx="4" opacity="0.85" />
            {d.value > 0 && (
              <text x={x + bw / 2} y={y - 5} textAnchor="middle" fontSize="9" fill={isDark ? '#94a3b8' : '#475569'} fontWeight="600">{d.value}</text>
            )}
            <text x={x + bw / 2} y={padT + H + padB - 6} textAnchor="middle" fontSize="9" fill="#64748b">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── SVG Donut Chart ───────────────────────────────────────────────────────────

const DONUT_COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6'];

function DonutChart({ slices, isDark }) {
  const total = slices.reduce((s, d) => s + d[1], 0) || 1;
  const R = 70, cx = 90, cy = 90, strokeW = 28;
  let offset = 0;
  const circumference = 2 * Math.PI * R;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ flexShrink: 0 }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={isDark ? '#1e293b' : '#f1f5f9'} strokeWidth={strokeW} />
        {slices.map(([label, value], i) => {
          const pct  = value / total;
          const dash = pct * circumference;
          const gap  = circumference - dash;
          const el   = (
            <circle
              key={i}
              cx={cx} cy={cy} r={R}
              fill="none"
              stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
              strokeWidth={strokeW}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset * circumference + circumference * 0.25}
              style={{ transition: 'stroke-dasharray 0.4s' }}
            />
          );
          offset += pct;
          return el;
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="800" fill={isDark ? '#f1f5f9' : '#0f172a'}>{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill={isDark ? '#94a3b8' : '#64748b'}>Total</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {slices.map(([label, value], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: '#475569', flex: 1 }}>{label}</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a' }}>{value}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>({Math.round(value / total * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, bg, color, isDark }) {
  return (
    <div style={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '700', color: isDark ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color }}>{value}</p>
      </div>
    </div>
  );
}

// ── Chart Card wrapper ────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children, isDark }) {
  return (
    <div style={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '12px', padding: '24px' }}>
      <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a' }}>{title}</h3>
      {subtitle && <p style={{ margin: '0 0 20px', fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b' }}>{subtitle}</p>}
      {!subtitle && <div style={{ marginBottom: '20px' }} />}
      {children}
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    Borrowed: { bg: '#dbeafe', color: '#1d4ed8' },
    Overdue:  { bg: '#fee2e2', color: '#991b1b' },
    Returned: { bg: '#dcfce7', color: '#166534' },
  };
  const c = map[status] || { bg: '#f1f5f9', color: '#475569' };
  return (
    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', backgroundColor: c.bg, color: c.color, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ReportsDashboard() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { admins, librarians, superAdmins, members, borrowed, overdue, returned, totalCirc, monthlyData, catData, recent, totalStaff } = useStats();

  const circulationSlices = [
    ['Active Borrows', borrowed],
    ['Overdue',        overdue],
    ['Returned',       returned],
  ].filter(([, v]) => v > 0);

  const accountSlices = [
    ['Super Admin',    superAdmins],
    ['Administrator',  admins],
    ['Librarian',      librarians],
    ['User',           members],
  ].filter(([, v]) => v > 0);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: isDark ? '#f1f5f9' : '#0f172a' }}>Reports & Analytics</h2>
        <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>Live overview of library performance and account statistics.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard label="Users"         value={members}     icon="👥" bg="#ede9fe" color="#5b21b6" isDark={isDark} />
        <StatCard label="Librarians"    value={librarians}  icon="📚" bg="#d1fae5" color="#065f46" isDark={isDark} />
        <StatCard label="Administrators"value={admins}      icon="🛡️"  bg="#dbeafe" color="#1d4ed8" isDark={isDark} />
        <StatCard label="Active Borrows"value={borrowed}    icon="📖" bg="#fef3c7" color="#92400e" isDark={isDark} />
        <StatCard label="Overdue"       value={overdue}     icon="⚠️"  bg="#fee2e2" color="#991b1b" isDark={isDark} />
        <StatCard label="Returned"      value={returned}    icon="✅" bg="#dcfce7" color="#166534" isDark={isDark} />
        <StatCard label="Total Circulat."value={totalCirc}  icon="🔄" bg="#e0f2fe" color="#0369a1" isDark={isDark} />
        <StatCard label="Staff Total"   value={totalStaff}  icon="👤" bg="#f0fdf4" color="#15803d" isDark={isDark} />
      </div>

      {/* Charts row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        <ChartCard
          title="Monthly Borrowing Activity"
          subtitle="Number of books borrowed per month (last 6 months)"
          isDark={isDark}
        >
          <BarChart data={monthlyData} color="#6366f1" height={150} isDark={isDark} />
        </ChartCard>

        <ChartCard
          title="Circulation Status Breakdown"
          subtitle="Current distribution of all loan records"
          isDark={isDark}
        >
          {circulationSlices.length > 0
            ? <DonutChart slices={circulationSlices} isDark={isDark} />
            : <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>No circulation records yet.</p>
          }
        </ChartCard>

      </div>

      {/* Charts row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        <ChartCard
          title="Account Distribution"
          subtitle="Breakdown of all system accounts by role"
          isDark={isDark}
        >
          <DonutChart slices={accountSlices} isDark={isDark} />
        </ChartCard>

        {catData.length > 0 ? (
          <ChartCard
            title="Top Borrowed Categories"
            subtitle="Most frequently borrowed book types"
            isDark={isDark}
          >
            <BarChart data={catData.map(([label, value]) => ({ label: label.slice(0, 8), value }))} color="#10b981" height={150} isDark={isDark} />
          </ChartCard>
        ) : (
          <ChartCard
            title="Borrowing by Role"
            subtitle="Staff vs. Member borrowing comparison"
            isDark={isDark}
          >
            <BarChart
              data={[
                { label: 'Users',    value: members   },
                { label: 'Libr.',    value: librarians },
                { label: 'Admin',    value: admins     },
              ]}
              color="#f59e0b"
              height={150}
              isDark={isDark}
            />
          </ChartCard>
        )}

      </div>

      {/* Recent Activity */}
      <ChartCard title="Recent Circulation Activity" subtitle="Latest borrowing and return records" isDark={isDark}>
        {recent.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '32px 0' }}>
            No circulation records yet. When members borrow books, they will appear here.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
                  {['Book', 'Borrower', 'Issue Date', 'Due Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '11px', fontWeight: '700', color: isDark ? '#CBD5E1' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((r, i) => (
                  <tr key={r.id ?? i} style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`, backgroundColor: i % 2 === 0 ? (isDark ? '#1e293b' : '#fff') : (isDark ? '#162032' : '#fafafa') }}>
                    <td style={{ padding: '10px 14px', color: isDark ? '#f1f5f9' : '#0f172a', fontWeight: '500', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.book || r.title || '—'}
                    </td>
                    <td style={{ padding: '10px 14px', color: isDark ? '#CBD5E1' : '#334155' }}>{r.user || r.borrower || '—'}</td>
                    <td style={{ padding: '10px 14px', color: isDark ? '#94a3b8' : '#64748b', fontSize: '13px' }}>{r.issueDate || '—'}</td>
                    <td style={{ padding: '10px 14px', color: isDark ? '#94a3b8' : '#64748b', fontSize: '13px' }}>{r.returnDate || r.dueDate || '—'}</td>
                    <td style={{ padding: '10px 14px' }}><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>
    </div>
  );
}
