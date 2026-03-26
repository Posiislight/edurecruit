'use client'
import React from 'react'

export default function Step2Qualifications({ formData, updateForm, onNext, onBack }: any) {
  
  const addSubject = () => {
    updateForm('olevels', [...formData.olevels, { subject: '', grade: '' }])
  }

  const updateSubject = (index: number, key: string, value: string) => {
    const newItems = [...formData.olevels]
    newItems[index][key] = value
    updateForm('olevels', newItems)
  }

  const commonSubjects = [
    'English Language',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Agricultural Science',
    'Economics',
    'Government',
    'Literature in English',
    'Geography',
    'Christian Religious Studies',
    'Islamic Studies',
    'Civic Education',
    'Further Mathematics',
    'Commerce',
    'Financial Accounting',
    'Technical Drawing',
    'Visual Arts',
    'Music',
    'French',
    'Arabic'
  ]

  return (
    <div className="two-col">
      <div>
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontSize: 14, fontWeight: 500, color: '#0a1628', marginBottom: 10 }}>Qualification Guidelines</h3>
            <p style={{ fontSize: 13, color: '#5a6a7a', lineHeight: 1.5 }}>Please list your O'Level or A-Level equivalent grades. Ensure you include English Language and Mathematics.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Qualifications & grades</span><span className="card-sub">Step 2 of 5</span></div>
        <div className="card-body">

          <div className="ai-bar">
            <svg className="ai-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#1D9E75" strokeWidth="1"/><path d="M8 5v3.5L10.5 10" stroke="#1D9E75" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <span className="ai-text">Your grades are assessed transparently by AI. You will see exactly how each subject contributes to your score after submission.</span>
          </div>

          <div className="field-grid">
             <div className="fg">
              <label>JAMB Score <span className="req">*</span></label>
              <input type="number" placeholder="Out of 400" value={formData.jambScore} onChange={(e) => updateForm('jambScore', e.target.value)} />
            </div>
            <div className="fg">
              <label>Year of completion <span className="req">*</span></label>
              <select value={formData.year} onChange={(e) => updateForm('year', e.target.value)}><option>2024</option><option>2023</option><option>2022</option><option>2021</option></select>
            </div>
          </div>
          
          <div className="field-grid full">
             <div className="fg">
              <label>Number of sittings <span className="req">*</span></label>
              <select value={formData.number_of_sittings} onChange={(e) => updateForm('number_of_sittings', parseInt(e.target.value))}><option value="1">1</option><option value="2">2</option></select>
            </div>
          </div>

          <table className="grade-table" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th style={{ width: '60%' }}>Subject</th>
                <th style={{ width: '40%' }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {formData.olevels.map((obj: any, idx: number) => (
                <tr key={idx}>
                  <td>
                    <select 
                      style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', cursor: 'pointer' }} 
                      value={obj.subject} 
                      onChange={e => updateSubject(idx, 'subject', e.target.value)}
                    >
                      <option value="">Select Subject</option>
                      {commonSubjects.sort().map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select style={{ border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }} value={obj.grade} onChange={e => updateSubject(idx, 'grade', e.target.value)}>
                      <option value="">Grade</option>
                      <option value="A1">A1</option>
                      <option value="B2">B2</option>
                      <option value="B3">B3</option>
                      <option value="C4">C4</option>
                      <option value="C5">C5</option>
                      <option value="C6">C6</option>
                      <option value="D7">D7</option>
                      <option value="E8">E8</option>
                      <option value="F9">F9</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <button className="avatar-upload" style={{ background: '#f8fafb', color: '#0a1628', border: '1px dashed #dde3ea' }} onClick={addSubject}>+ Add another subject</button>

        </div>
        <div className="form-footer">
          <button className="btn-back" onClick={onBack}>← Back</button>
          <button className="btn-next" onClick={onNext} disabled={!formData.jambScore || !formData.olevels[0]?.subject}>Save & continue →</button>
        </div>
      </div>
    </div>
  )
}
