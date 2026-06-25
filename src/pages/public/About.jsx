import React from "react";

const staff = [
  { name: "Ph.D. Nguon Nuongswayumphou", role: "FrontEnd Development" },
  { name: "Ph.D. Cheat Kimlang", role: "Document Writer" },
  { name: "Ph.D. Phoeut Visot", role: "BackEnd Development" },
  { name: "Ph.D. Chen Fouchea", role: "Testing" },
  { name: "Ph.D. Cheat Kimly", role: "Testing" },
];

export default function About() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>About the Library</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Learn about our mission, history, and staff.</p>
      </div>

      {/* Mission card */}
      <div style={{ ...S.card, marginBottom: '16px' }}>
        <h3 style={S.cardTitle}>📚 Our Mission</h3>
        <p style={{ margin: 0, color: '#475569', lineHeight: '1.7', fontSize: '14px' }}>
          We provide access to knowledge, books, journals, and digital resources
          for students, researchers, and lifelong learners.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
        {[
          { value: '2.4M+', label: 'Books & Resources' },
          { value: '150K+', label: 'Members' },
          { value: '24/7',  label: 'Digital Access' },
        ].map(stat => (
          <div key={stat.label} style={{ ...S.card, textAlign: 'center', padding: '24px' }}>
            <h2 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>{stat.value}</h2>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* History card */}
      <div style={{ ...S.card, marginBottom: '24px' }}>
        <h3 style={S.cardTitle}>🏛 Library History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            '500 BC — Library Founded',
            '2030 — Expansion Wing Opened',
            '2050 — Digital Repository Launched',
          ].map(entry => (
            <p key={entry} style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.7' }}>{entry}</p>
          ))}
        </div>
      </div>

      {/* Staff */}
      <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>👥 Staffs Team</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {staff.map(member => (
          <div key={member.name} style={S.card}>
            <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{member.name}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const S = {
  card: {
    backgroundColor: '#fff', borderRadius: '12px',
    border: '1px solid #e2e8f0', padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  cardTitle: { margin: '0 0 12px', fontSize: '16px', fontWeight: '700', color: '#0f172a' },
};
