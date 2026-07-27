import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const scoreColor = s => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';
const scoreBg    = s => s >= 75 ? 'rgba(16,185,129,0.1)' : s >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    axios.get('/api/history')
      .then(r => setAnalyses(r.data.analyses || []))
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-bg" style={{ minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:900, margin:'0 auto', padding:'2.5rem 2rem' }}>

        <div className="fade-up" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'2rem', fontWeight:800, color:'#f1f5f9' }}>Analysis History</h1>
            <p style={{ color:'#64748b', marginTop:'0.3rem' }}>{analyses.length} total {analyses.length === 1 ? 'analysis' : 'analyses'}</p>
          </div>
          <Link to="/analyze" className="btn-primary">+ New Analysis</Link>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'4rem' }}>
            <div className="spinner" style={{ margin:'0 auto', width:36, height:36 }} />
          </div>
        ) : analyses.length === 0 ? (
          <div className="card" style={{ textAlign:'center', padding:'4rem' }}>
            <div style={{ fontSize:'3.5rem', marginBottom:'1.1rem' }}>📂</div>
            <p style={{ color:'#94a3b8', fontSize:'1.05rem', marginBottom:'1.5rem' }}>No analyses yet.</p>
            <Link to="/analyze" className="btn-primary">Start Your First Analysis →</Link>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {analyses.map((a, idx) => (
              <Link key={a._id} to={`/results/${a._id}`} style={{ textDecoration:'none' }}
                className="fade-up">
                <div className="card" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.3rem 1.7rem', cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateX(4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='none'}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1.1rem' }}>
                    <div style={{ width:46, height:46, borderRadius:13, background: scoreBg(a.matchScore), border:`1.5px solid ${scoreColor(a.matchScore)}55`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontFamily:'Syne,sans-serif', fontSize:'1rem', fontWeight:800, color: scoreColor(a.matchScore) }}>{a.matchScore}%</span>
                    </div>
                    <div>
                      <div style={{ fontWeight:700, color:'#f1f5f9', fontSize:'1.02rem' }}>{a.jobTitle}</div>
                      <div style={{ color:'#64748b', fontSize:'0.85rem', marginTop:'0.2rem' }}>
                        {new Date(a.createdAt).toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'1.5rem' }}>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ height:5, width:80, borderRadius:99, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${a.matchScore}%`, background: scoreColor(a.matchScore), borderRadius:99 }} />
                      </div>
                      <div style={{ color:'#64748b', fontSize:'0.78rem', marginTop:'0.3rem' }}>match score</div>
                    </div>
                    <span style={{ color:'#6366f1', fontSize:'1.2rem' }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
