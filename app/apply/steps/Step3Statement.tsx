'use client'
import React from 'react'

export default function Step3Statement({ formData, updateForm, onNext, onBack }: any) {
  const words = formData.statement ? formData.statement.trim().split(/\s+/).length : 0

  return (
    <div className="two-col">
      <div>
        <div className="card">
          <div className="card-header"><span className="card-title">Writing prompts</span><span className="card-sub">Address each one</span></div>
          <div className="card-body">
            <div className="prompt-list" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="prompt active" style={{ display: 'flex', gap: 10, padding: 10, background: '#f0fdf9', borderRadius: 8 }}>
                <div className="prompt-num" style={{ background: '#1D9E75', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
                <span className="prompt-text" style={{ fontSize: 12.5, color: '#0F6E56', fontWeight: 500 }}>Why do you want to study this programme?</span>
              </div>
              <div className="prompt" style={{ display: 'flex', gap: 10, padding: 10 }}>
                <div className="prompt-num" style={{ background: '#E1F5EE', color: '#0F6E56', borderRadius: '50%', width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
                <span className="prompt-text" style={{ fontSize: 12.5, color: '#4a5a6a' }}>What relevant experience do you have?</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Personal statement</span><span className="card-sub">Step 3 of 5</span></div>
        <div className="card-body">
          <div className="ai-bar">
            <svg className="ai-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#1D9E75" strokeWidth="1"/><path d="M8 5v3.5L10.5 10" stroke="#1D9E75" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <span className="ai-text">Your statement is read by AI to assess programme fit, clarity, and motivation. You will see how each section is scored after submission.</span>
            <span className="ai-badge">Transparent</span>
          </div>

          <div className="section-divider">Your statement</div>
          <div className="textarea-wrap">
            <textarea placeholder="Start writing here..." value={formData.statement} onChange={e => updateForm('statement', e.target.value)}></textarea>
          </div>
          <div className="char-row">
            <span className="char-label">Word count</span>
            <div className="char-bar-track"><div className="char-bar-fill" style={{ width: `${Math.min((words / 650) * 100, 100)}%` }}></div></div>
            <span className="char-count">{words} / 650 words</span>
          </div>
        </div>
        <div className="form-footer">
          <button className="btn-back" onClick={onBack}>← Back</button>
          <button className="btn-next" onClick={onNext}>Save & continue →</button>
        </div>
      </div>
    </div>
  )
}
