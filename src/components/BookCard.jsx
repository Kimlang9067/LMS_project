import React from 'react';

export default function BookCard({ title, rating, status, onActionClick }) {
  const getBadgeStyle = () => {
    if (status === 'Available') return { color: '#10b981' };
    if (status === 'Unavailable') return { color: '#ef4444' };
    return { color: '#3b82f6' }; // "Read now"
  };

  return (
    <div style={styles.card}>
      <div style={styles.coverPlaceholder}>📘</div>
      <div style={styles.meta}>
        <h4 style={styles.title}>{title}</h4>
        <p style={styles.rating}>Rating: {rating}</p>
        <span style={{ ...styles.badge, ...getBadgeStyle() }}>{status}</span>
      </div>
      {status === 'Available' && (
        <button onClick={onActionClick} style={styles.actionBtn}>Rent</button>
      )}
      {status === 'Read now' && (
        <button style={{ ...styles.actionBtn, backgroundColor: '#3b82f6' }}>Read</button>
      )}
    </div>
  );
}

const styles = {
  card: { width: '175px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', fontFamily: 'system-ui, sans-serif' },
  coverPlaceholder: { height: '110px', backgroundColor: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' },
  meta: { display: 'flex', flexDirection: 'column', gap: '4px' },
  title: { margin: 0, fontSize: '14px', fontWeight: '600', color: '#1e293b' },
  rating: { margin: 0, fontSize: '12px', color: '#64748b' },
  badge: { fontSize: '13px', fontWeight: '600', marginTop: '4px' },
  actionBtn: { width: '100%', padding: '8px 0', border: 'none', borderRadius: '6px', backgroundColor: '#10b981', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }
};
