import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoverLogout, setHoverLogout] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  const navLink = (to, label, emoji) => (
    <Link to={to} style={{
      color: isActive(to) ? '#c7d2fe' : '#94a3b8',
      textDecoration: 'none',
      fontSize: '0.93rem',
      fontWeight: isActive(to) ? 700 : 500,
      padding: '0.45rem 0.9rem',
      borderRadius: 10,
      background: isActive(to) ? 'rgba(99,102,241,0.18)' : 'transparent',
      border: isActive(to) ? '1px solid rgba(99,102,241,0.35)' : '1px solid transparent',
      transition: 'all 0.2s',
      display: 'flex', alignItems: 'center', gap: '0.35rem',
    }}>
      <span>{emoji}</span>{label}
    </Link>
  );

  return (
    <nav style={{ borderBottom:'1px solid rgba(99,102,241,0.18)', backdropFilter:'blur(20px)', background:'rgba(2,8,23,0.88)', position:'sticky', top:0, zIndex:100 }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', height:66 }}>

        <Link to="/dashboard" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'0.65rem' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', boxShadow:'0 2px 10px rgba(99,102,241,0.4)' }}>✦</div>
          <span style={{ fontFamily:'Syne,sans-serif', fontWeight:800, fontSize:'1.22rem', color:'#f1f5f9' }}>
            Resume<span style={{ color:'#818cf8' }}>AI</span>
          </span>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}>
          {navLink('/dashboard', 'Dashboard', '📊')}
          {navLink('/analyze',   'Analyze',   '🚀')}
          {navLink('/history',   'History',   '📜')}
          {navLink('/chat',      'AI Coach',  '🤖')}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.35rem 0.85rem', background:'rgba(99,102,241,0.1)', borderRadius:99, border:'1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ width:26, height:26, borderRadius:7, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem' }}>👤</div>
            <span style={{ color:'#c7d2fe', fontSize:'0.88rem', fontWeight:600 }}>{user?.name?.split(' ')[0]}</span>
          </div>
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoverLogout(true)}
            onMouseLeave={() => setHoverLogout(false)}
            style={{
              padding:'0.45rem 1.1rem',
              background: hoverLogout ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.08)',
              border:'1px solid rgba(239,68,68,0.3)',
              borderRadius:10, color:'#fca5a5', cursor:'pointer',
              fontSize:'0.88rem', fontWeight:600,
              transition:'all 0.2s', fontFamily:'Inter,sans-serif',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
