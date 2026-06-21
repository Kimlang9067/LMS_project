import React from 'react';
import { Link } from 'react-router';

export default function Navbar() {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoGroup}>
        <Link to="/" style={styles.brandTitle}>

          <h2 style={{ textAlign: "center" }}>
            Library Management <br />
            <span style={{ color: "skyblue" }}>System</span>
          </h2>

        </Link>
      </div>

      <div style={styles.menuLinks}>
        <Link 
          to="/" 
            style={styles.link}>
              Home
        </Link>

        <Link 
          to="/books" 
            style={styles.link}>
              Books
        </Link>
        
        <Link 
          to="/ebooks" 
            style={styles.link}>
              E books
        </Link>

        <Link 
          to="/about" 
            style={styles.link}>
              About
        </Link>
        
        <div style={styles.searchBox}>
          <input type="text" placeholder="Search..." style={styles.searchInput} />
        </div>
        <Link to="/signin" style={styles.signIn}>Sign in</Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', padding: '0 40px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', fontFamily: 'system-ui, sans-serif' },
  logoGroup: { display: 'flex', alignItems: 'center' },
  brandTitle: { fontWeight: '700', fontSize: '18px', color: '#1e293b', textDecoration: 'none' },
  menuLinks: { display: 'flex', alignItems: 'center', gap: '24px' },
  
  // Menu links style
  link: { 
    textDecoration: 'none', 
    color: '#475569', 
    fontWeight: '500', 
    fontSize: '15px',
    padding: '8px 16px',         
    borderRadius: '8px',         
    border: '1px solid transparent', 
    transition: 'all 0.2s ease-in-out', 
    display: 'inline-block'
  },
  
  searchBox: { position: 'relative' },
  searchInput: { padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', width: '160px', outline: 'none' },
  
  // Updated Sign In block styled as an elegant frame button
  signIn: { 
    textDecoration: 'none', 
    color: '#3b82f6', 
    fontWeight: '600', 
    fontSize: '15px',
    padding: '8px 20px',                  // Button padding
    border: '1px solid #3b82f6',          // Sharp themed border line frame
    borderRadius: '8px',                  // Rounded container corners
    transition: 'all 0.2s ease-in-out',    // Smooth transition animations
    display: 'inline-block'
  }
};

// Injection rules handling hover effects for the menu links AND the new Sign In frame button
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    /* Hover box style for Home, Books, E books, About */
    a[style*="color: rgb(71, 85, 105)"]:hover {
      background-color: rgba(0, 0, 0, 0.05) !important; 
      border-color: rgba(0, 0, 0, 0.08) !important;     
      color: #000000 !important;                        
    }
    
    /* Interactive hover style for the new Sign In frame button */
    a[style*="color: rgb(59, 130, 246)"]:hover {
      background-color: #3b82f6 !important; /* Fills button with solid theme blue */
      color: #ffffff !important;            /* Flips text to high-contrast white */
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2) !important;
    }
  `;
  document.head.appendChild(styleSheet);
}
