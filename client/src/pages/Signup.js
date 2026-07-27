import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill in all fields');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['transparent','#ef4444','#f59e0b','#10b981'];
  const strengthLabels = ['','Weak','Fair','Strong'];

  return (
    <div
      className="page-bg"
      style={{
        minHeight:'100vh',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        padding:'3rem'
      }}
    >

      {/* LOGO */}
      <Link to="/" style={{
        textDecoration:'none',
        display:'flex',
        alignItems:'center',
        gap:'0.8rem',
        marginBottom:'3rem'
      }}>
        <div style={{
          width:50,
          height:50,
          borderRadius:14,
          background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          fontSize:'1.5rem',
          boxShadow:'0 6px 25px rgba(99,102,241,0.5)'
        }}>✦</div>

        <span style={{
          fontFamily:'Syne,sans-serif',
          fontWeight:800,
          fontSize:'1.9rem',
          color:'#f1f5f9'
        }}>
          Resume<span style={{ color:'#818cf8' }}>AI</span>
        </span>
      </Link>

      {/* CARD */}
      <div
        className="card fade-up"
        style={{
          width:'100%',
          maxWidth:600,
          padding:'3.5rem'
        }}
      >

        {/* HEADER */}
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <div style={{
            width:80,
            height:80,
            borderRadius:24,
            background:'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))',
            border:'1px solid rgba(99,102,241,0.4)',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:'2.2rem',
            margin:'0 auto 1.5rem'
          }}>
            🚀
          </div>

          <h1 style={{
            fontFamily:'Syne,sans-serif',
            fontSize:'2.6rem',
            fontWeight:800,
            color:'#f1f5f9',
            marginBottom:'0.6rem'
          }}>
            Create your account
          </h1>

          <p style={{
            color:'#cbd5f5',
            fontSize:'1.1rem'
          }}>
            Start analyzing resumes for free today
          </p>
        </div>

        {/* FORM */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.8rem' }}>

          {/* NAME */}
          <div>
            <label className="form-label">Full Name</label>
            <div style={{ position:'relative' }}>
              <span style={{
                position:'absolute',
                left:'1.2rem',
                top:'50%',
                transform:'translateY(-50%)',
                fontSize:'1.1rem',
                opacity:0.6
              }}>👤</span>

              <input
                className="form-input"
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                style={{
                  paddingLeft:'3rem',
                  height:'52px',
                  fontSize:'1.05rem'
                }}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="form-label">Email Address</label>
            <div style={{ position:'relative' }}>
              <span style={{
                position:'absolute',
                left:'1.2rem',
                top:'50%',
                transform:'translateY(-50%)',
                fontSize:'1.1rem',
                opacity:0.6
              }}>📧</span>

              <input
                className="form-input"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  paddingLeft:'3rem',
                  height:'52px',
                  fontSize:'1.05rem'
                }}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="form-label">Password</label>
            <div style={{ position:'relative' }}>
              <span style={{
                position:'absolute',
                left:'1.2rem',
                top:'50%',
                transform:'translateY(-50%)',
                fontSize:'1.1rem',
                opacity:0.6
              }}>🔒</span>

              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                required
                style={{
                  paddingLeft:'3rem',
                  paddingRight:'3.5rem',
                  height:'52px',
                  fontSize:'1.05rem'
                }}
              />

              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position:'absolute',
                  right:'1rem',
                  top:'50%',
                  transform:'translateY(-50%)',
                  background:'none',
                  border:'none',
                  cursor:'pointer',
                  fontSize:'1.1rem',
                  color:'#94a3b8'
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            {/* PASSWORD STRENGTH */}
            {form.password.length > 0 && (
              <div style={{ marginTop:'0.6rem' }}>
                <div style={{ display:'flex', gap:5, marginBottom:'0.3rem' }}>
                  {[1,2,3].map(i => (
                    <div
                      key={i}
                      style={{
                        flex:1,
                        height:5,
                        borderRadius:5,
                        background: i <= strength ? strengthColors[strength] : 'rgba(99,102,241,0.15)'
                      }}
                    />
                  ))}
                </div>
                <span style={{
                  fontSize:'0.85rem',
                  color: strengthColors[strength],
                  fontWeight:600
                }}>
                  {strengthLabels[strength]} password
                </span>
              </div>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
            style={{
              width:'100%',
              justifyContent:'center',
              padding:'1.3rem',
              fontSize:'1.15rem',
              marginTop:'0.5rem',
              boxShadow: loading ? 'none' : '0 12px 35px rgba(99,102,241,0.5)',
              opacity: loading ? 0.65 : 1
            }}
          >
            {loading ? (
              <>
                <div className="spinner" />&nbsp;Creating account...
              </>
            ) : (
              'Create Account →'
            )}
          </button>
        </div>

        {/* FOOTER */}
        <div style={{
          marginTop:'2.5rem',
          paddingTop:'2rem',
          borderTop:'1px solid rgba(99,102,241,0.2)',
          textAlign:'center'
        }}>
          <p style={{ color:'#94a3b8', fontSize:'1.05rem' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color:'#818cf8',
                fontWeight:700,
                textDecoration:'none'
              }}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}