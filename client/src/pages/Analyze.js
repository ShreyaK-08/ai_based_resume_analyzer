import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const DropZone = ({ label, icon, file, onDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(files => onDrop(files[0]), [onDrop]),
    accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1
  });
  return (
    <div {...getRootProps()} style={{
      border: `2px dashed ${isDragActive ? '#6366f1' : file ? '#10b981' : 'rgba(99,102,241,0.3)'}`,
      borderRadius: 16, padding: '2.5rem 2rem', textAlign: 'center', cursor: 'pointer',
      background: isDragActive ? 'rgba(99,102,241,0.1)' : file ? 'rgba(16,185,129,0.06)' : 'rgba(15,23,42,0.5)',
      transition: 'all 0.3s',
    }}>
      <input {...getInputProps()} />
      <div style={{ fontSize: '2.8rem', marginBottom: '0.9rem' }}>{file ? '✅' : icon}</div>
      <div style={{ fontFamily:'Syne,sans-serif', fontWeight:700, color:'#f1f5f9', marginBottom:'0.5rem', fontSize:'1rem' }}>{label}</div>
      {file ? (
        <div style={{ color:'#10b981', fontSize:'0.85rem', fontWeight:600 }}>📄 {file.name}</div>
      ) : (
        <div style={{ color:'#64748b', fontSize:'0.85rem' }}>Drag & drop PDF or <span style={{ color:'#818cf8', fontWeight:600 }}>browse files</span></div>
      )}
    </div>
  );
};

export default function Analyze() {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!resume || !jobDesc) return toast.error('Please upload both PDF files');
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('jobDescription', jobDesc);
    try {
      const res = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Analysis complete!');
      navigate(`/results/${res.data.analysis._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-bg" style={{ minHeight:'100vh' }}>
      <Navbar />
      <div style={{ maxWidth:780, margin:'0 auto', padding:'3rem 2rem' }}>

        <div className="fade-up" style={{ textAlign:'center', marginBottom:'3rem' }}>
          <h1 style={{ fontFamily:'Syne,sans-serif', fontSize:'2.3rem', fontWeight:800, color:'#f1f5f9', marginBottom:'0.75rem' }}>
            Analyze Your Resume
          </h1>
          <p style={{ color:'#64748b', fontSize:'1.08rem' }}>
            Upload your resume and job description to get an AI-powered match analysis
          </p>
        </div>

        <div className="card fade-up">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem' }}>
            <DropZone label="Your Resume" icon="📄" file={resume} onDrop={setResume} />
            <DropZone label="Job Description" icon="💼" file={jobDesc} onDrop={setJobDesc} />
          </div>

          {loading && (
            <div style={{ textAlign:'center', padding:'1.5rem', marginBottom:'1.5rem', background:'rgba(99,102,241,0.06)', borderRadius:12, border:'1px solid rgba(99,102,241,0.2)' }}>
              <div className="spinner" style={{ margin:'0 auto 0.75rem', width:36, height:36, borderWidth:3 }} />
              <p style={{ color:'#818cf8', fontFamily:'Syne,sans-serif', fontWeight:700, fontSize:'1.05rem' }}>AI is analyzing your documents...</p>
              <p style={{ color:'#64748b', fontSize:'0.85rem', marginTop:'0.25rem' }}>This takes about 15–30 seconds</p>
            </div>
          )}

          <button
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={loading || !resume || !jobDesc}
            style={{ width:'100%', justifyContent:'center', padding:'1.1rem', fontSize:'1.05rem', boxShadow: (loading || !resume || !jobDesc) ? 'none' : '0 8px 28px rgba(99,102,241,0.4)' }}
          >
            {loading ? <><div className="spinner" />&nbsp;Analyzing...</> : '🚀 Analyze Now'}
          </button>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginTop:'2rem' }}>
            {[['📊','Match Score'],['🔍','Missing Skills'],['💡','AI Suggestions']].map(([ic,f]) => (
              <div key={f} style={{ textAlign:'center', padding:'0.9rem', background:'rgba(99,102,241,0.06)', borderRadius:12, border:'1px solid rgba(99,102,241,0.12)' }}>
                <div style={{ color:'#818cf8', fontSize:'1.3rem', marginBottom:'0.35rem' }}>{ic}</div>
                <div style={{ color:'#94a3b8', fontSize:'0.82rem', fontWeight:500 }}>{f}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
