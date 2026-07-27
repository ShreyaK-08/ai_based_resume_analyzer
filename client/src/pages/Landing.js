import React from 'react';
import { Link } from 'react-router-dom';

const Feature = ({ icon, title, desc }) => (
  <div
    className="card"
    style={{ transition:'all 0.3s' }}
    onMouseEnter={e => e.currentTarget.style.transform='translateY(-6px)'}
    onMouseLeave={e => e.currentTarget.style.transform='none'}
  >
    <div style={{
      width:56, height:56, borderRadius:16,
      background:'rgba(99,102,241,0.15)',
      border:'1px solid rgba(99,102,241,0.3)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:'1.6rem', marginBottom:'1.2rem'
    }}>
      {icon}
    </div>

    <div style={{
      fontFamily:'Syne,sans-serif',
      fontWeight:700,
      color:'#f1f5f9',
      fontSize:'1.1rem',
      marginBottom:'0.6rem'
    }}>
      {title}
    </div>

    <div style={{
      color:'#cbd5f5',
      fontSize:'0.95rem',
      lineHeight:1.8
    }}>
      {desc}
    </div>
  </div>
);

const Stat = ({ value, label }) => (
  <div style={{ textAlign:'center' }}>
    <div style={{
      fontFamily:'Syne,sans-serif',
      fontSize:'2.6rem',
      fontWeight:800,
      background:'linear-gradient(135deg,#818cf8,#c084fc)',
      WebkitBackgroundClip:'text',
      WebkitTextFillColor:'transparent'
    }}>
      {value}
    </div>

    <div style={{ color:'#94a3b8', marginTop:'0.4rem' }}>
      {label}
    </div>
  </div>
);

export default function Landing() {
  return (
    <div className="page-bg">

      {/* NAVBAR */}
      <nav style={{
        borderBottom:'1px solid rgba(99,102,241,0.2)',
        backdropFilter:'blur(20px)',
        background:'rgba(4,7,26,0.85)',
        position:'sticky',
        top:0,
        zIndex:100
      }}>
        <div style={{
          maxWidth:1100,
          margin:'0 auto',
          padding:'0 2rem',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          height:70
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
            <div style={{
              width:40, height:40, borderRadius:12,
              background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
              display:'flex', alignItems:'center', justifyContent:'center'
            }}>✦</div>

            <span style={{
              fontFamily:'Syne,sans-serif',
              fontWeight:800,
              fontSize:'1.4rem',
              color:'#fff'
            }}>
              Resume<span style={{ color:'#818cf8' }}>AI</span>
            </span>
          </div>

          <div style={{ display:'flex', gap:'0.8rem' }}>
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/signup" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{
        maxWidth:900,
        margin:'0 auto',
        padding:'6rem 2rem 4rem',
        textAlign:'center'
      }}>
        <h1 style={{
          fontFamily:'Syne,sans-serif',
          fontSize:'clamp(2.6rem,6vw,4.2rem)',
          fontWeight:800,
          color:'#f8fafc',
          lineHeight:1.15,
          textShadow:'0 0 25px rgba(99,102,241,0.35)'
        }}>
          Land Your Dream Job <br/>
          <span style={{
            background:'linear-gradient(135deg,#818cf8,#a78bfa)',
            WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent'
          }}>
            With AI-Powered Insights
          </span>
        </h1>

        <p style={{
          marginTop:'1.2rem',
          fontSize:'1.15rem',
          color:'#cbd5f5',
          maxWidth:600,
          marginInline:'auto',
          lineHeight:1.7
        }}>
          Upload your resume and job description. Get instant ATS match score,
          missing skills analysis, and personalized suggestions.
        </p>

        <div style={{
          marginTop:'2.5rem',
          display:'flex',
          justifyContent:'center',
          gap:'1.2rem'
        }}>
          <Link to="/signup" className="btn-primary">
            🚀 Analyze Resume
          </Link>

          <Link to="/login" className="btn-secondary">
            Sign In →
          </Link>
        </div>
      </div>

      {/* STATS */}
      <div style={{ maxWidth:800, margin:'-2rem auto 5rem', padding:'0 2rem' }}>
        <div className="card" style={{
          display:'grid',
          gridTemplateColumns:'repeat(3,1fr)',
          padding:'3rem',
          gap:'2rem',
          borderRadius:'24px'
        }}>
          <Stat value="95%" label="ATS Pass Rate" />
          <Stat value="3x" label="More Interviews" />
          <Stat value="30s" label="Analysis Time" />
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth:1100, margin:'0 auto 6rem', padding:'0 2rem' }}>
        <h2 style={{
          textAlign:'center',
          fontFamily:'Syne',
          fontSize:'2.3rem',
          marginBottom:'3rem'
        }}>
          Features
        </h2>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',
          gap:'1.5rem'
        }}>
          <Feature icon="📊" title="ATS Score" desc="Match your resume with job roles." />
          <Feature icon="🔍" title="Missing Skills" desc="Identify missing skills instantly." />
          <Feature icon="💡" title="AI Suggestions" desc="Get personalized improvements." />
        </div>
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign:'center',
        padding:'2rem',
        borderTop:'1px solid rgba(99,102,241,0.1)',
        color:'#64748b'
      }}>
        © 2025 ResumeAI
      </div>
    </div>
  );
}