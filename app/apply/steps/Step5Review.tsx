'use client'
import React from 'react'

export default function Step5Review({ formData, onBack, onSubmit, isSubmitting, programmes, onEdit }: any) {
  const programmeName = programmes.find((p: any) => p.id.toString() === formData.programmeId)?.name || 'Undecided'
  const words = formData.statement ? formData.statement.trim().split(/\s+/).length : 0

  return (
    <div className="two-col two-col-right">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Review your application</span>
          <span style={{ fontSize: 12, color: '#1D9E75' }}>Ready to submit</span>
        </div>
        <div className="card-body">

          <div className="review-section">
            <div className="review-section-head">
              <span className="review-section-title">Personal information</span>
              <span className="edit-link" onClick={() => onEdit(1)}>Edit</span>
            </div>
            <div className="review-grid">
              <div className="review-field"><div className="rf-label">Full name</div><div className="rf-value">{formData.firstName} {formData.lastName}</div></div>
              <div className="review-field"><div className="rf-label">Email</div><div className="rf-value">{formData.email}</div></div>
              <div className="review-field"><div className="rf-label">Nationality</div><div className="rf-value">{formData.nationality}</div></div>
              <div className="review-field"><div className="rf-label">Programme</div><div className="rf-value">{programmeName}</div></div>
              <div className="review-field"><div className="rf-label">Gender</div><div className="rf-value">{formData.gender || 'Not specified'}</div></div>
              <div className="review-field"><div className="rf-label">JAMB Score</div><div className="rf-value">{formData.jambScore || 'N/A'}</div></div>
            </div>
          </div>

          <div className="review-section">
            <div className="review-section-head">
              <span className="review-section-title">Qualifications</span>
              <span className="edit-link" onClick={() => onEdit(2)}>Edit</span>
            </div>
            <div style={{ background: '#f8fafb', borderRadius: 8, padding: '4px 12px' }}>
              {formData.olevels.length > 0 && formData.olevels[0].subject ? (
                formData.olevels.map((o: any, i: number) => (
                  <div key={i} className="grade-row">
                    <span className="gr-subject">{o.subject}</span>
                    <span className="grade-badge grade-a">{o.grade}</span>
                  </div>
                ))
              ) : (
                <div className="grade-row"><span className="gr-subject" style={{ color: '#8a9aab' }}>No subjects added</span></div>
              )}
            </div>
          </div>

          <div className="review-section">
            <div className="review-section-head">
              <span className="review-section-title">Personal statement</span>
              <span className="edit-link" onClick={() => onEdit(3)}>Edit</span>
            </div>
            <div className="review-statement">
              {formData.statement ? (
                <>
                  {formData.statement.slice(0, 300)}
                  {formData.statement.length > 300 ? '...' : ''}
                </>
              ) : (
                <span style={{ color: '#8a9aab' }}>No statement provided.</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#8a9aab', marginTop: 6 }}>{words} words</div>
          </div>

          <div className="review-section">
            <div className="review-section-head">
              <span className="review-section-title">Supporting documents</span>
              <span className="edit-link" onClick={() => onEdit(4)}>Edit</span>
            </div>
            <div className="review-grid">
              <div className="review-field">
                <div className="rf-label">Academic transcript</div>
                <div className="rf-value">{formData.transcript ? formData.transcript.name : <span style={{ color: '#8a9aab' }}>Not uploaded</span>}</div>
              </div>
              <div className="review-field">
                <div className="rf-label">ID / passport copy</div>
                <div className="rf-value">{formData.idCopy ? formData.idCopy.name : <span style={{ color: '#8a9aab' }}>Not uploaded (Optional)</span>}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div>
        <div className="score-card">
          <div className="sc-header">
            <span className="sc-title">AI readiness Check</span>
            <span className="sc-badge">Simulation</span>
          </div>
          <div className="sc-score">?</div>
          <div className="sc-sub">Score will be generated post-submission</div>
          <div className="sc-bars">
            <div className="sc-bar-row"><span className="sc-bar-label">Academics</span><div className="sc-bar-track"><div className="sc-bar-fill fill-teal" style={{ width: '40%' }}></div></div></div>
            <div className="sc-bar-row"><span className="sc-bar-label">Statement</span><div className="sc-bar-track"><div className="sc-bar-fill fill-blue" style={{ width: '20%' }}></div></div></div>
            <div className="sc-bar-row"><span className="sc-bar-label">Completeness</span><div className="sc-bar-track"><div className="sc-bar-fill fill-amber" style={{ width: '90%' }}></div></div></div>
          </div>
        </div>

        <div className="what-next">
          <div className="wn-title">What happens after you submit</div>
          <div className="wn-step"><div className="wn-num">1</div><div className="wn-text">AI screening runs within 10 seconds of submission</div></div>
          <div className="wn-step"><div className="wn-num">2</div><div className="wn-text">An admissions officer reviews your full profile and AI score</div></div>
          <div className="wn-step"><div className="wn-num">3</div><div className="wn-text">You receive a decision with a clear written explanation</div></div>
        </div>

        <div className="consent-box">
          <div className="consent-item">
            <div className="checkbox">✓</div>
            <span className="consent-text">I confirm the information provided is accurate and complete</span>
          </div>
          <div className="consent-item">
            <div className="checkbox">✓</div>
            <span className="consent-text">I understand my application will be assessed by AI</span>
          </div>
        </div>

        <button className="submit-btn" onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit application'}
        </button>
        <button className="btn-back" style={{ width: '100%', marginTop: 10, textAlign: 'center' }} onClick={onBack} disabled={isSubmitting}>
          ← Back to Edit
        </button>
        <div className="submit-note">You cannot edit your application after submission</div>
      </div>
    </div>
  )
}
