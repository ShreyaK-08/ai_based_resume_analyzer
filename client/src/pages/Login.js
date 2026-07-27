import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div
      className="page-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem'
      }}
    >

      {/* LOGO */}
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          marginBottom: '3rem'
        }}
      >
        <div style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: '0 6px 25px rgba(99,102,241,0.5)'
        }}>
          ✦
        </div>

        <span style={{
          fontFamily: 'Syne,sans-serif',
          fontWeight: 800,
          fontSize: '1.9rem',
          color: '#f1f5f9'
        }}>
          Resume<span style={{ color: '#818cf8' }}>AI</span>
        </span>
      </Link>

      {/* CARD */}
      <div
        className="card fade-up"
        style={{
          width: '100%',
          maxWidth: 600,
          padding: '3.5rem'
        }}
      >

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))',
            border: '1px solid rgba(99,102,241,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            margin: '0 auto 1.5rem'
          }}>
            🔐
          </div>

          <h1 style={{
            fontFamily: 'Syne,sans-serif',
            fontSize: '2.6rem',
            fontWeight: 800,
            color: '#f1f5f9',
            marginBottom: '0.6rem'
          }}>
            Welcome back
          </h1>

          <p style={{
            color: '#cbd5f5',
            fontSize: '1.1rem'
          }}>
            Sign in to continue your career journey
          </p>
        </div>

        {/* FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>

          {/* EMAIL */}
          <div>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '1.2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                opacity: 0.6
              }}>
                📧
              </span>

              <input
                className="form-input"
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  paddingLeft: '3rem',
                  height: '52px',
                  fontSize: '1.05rem'
                }}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>

              <input
                className="form-input"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(e)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="password-toggle"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '1.3rem',
              fontSize: '1.15rem',
              marginTop: '0.5rem',
              boxShadow: loading ? 'none' : '0 12px 35px rgba(99,102,241,0.5)',
              opacity: loading ? 0.65 : 1
            }}
          >
            {loading ? (
              <>
                <div className="spinner" />&nbsp;Signing in...
              </>
            ) : (
              'Sign In →'
            )}
          </button>
        </div>

        {/* FOOTER */}
        <div style={{
          marginTop: '2.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(99,102,241,0.2)',
          textAlign: 'center'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#818cf8',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}