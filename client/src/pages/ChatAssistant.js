import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const Message = ({ msg }) => (
  <div style={{ display:'flex', justifyContent: msg.role==='user' ? 'flex-end' : 'flex-start', marginBottom:'1.1rem', alignItems:'flex-end', gap:'0.6rem' }}>
    {msg.role==='assistant' && (
      <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0, boxShadow:'0 2px 8px rgba(99,102,241,0.4)' }}>✦</div>
    )}
    <div style={{
      maxWidth:'72%', padding:'0.95rem 1.2rem', borderRadius:16,
      background: msg.role==='user'
        ? 'linear-gradient(135deg,#4f46e5,#7c3aed)'
        : 'rgba(15,23,42,0.85)',
      border: msg.role==='user' ? 'none' : '1px solid rgba(99,102,241,0.22)',
      color:'#f1f5f9', fontSize:'0.95rem', lineHeight:1.75,
      borderBottomRightRadius: msg.role==='user' ? 4 : 16,
      borderBottomLeftRadius: msg.role==='assistant' ? 4 : 16,
      boxShadow: msg.role==='user' ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
      whiteSpace:'pre-wrap',
    }}>{msg.content}</div>
    {msg.role==='user' && (
      <div style={{ width:34, height:34, borderRadius:10, background:'rgba(99,102,241,0.2)', border:'1px solid rgba(99,102,241,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', flexShrink:0 }}>👤</div>
    )}
  </div>
);

const STARTERS = [
  '💡 How do I optimize my resume for ATS?',
  '🔥 Top skills for software engineers in 2025?',
  '✍️ How to write a strong professional summary?',
  '🔄 Tips for switching careers into data science?',
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState([{
    role:'assistant',
    content:"Hello! I'm your AI Career Coach 🤖\n\nI can help you improve your resume, prepare for interviews, identify skill gaps, and navigate your career path. What would you like to work on today?"
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(m => [...m, { role:'user', content: msg }]);
    setLoading(true);
    try {
      const res = await axios.post('/api/analyze/chat', { message: msg });
      setMessages(m => [...m, { role:'assistant', content: res.data.reply }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Chat failed. Please try again.';
      toast.error(errMsg);
      setMessages(m => [...m, { role:'assistant', content:'Sorry, I encountered an error. Please try again.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="page-bg" style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <div style={{ flex:1, maxWidth:860, width:'100%', margin:'0 auto', padding:'2rem', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ width:48, height:48, borderRadius:14, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', boxShadow:'0 4px 16px rgba(99,102,241,0.4)' }}>🤖</div>
          <div>
            <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'1.7rem', fontWeight:800, color:'#f1f5f9', lineHeight:1 }}>AI Career Coach</h1>
            <p style={{ color:'#64748b', fontSize:'0.9rem', marginTop:'0.2rem' }}>Powered by Google Gemini</p>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.4rem 0.9rem', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:99 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', animation:'pulse 2s infinite' }} />
            <span style={{ color:'#10b981', fontSize:'0.8rem', fontWeight:600 }}>Online</span>
          </div>
        </div>

        {/* Chat window */}
        <div className="card" style={{ flex:1, minHeight:400, maxHeight:480, overflowY:'auto', padding:'1.5rem', marginBottom:'1rem', display:'flex', flexDirection:'column' }}>
          {messages.map((m,i) => <Message key={i} msg={m} />)}
          {loading && (
            <div style={{ display:'flex', gap:'0.6rem', alignItems:'flex-end' }}>
              <div style={{ width:34, height:34, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>✦</div>
              <div style={{ padding:'0.9rem 1.2rem', background:'rgba(15,23,42,0.85)', border:'1px solid rgba(99,102,241,0.22)', borderRadius:16, borderBottomLeftRadius:4, display:'flex', gap:5, alignItems:'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#6366f1', animation:`bounce 1.2s ${i*0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Starter prompts — shown only at start */}
        {messages.length <= 1 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1rem' }}>
            {STARTERS.map(s => (
              <button key={s} onClick={() => send(s.replace(/^[^\s]+\s/,''))} style={{
                padding:'0.5rem 1rem', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.28)',
                borderRadius:99, color:'#a5b4fc', fontSize:'0.82rem', cursor:'pointer', transition:'all 0.2s', fontFamily:'Inter,sans-serif', fontWeight:500,
              }}>{s}</button>
            ))}
          </div>
        )}

        {/* Input row */}
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <input
            className="form-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()}
            placeholder="Ask me anything about your career or resume..."
            style={{ flex:1 }}
          />
          <button
            className="btn-primary"
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{ padding:'0.75rem 1.6rem', flexShrink:0, boxShadow: (!input.trim() || loading) ? 'none' : '0 4px 16px rgba(99,102,241,0.4)' }}
          >
            {loading ? <div className="spinner" style={{ width:18, height:18, borderWidth:2 }} /> : '→'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}
