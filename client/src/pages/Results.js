import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import Navbar from '../components/Navbar';

const scoreColor = s => s >= 75 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';
const scoreBg = s => s >= 75 ? 'rgba(16,185,129,0.1)' : s >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

const Pill = ({ text, type }) => (
  <span style={{
    padding:'0.35rem 0.85rem', borderRadius:99, fontSize:'0.8rem', fontWeight:500,
    background: type==='present' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
    color: type==='present' ? '#10b981' : '#ef4444',
    border: `1px solid ${type==='present' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
  }}>{type==='present'?'✓ ':'✗ '}{text}</span>
);

export default function Results() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/history/${id}`).then(r => setAnalysis(r.data.analysis)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="page-bg" style={{ minHeight:'100vh' }}>
      <Navbar />
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'60vh' }}>
        <div className="spinner" style={{ width:40, height:40, borderWidth:3 }} />
      </div>
    </div>
  );
  if (!analysis) return <div style={{ textAlign:'center', padding:'4rem', color:'#64748b' }}>Analysis not found</div>;

  const radarData = [
    { subject:'Skills', value: analysis.skillsMatch },
    { subject:'Experience', value: analysis.experienceMatch },
    { subject:'Education', value: analysis.educationMatch },
    { subject:'ATS Score', value: analysis.atsScore },
    { subject:'Overall', value: analysis.matchScore },
  ];

  const pieData = [
    { name:'Match', value: analysis.matchScore },
    { name:'Gap', value: 100 - analysis.matchScore },
  ];

  return (
    <div className="page-bg" style={{ minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2.5rem 2rem' }}>

        {/* Header */}
        <div className="fade-up" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.8rem', fontWeight:800, color:'#f1f5f9' }}>{analysis.jobTitle}</h1>
            <p style={{ color:'#64748b', marginTop:'0.3rem' }}>Analysis on {new Date(analysis.createdAt).toLocaleDateString()}</p>
          </div>
          <div style={{ display:'flex', gap:'1rem' }}>
            <Link to="/analyze" className="btn-secondary">New Analysis</Link>
            <a
  href={`http://localhost:5000/api/report/${id}`}
  className="btn-primary"
  target="_blank"
  rel="noopener noreferrer"
>
  Download Report
</a>
          </div>
        </div>

        {/* Main Score */}
        <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:'1.5rem', marginBottom:'1.5rem', alignItems:'stretch' }}>
          <div className="card" style={{ textAlign:'center', minWidth:200, background: scoreBg(analysis.matchScore) }}>
            <div style={{ fontSize:'0.85rem', color:'#94a3b8', marginBottom:'0.5rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>Overall Match</div>
            <div style={{ fontFamily:'Syne,sans-serif', fontSize:'4rem', fontWeight:800, color: scoreColor(analysis.matchScore), lineHeight:1 }}>{analysis.matchScore}%</div>
            <div style={{ color:'#64748b', fontSize:'0.85rem', marginTop:'0.5rem' }}>
              {analysis.matchScore >= 75 ? '🎉 Excellent' : analysis.matchScore >= 50 ? '⚡ Good – keep improving' : '⚠ Needs work'}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'1rem' }}>
            {[
              { label:'ATS Score', val: analysis.atsScore },
              { label:'Skills Match', val: analysis.skillsMatch },
              { label:'Experience', val: analysis.experienceMatch },
              { label:'Education', val: analysis.educationMatch },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign:'center', padding:'1.2rem' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'2rem', fontWeight:800, color: scoreColor(s.val) }}>{s.val}%</div>
                <div style={{ color:'#64748b', fontSize:'0.8rem', marginTop:'0.25rem' }}>{s.label}</div>
                <div style={{ marginTop:'0.75rem', height:5, borderRadius:99, background:'rgba(255,255,255,0.07)' }}>
                  <div style={{ height:'100%', borderRadius:99, width:`${s.val}%`, background: scoreColor(s.val), transition:'width 1s ease' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts row */}
        <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem' }}>
          <div className="card">
            <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#f1f5f9', marginBottom:'1.5rem' }}>📡 Skill Radar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(99,102,241,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill:'#94a3b8', fontSize:11 }} />
                <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#f1f5f9', marginBottom:'1.5rem' }}>🎯 Match Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill={scoreColor(analysis.matchScore)} />
                  <Cell fill="rgba(255,255,255,0.05)" />
                </Pie>
                <Tooltip formatter={v => `${v}%`} contentStyle={{ background:'#1e293b', border:'1px solid rgba(99,102,241,0.3)', borderRadius:8, color:'#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign:'center', marginTop:'-3rem', position:'relative' }}>
              <span style={{ fontFamily:'Syne,sans-serif', fontSize:'1.5rem', fontWeight:800, color: scoreColor(analysis.matchScore) }}>{analysis.matchScore}%</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="fade-up" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem' }}>
          <div className="card">
            <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#f1f5f9', marginBottom:'1rem' }}>✅ Skills You Have</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {(analysis.presentSkills||[]).map(s => <Pill key={s} text={s} type="present" />)}
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#f1f5f9', marginBottom:'1rem' }}>❌ Missing Skills</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
              {(analysis.missingSkills||[]).map(s => <Pill key={s} text={s} type="missing" />)}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="card fade-up" style={{ marginBottom:'1.5rem' }}>
          <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#f1f5f9', marginBottom:'1.2rem' }}>💡 Improvement Suggestions</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
            {(analysis.suggestions||[]).map((s,i) => (
              <div key={i} style={{ display:'flex', gap:'1rem', padding:'0.9rem 1rem', background:'rgba(99,102,241,0.06)', borderRadius:10, borderLeft:'3px solid #6366f1' }}>
                <span style={{ color:'#6366f1', fontWeight:700, minWidth:20 }}>{i+1}.</span>
                <span style={{ color:'#cbd5e1', lineHeight:1.6, fontSize:'0.92rem' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Feedback */}
        <div className="card fade-up" style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.08))', borderColor:'rgba(99,102,241,0.4)' }}>
          <h3 style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#f1f5f9', marginBottom:'0.75rem' }}>🤖 AI Overall Feedback</h3>
          <p style={{ color:'#94a3b8', lineHeight:1.8 }}>{analysis.overallFeedback}</p>
        </div>
      </div>
    </div>
  );
}