import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const scoreColor = s => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';
const scoreBg    = s => s >= 75 ? 'rgba(16,185,129,0.1)' : s >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

export default function Dashboard() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/history')
      .then(r => setAnalyses(r.data.analyses || []))
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, []);

  const avg  = analyses.length ? Math.round(analyses.reduce((a,b) => a + b.matchScore, 0) / analyses.length) : 0;
  const best = analyses.length ? Math.max(...analyses.map(a => a.matchScore)) : 0;

  const timeOfDay = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  };

  return (
    <div className="page-bg" style={{ minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2.5rem 2rem' }}>

        {/* Welcome */}
        <div className="fade-up" style={{ marginBottom:'2.5rem' }}>
          <p style={{ color:'#64748b', fontSize:'0.95rem', fontWeight:500, marginBottom:'0.3rem' }}>{timeOfDay()},</p>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'2.3rem', fontWeight:800, color:'#f1f5f9', lineHeight:1 }}>
            {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color:'#64748b', marginTop:'0.5rem', fontSize:'1rem' }}>Here's your career progress at a glance.</p>
        </div>

        {/* Stats cards */}
        <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:'1.25rem', marginBottom:'2.5rem' }}>
          {[
            { label:'Total Analyses', value: analyses.length, icon:'📄', sub:'resume checks done' },
            { label:'Average Score',  value: `${avg}%`,       icon:'📊', sub:'across all analyses' },
            { label:'Best Score',     value: `${best}%`,      icon:'🏆', sub:'your highest match'  },
          ].map(s => (
            <div key={s.label} className="card" style={{ display:'flex', alignItems:'center', gap:'1.2rem' }}>
              <div style={{ width:52, height:52, borderRadius:14, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2.1rem', fontWeight:800, color:'#818cf8', lineHeight:1 }}>{s.value}</div>
                <div style={{ color:'#f1f5f9', fontSize:'0.88rem', fontWeight:600, marginTop:'0.2rem' }}>{s.label}</div>
                <div style={{ color:'#64748b', fontSize:'0.78rem', marginTop:'0.1rem' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1.25rem', marginBottom:'2.5rem' }}>
          {[
            { to:'/analyze', icon:'🚀', title:'New Analysis', sub:'Upload resume & JD', grad:true },
            { to:'/history', icon:'📜', title:'History',      sub:'View past analyses' },
            { to:'/chat',    icon:'🤖', title:'AI Coach',     sub:'Get career advice'  },
          ].map(a => (
            <Link key={a.to} to={a.to} className="card" style={{ textDecoration:'none', textAlign:'center', cursor:'pointer', background: a.grad ? 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.14))' : undefined, transition:'all 0.25s' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}>
              <div style={{ fontSize:'2.8rem', marginBottom:'0.9rem' }}>{a.icon}</div>
              <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#f1f5f9', fontSize:'1.05rem', marginBottom:'0.35rem' }}>{a.title}</div>
              <div style={{ color:'#64748b', fontSize:'0.88rem' }}>{a.sub}</div>
            </Link>
          ))}
        </div>

        {/* Recent analyses */}
        <div className="fade-up">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
            <h2 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.4rem', fontWeight:700, color:'#f1f5f9' }}>Recent Analyses</h2>
            {analyses.length > 0 && <Link to="/history" style={{ color:'#818cf8', fontSize:'0.9rem', fontWeight:600, textDecoration:'none' }}>View all →</Link>}
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'3rem' }}>
              <div className="spinner" style={{ margin:'0 auto', width:36, height:36 }} />
            </div>
          ) : analyses.length === 0 ? (
            <div className="card" style={{ textAlign:'center', padding:'4rem' }}>
              <div style={{ fontSize:'3.5rem', marginBottom:'1.1rem' }}>📂</div>
              <p style={{ color:'#94a3b8', fontSize:'1.05rem' }}>
                No analyses yet.{' '}
                <Link to="/analyze" style={{ color:'#818cf8', fontWeight:700 }}>Start your first one!</Link>
              </p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
              {analyses.slice(0, 5).map(a => (
                <Link key={a._id} to={`/results/${a._id}`} style={{ textDecoration:'none' }}>
                  <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.2rem 1.6rem', cursor:'pointer', transition:'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform='translateX(4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform='none'}>
                    <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                      <div style={{ width:44, height:44, borderRadius:12, background: scoreBg(a.matchScore), border:`1px solid ${scoreColor(a.matchScore)}33`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontFamily:'Syne,sans-serif', fontSize:'0.95rem', fontWeight:800, color: scoreColor(a.matchScore) }}>{a.matchScore}%</span>
                      </div>
                      <div>
                        <div style={{ fontWeight:700, color:'#f1f5f9', fontSize:'1rem' }}>{a.jobTitle}</div>
                        <div style={{ color:'#64748b', fontSize:'0.85rem', marginTop:'0.15rem' }}>{new Date(a.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
                      </div>
                    </div>
                    <span style={{ color:'#6366f1', fontSize:'1.2rem' }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
