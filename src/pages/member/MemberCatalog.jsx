import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnrichedResources } from '../../data/bookMeta';
import { PrimaryBtn } from '../../components/shared/UI';

export default function MemberCatalog() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const books = getEnrichedResources().filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>Library Catalog</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>Browse books, journals, magazines, and digital resources.</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: '500px', padding: '10px 16px',
            borderRadius: '10px', border: '1px solid #e2e8f0',
            fontSize: '14px', outline: 'none', boxSizing: 'border-box',
            backgroundColor: '#fff',
          }}
        />
      </div>

      {/* Book grid */}
      <div style={S.grid}>
        {books.map(book => (
          <div key={book.id} style={S.card}>
            <div style={S.coverWrap}>
              {book.cover
                ? <img src={book.cover} alt={book.title} style={S.coverImg} />
                : <span style={{ fontSize: '36px' }}>📘</span>}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={S.bookTitle}>{book.title}</h3>
              {book.author && <p style={S.bookAuthor}>{book.author}</p>}

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0 14px' }}>
                <span style={S.typeBadge}>{book.type || 'Book'}</span>
                <span style={S.availBadge}>Available</span>
                {book.requiresPayment && (
                  <span style={S.priceBadge}>${book.price?.toFixed(2)}</span>
                )}
              </div>

              <PrimaryBtn
                onClick={() => navigate(`/user/catalog/${book.id}`, { state: { backPath: '/user/catalog' } })}
                style={{ width: '100%' }}
              >
                View Details
              </PrimaryBtn>
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <div style={{ gridColumn: '1/-1', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            No books match your search.
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px',
    padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  coverWrap: {
    width: '100%', height: '100px', backgroundColor: '#f1f5f9', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  coverImg: { width: '100%', height: '100%', objectFit: 'cover' },
  bookTitle:  { margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: '#0f172a', lineHeight: '1.4' },
  bookAuthor: { margin: 0, fontSize: '13px', color: '#64748b' },
  typeBadge:  { backgroundColor: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  availBadge: { backgroundColor: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
  priceBadge: { backgroundColor: '#fef3c7', color: '#b45309', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' },
};
