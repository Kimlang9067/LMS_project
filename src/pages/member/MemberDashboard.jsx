import React from 'react';
import { useNavigate } from 'react-router';
import { Card, StatCard, Badge, PrimaryBtn } from '../../components/shared/UI';
import { getCirculationRecords, processExpiredLoans, getActiveLoans } from '../../utils/circulation';
import { useTheme } from '../../utils/theme';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const savedUser = localStorage.getItem('userAccount');
  const user = savedUser ? JSON.parse(savedUser) : { fullName: 'Member', username: 'member' };

  const records     = processExpiredLoans(getCirculationRecords());
  const userName    = user.fullName || user.username;
  const userRecords = records.filter(r => r.user === userName);
  const activeLoans = getActiveLoans(userRecords);
  const overdue     = activeLoans.filter(r => r.returnDate && new Date() > new Date(r.returnDate));

  return (
    <div style={{ maxWidth: '960px' }}>

      {/* Welcome */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '800', color: isDark ? '#f1f5f9' : '#0f172a' }}>
          Welcome back, {user.fullName} 👋
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
          Here's an overview of your library account.
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <StatCard
          label="Books Borrowed"
          value={activeLoans.length}
          icon="📚"
          bg="#eff6ff"
          color="#1d4ed8"
        />
        <StatCard
          label="Overdue"
          value={overdue.length}
          icon="⚠️"
          bg={overdue.length > 0 ? '#fee2e2' : '#f1f5f9'}
          color={overdue.length > 0 ? '#b91c1c' : '#64748b'}
        />
        <StatCard
          label="Membership"
          value="Active"
          icon="✓"
          bg="#dcfce7"
          color="#166534"
          sub="Library Member"
        />
      </div>

      {/* Active loans table */}
      <Card style={{ marginBottom: '24px', padding: 0, overflow: 'hidden', backgroundColor: isDark ? '#1e293b' : '#fff' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDark ? '#1e293b' : '#fff' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a' }}>Currently Borrowed</h2>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: isDark ? '#94a3b8' : '#64748b' }}>
              {activeLoans.length} active loan{activeLoans.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/user/profile')}
            style={{ fontSize: '13px', fontWeight: '600', color: isDark ? '#94a3b8' : '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            View all →
          </button>
        </div>

        {activeLoans.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ margin: 0, fontSize: '32px', marginBottom: '12px' }}>📭</p>
            <p style={{ margin: 0, fontSize: '15px', color: isDark ? '#64748b' : '#94a3b8' }}>No books currently borrowed.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
                {['Book', 'Due Date', 'Status'].map(col => (
                  <th key={col} style={{ padding: '12px 20px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: isDark ? '#CBD5E1' : '#64748b', textAlign: 'left' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeLoans.slice(0, 6).map((r, i) => {
                const isOverdue = r.returnDate && new Date() > new Date(r.returnDate);
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
                    <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: '600', color: isDark ? '#f1f5f9' : '#0f172a' }}>{r.book}</td>
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: isOverdue ? '#b91c1c' : (isDark ? '#94a3b8' : '#64748b'), fontWeight: isOverdue ? '700' : '500' }}>
                      {r.returnDate || 'N/A'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <Badge status={isOverdue ? 'Overdue' : 'Active'} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      {/* Quick actions */}
      <Card style={{ backgroundColor: isDark ? '#1e293b' : '#fff' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '700', color: isDark ? '#f1f5f9' : '#0f172a' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <PrimaryBtn onClick={() => navigate('/books')}>Browse Catalog</PrimaryBtn>
          <PrimaryBtn
            onClick={() => navigate('/user/profile')}
            style={{ backgroundColor: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#f1f5f9' : '#0f172a' }}
          >
            My Profile
          </PrimaryBtn>
          <PrimaryBtn
            onClick={() => navigate('/user/messages')}
            style={{ backgroundColor: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#f1f5f9' : '#0f172a' }}
          >
            Messages
          </PrimaryBtn>
        </div>
      </Card>
    </div>
  );
}
