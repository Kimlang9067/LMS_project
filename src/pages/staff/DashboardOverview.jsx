import React from 'react';

export default function DashboardOverview() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Metric Cards Row */}
      <div style={styles.metricsRow}>
        <div style={styles.card}>
          <h5>Total User</h5>
          <h3>1215</h3>
          <span style={styles.up}>+10.3% from last month</span>
        </div>
        <div style={styles.card}>
          <h5>Borrow books</h5>
          <h3>1795</h3>
          <span style={styles.up}>+11.8% from last month</span>
        </div>
        <div style={styles.card}>
          <h5>Return rate</h5>
          <h3>90%</h3>
          <span style={styles.down}>10% from last month</span>
        </div>
        <div style={styles.card}>
          <h5>Growth rate</h5>
          <h3>5.3%</h3>
          <span style={styles.up}>1% from last month</span>
        </div>
      </div>

      {/* Management Sections Grid Tables */}
      <div style={{ marginTop: '40px' }}>
        <h4>Users management</h4>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Roles</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}>Chiv Vouchly</td>
              <td style={styles.td}>Librarian</td>
              <td style={styles.td}><span style={{ color: '#10b981' }}>Active</span></td>
              <td style={styles.td}>7mn ago</td>
            </tr>
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button style={styles.addBtn}>+ Add user</button>
          <button style={styles.remBtn}>remove user</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' },
  card: { padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' },
  up: { fontSize: '12px', color: '#10b981' },
  down: { fontSize: '12px', color: '#ef4444' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', backgroundColor: '#fff' },
  th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', fontSize: '14px' },
  td: { padding: '12px', borderBottom: '1px solid #e2e8f0', fontSize: '14px' },
  addBtn: { padding: '8px 16px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  remBtn: { padding: '8px 16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }
};
