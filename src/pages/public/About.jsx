import React from 'react';
import { useTheme } from '../../utils/theme';

const TEAM = [
  { name: 'Ph.D. Nguon Nuongswayumphou', role: 'Frontend Developer',               photo: '/team/swayumphou.jpg', color: '#6366f1' },
  { name: 'Ph.D. Phoeut Visot',          role: 'Backend Developer',                photo: '/team/visot.png',     color: '#10b981' },
  { name: 'Ph.D. Chen Fouchea',          role: 'Project Manager',                  photo: '/team/fouchea.png',   color: '#f59e0b' },
  { name: 'Ph.D. Cheat Kimlang',         role: 'API Developer',                    photo: '/team/kimlang.png',   color: '#3b82f6' },
  { name: 'Ph.D. Cheat Kimly',           role: 'System Preparation & Deployment',  photo: '/team/kimly.jpg',     color: '#8b5cf6' },
];

const GOALS = [
  { icon: '✂️', text: 'Reduce manual work and paper-based record keeping' },
  { icon: '🎯', text: 'Improve accuracy and consistency in data management' },
  { icon: '⚡', text: 'Speed up the book borrowing and returning process' },
  { icon: '🌐', text: 'Make information easy to access for students and staff' },
];

const ROLES_INFO = [
  { role: 'Super Admin',    color: '#5b21b6', bg: '#ede9fe', desc: 'Full system oversight, user management, and all configurations' },
  { role: 'Administrator',  color: '#1d4ed8', bg: '#dbeafe', desc: 'Budget control, policy management, and analytics reporting' },
  { role: 'Librarian',      color: '#065f46', bg: '#d1fae5', desc: 'Catalog management, circulation desk, and member accounts' },
  { role: 'Member',         color: '#b45309', bg: '#fef3c7', desc: 'Browse the catalog, borrow books, and manage personal loans' },
];

const TIMELINE = [
  { year: 'Before Digital', label: 'Manual Records Era', desc: 'Library operations relied entirely on paper registers, hand-written borrowing cards, and manual tracking. Records were slow, error-prone, and difficult to search.' },
  { year: 'The Challenge', label: 'Growing Complexity', desc: 'As the number of books, members, and transactions increased, manual methods could no longer keep up. Lost records, incorrect data, and slow processing became everyday problems.' },
  { year: 'The Solution', label: 'Digital Transformation', desc: 'The Library Management System was designed and developed to replace traditional manual methods with a modern, role-based digital platform that centralises all library activities.' },
  { year: 'Today',         label: 'Smarter Library Operations', desc: 'The system now supports four roles — Super Admin, Administrator, Librarian, and Member — with real-time borrowing records, automated fine tracking, and a full digital catalog.' },
];

const STATS = [
  { value: '220+', label: 'Books in Catalog',    icon: '📚' },
  { value: '4',    label: 'User Roles',           icon: '👥' },
  { value: '24/7', label: 'Digital Access',       icon: '🌐' },
  { value: '100%', label: 'Paperless Workflow',   icon: '♻️' },
];

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bg    = isDark ? '#0f172a' : '#f8fafc';
  const card  = isDark ? '#1e293b' : '#ffffff';
  const bord  = isDark ? '#334155' : '#e2e8f0';
  const text  = isDark ? '#f1f5f9' : '#0f172a';
  const sub   = isDark ? '#94a3b8' : '#64748b';
  const mid   = isDark ? '#cbd5e1' : '#475569';

  const Card = ({ children, style = {} }) => (
    <div style={{ backgroundColor: card, borderRadius: '14px', border: `1px solid ${bord}`, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', ...style }}>
      {children}
    </div>
  );

  return (
    <div style={{ maxWidth: '860px', fontFamily: 'system-ui, sans-serif', color: text }}>

      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
            📖
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: text }}>About Our Library System</h1>
            <p style={{ margin: '3px 0 0', fontSize: '14px', color: sub }}>History, mission, and the team behind the platform.</p>
          </div>
        </div>
        <div style={{ height: '3px', borderRadius: '3px', background: 'linear-gradient(90deg, #6366f1, #3b82f6, #06b6d4)', maxWidth: '120px' }} />
      </div>

      {/* ── Overview ──────────────────────────────────────────────────────────── */}
      <Card style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 14px', fontSize: '18px', fontWeight: '800', color: text }}>🏛 System Overview</h2>
        <p style={{ margin: '0 0 14px', fontSize: '14px', color: mid, lineHeight: '1.8' }}>
          Our <strong style={{ color: text }}>Library Management System</strong> was created to improve the way libraries manage books, users,
          and borrowing activities. In the past, library work was done manually using paper records and registers.
          This process was slow, time-consuming, and often caused errors such as lost records, incorrect data,
          and difficulty in tracking borrowed books.
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: mid, lineHeight: '1.8' }}>
          As technology advanced, the need for a digital solution became essential. The system was developed to
          replace traditional manual methods with a modern, efficient, and user-friendly platform — helping librarians
          and administrators manage all library activities in one centralised place.
        </p>
      </Card>

      {/* ── Stats row ─────────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {STATS.map(s => (
          <Card key={s.label} style={{ textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>{s.icon}</div>
            <p style={{ margin: '0 0 4px', fontSize: '26px', fontWeight: '800', color: text }}>{s.value}</p>
            <p style={{ margin: 0, fontSize: '12px', color: sub, fontWeight: '600' }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {/* ── History Timeline ──────────────────────────────────────────────────── */}
      <Card style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 24px', fontSize: '18px', fontWeight: '800', color: text }}>📅 System History</h2>
        <div style={{ position: 'relative', paddingLeft: '28px' }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', backgroundColor: isDark ? '#334155' : '#e2e8f0', borderRadius: '2px' }} />
          {TIMELINE.map((item, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: i < TIMELINE.length - 1 ? '28px' : 0 }}>
              {/* Dot */}
              <div style={{ position: 'absolute', left: '-24px', top: '4px', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: i === TIMELINE.length - 1 ? '#6366f1' : (isDark ? '#334155' : '#e2e8f0'), border: `2px solid ${i === TIMELINE.length - 1 ? '#6366f1' : (isDark ? '#475569' : '#cbd5e1')}`, flexShrink: 0 }} />
              <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: '700', color: '#6366f1', backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : '#ede9fe', padding: '2px 10px', borderRadius: '20px', marginBottom: '6px' }}>
                {item.year}
              </div>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: text }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: '13px', color: mid, lineHeight: '1.7' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Goals ─────────────────────────────────────────────────────────────── */}
      <Card style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: text }}>🎯 Main Goals</h2>
        <p style={{ margin: '0 0 20px', fontSize: '14px', color: sub }}>The main goals of this system are to:</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '12px' }}>
          {GOALS.map((g, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '10px', border: `1px solid ${bord}` }}>
              <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{g.icon}</span>
              <p style={{ margin: 0, fontSize: '14px', color: mid, lineHeight: '1.6', fontWeight: '500' }}>{g.text}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Supported Roles ───────────────────────────────────────────────────── */}
      <Card style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: text }}>👤 Supported Roles</h2>
        <p style={{ margin: '0 0 20px', fontSize: '14px', color: sub }}>
          The system supports different roles, each with specific permissions to ensure smooth and organised operations.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {ROLES_INFO.map(r => (
            <div key={r.role} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderRadius: '10px', border: `1px solid ${bord}` }}>
              <span style={{ display: 'inline-block', backgroundColor: r.bg, color: r.color, fontSize: '12px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', flexShrink: 0, minWidth: '110px', textAlign: 'center' }}>
                {r.role}
              </span>
              <p style={{ margin: 0, fontSize: '14px', color: mid }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Closing statement ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: isDark ? '#162032' : '#eff6ff', border: `1px solid ${isDark ? '#1e3a5f' : '#bfdbfe'}`, borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
        <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#93c5fd' : '#1d4ed8', lineHeight: '1.8', fontStyle: 'italic' }}>
          "This project represents a step toward <strong>digital transformation</strong> in library services,
          making learning resources more accessible and management more efficient for everyone — from members
          to administrators."
        </p>
      </div>

      {/* ── Development Team ──────────────────────────────────────────────────── */}
      <div>
        <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: text }}>👥 Development Team</h2>
        <p style={{ margin: '0 0 20px', fontSize: '14px', color: sub }}>The people who built and maintain this system.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '16px' }}>
          {TEAM.map(member => {
            const initials = member.name
              .replace(/^Ph\.D\.\s*/i, '')
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map(w => w[0].toUpperCase())
              .join('');
            return (
              <Card key={member.name} style={{ textAlign: 'center', padding: '24px 16px' }}>
                {/* Photo with initials fallback */}
                <div style={{ position: 'relative', width: '88px', height: '88px', margin: '0 auto 14px' }}>
                  <img
                    src={member.photo}
                    alt={member.name}
                    onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                    style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', border: `3px solid ${bord}`, display: 'block' }}
                  />
                  {/* Initials fallback (hidden until img fails) */}
                  <div style={{ display: 'none', width: '88px', height: '88px', borderRadius: '50%', backgroundColor: member.color, alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '800', fontSize: '26px', border: `3px solid ${bord}`, position: 'absolute', top: 0, left: 0 }}>
                    {initials}
                  </div>
                </div>
                <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '700', color: text, lineHeight: '1.4' }}>{member.name}</p>
                <span style={{ display: 'inline-block', backgroundColor: isDark ? '#334155' : '#f1f5f9', color: sub, fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px' }}>
                  {member.role}
                </span>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}
