'use client'
import React from 'react'

const COMMON_SUBJECTS = [
  'Agricultural Science',
  'Arabic',
  'Biology',
  'Book Keeping',
  'Chemistry',
  'Christian Religious Studies',
  'Civic Education',
  'Commerce',
  'Computer Studies',
  'Data Processing',
  'Economics',
  'English Language',
  'Financial Accounting',
  'Food and Nutrition',
  'French',
  'Further Mathematics',
  'Geography',
  'Government',
  'Hausa',
  'Health Education',
  'History',
  'Home Management',
  'Igbo',
  'Islamic Studies',
  'Literature in English',
  'Marketing',
  'Mathematics',
  'Music',
  'Physics',
  'Technical Drawing',
  'Visual Arts',
  'Yoruba',
]

const GRADE_OPTIONS = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9']

export default function Step2Qualifications({ formData, updateForm, onNext, onBack }: any) {
  const addSubject = () => {
    updateForm('olevels', [...formData.olevels, { subject: '', grade: '' }])
  }

  const updateSubject = (index: number, key: string, value: string) => {
    const newItems = [...formData.olevels]
    newItems[index][key] = value
    updateForm('olevels', newItems)
  }

  const subjectOptions = Array.from(
    new Set([
      ...COMMON_SUBJECTS,
      ...formData.olevels.map((item: any) => item.subject).filter(Boolean),
    ]),
  ).sort((left, right) => left.localeCompare(right))

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from(
    new Set([
      formData.year,
      ...Array.from({ length: 8 }, (_, index) => String(currentYear - index)),
    ].filter(Boolean)),
  ).sort((left, right) => Number(right) - Number(left))

  return (
    <div className="two-col">
      <div>
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontSize: 14, fontWeight: 500, color: '#0a1628', marginBottom: 10 }}>Qualification Guidelines</h3>
            <p style={{ fontSize: 13, color: '#5a6a7a', lineHeight: 1.5 }}>
              Enter your O&apos;Level subjects and grades manually below. Please ensure you include English Language,
              Mathematics, and every subject required for your chosen programme.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Qualifications & grades</span><span className="card-sub">Step 2 of 4</span></div>
        <div className="card-body">

          <div className="ai-bar">
            <svg className="ai-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#1D9E75" strokeWidth="1"/><path d="M8 5v3.5L10.5 10" stroke="#1D9E75" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <span className="ai-text">Your grades are assessed transparently by AI. You will see exactly how each subject contributes to your score after submission.</span>
          </div>

          <div className="doc-item">
            <div className="doc-label-row">
              <span className="doc-label">Manual O&apos;Level entry</span>
            </div>
            <div className="doc-hint">
              Add each subject exactly once and choose the matching grade. Use the button below the table if you need
              more rows.
            </div>
          </div>

          <div className="field-grid">
             <div className="fg">
              <label>JAMB Score <span className="req">*</span></label>
              <input type="number" placeholder="Out of 400" value={formData.jambScore} onChange={(e) => updateForm('jambScore', e.target.value)} />
            </div>
            <div className="fg">
              <label>Year of completion <span className="req">*</span></label>
              <select value={formData.year} onChange={(e) => updateForm('year', e.target.value)}>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
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
                      {subjectOptions.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select style={{ border: 'none', background: 'transparent', outline: 'none', cursor: 'pointer' }} value={obj.grade} onChange={e => updateSubject(idx, 'grade', e.target.value)}>
                      <option value="">Grade</option>
                      {GRADE_OPTIONS.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button type="button" className="avatar-upload" style={{ background: '#f8fafb', color: '#0a1628', border: '1px dashed #dde3ea' }} onClick={addSubject}>+ Add another subject</button>

        </div>
        <div className="form-footer">
          <button className="btn-back" onClick={onBack}>← Back</button>
          <button className="btn-next" onClick={onNext} disabled={!formData.jambScore || !formData.olevels[0]?.subject}>Save & continue →</button>
        </div>
      </div>
    </div>
  )
}
