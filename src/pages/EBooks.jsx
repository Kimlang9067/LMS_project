import React from 'react';
import Navbar from '../components/Navbar';
import BookCard from '../components/BookCard';

export default function EBooks() {
  const digits = [
    { id: 1, title: 'Sword Art Online', rating: '4.9', status: 'Read now', type: 'ebook' },
    { id: 2, title: 'Attack On Titan', rating: '4.8', status: 'Read now', type: 'ebook' },
    { id: 3, title: 'Violet Evergarden', rating: '3.9', status: 'Read now', type: 'ebook' },
  ];

  return (
    <div>
      <Navbar />
      <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
        <h2>E-Books</h2>
        <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginTop: '20px' }}>Science Book</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '15px' }}>
          {digits.map(e => <BookCard key={e.id} {...e} />)}
        </div>
      </div>
    </div>
  );
}
