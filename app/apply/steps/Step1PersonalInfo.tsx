'use client'
import React from 'react'

export default function Step1PersonalInfo({ formData, updateForm, onNext, programmes }: any) {
  return (
    <div className="two-col">
      <div className="left-panel">
        <div className="avatar-card">
          <div className="avatar-ring">{formData.firstName?.charAt(0) || 'U'}{formData.lastName?.charAt(0) || ''}</div>
          <div className="avatar-name">{formData.firstName} {formData.lastName || 'New Applicant'}</div>
          <div className="avatar-sub">{formData.email || 'No email provided'}</div>
          <button className="avatar-upload">Upload photo (optional)</button>
        </div>
        <div className="info-card">
          <div className="info-row"><span className="info-key">Status</span><span className="info-val"><span className="status-dot"></span>In progress</span></div>
          <div className="info-row"><span className="info-key">Programme</span><span className="info-val" style={{ maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{programmes.find((p: any) => p.id.toString() === formData.programmeId)?.name || 'Undecided'}</span></div>
          <div className="info-row"><span className="info-key">Step</span><span className="info-val">1 of 4</span></div>
          <div className="info-row"><span className="info-key">Deadline</span><span className="info-val" style={{ color: '#c45e1a' }}>Jan 15, 2026</span></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Personal information</span><span className="card-sub">Step 1 of 4</span></div>
        <div className="card-body">
          <div className="field-grid">
            <div className="fg">
              <label>First name <span className="req">*</span></label>
              <input type="text" className={formData.firstName ? 'filled' : ''} value={formData.firstName} onChange={(e) => updateForm('firstName', e.target.value)} />
            </div>
            <div className="fg">
              <label>Last name <span className="req">*</span></label>
              <input type="text" className={formData.lastName ? 'filled' : ''} value={formData.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
            </div>
          </div>
          <div className="field-grid full">
            <div className="fg">
              <label>Email address <span className="req">*</span></label>
              <input type="email" className={formData.email ? 'filled' : ''} value={formData.email} onChange={(e) => updateForm('email', e.target.value)} />
            </div>
          </div>
          <div className="field-grid">
            <div className="fg">
              <label>Date of birth <span className="req">*</span></label>
              <input type="text" placeholder="DD / MM / YYYY" />
            </div>
            <div className="fg">
              <label>Phone number</label>
              <input type="text" className={formData.phone ? 'filled' : ''} placeholder="+44 000 000 0000" value={formData.phone} onChange={(e) => updateForm('phone', e.target.value)} />
            </div>
          </div>

          <div className="section-divider">Location & identity</div>
          <div className="field-grid">
            <div className="fg">
              <label>Country of residence <span className="req">*</span></label>
              <select><option>Nigeria</option><option>United Kingdom</option><option>Ghana</option></select>
            </div>
            <div className="fg">
              <label>Nationality <span className="req">*</span></label>
              <select value={formData.nationality} onChange={(e) => updateForm('nationality', e.target.value)}><option>Nigerian</option><option>British</option><option>Ghanaian</option></select>
            </div>
          </div>
          <div className="field-grid full" style={{ marginBottom: 14 }}>
            <div className="fg">
              <label>Gender <span className="req">*</span></label>
              <div className="radio-group">
                {['Female', 'Male', 'Prefer not to say'].map(g => (
                  <div key={g} className={`radio-opt ${formData.gender === g ? 'selected' : ''}`} onClick={() => updateForm('gender', g)}>
                    <div className={`radio-dot ${formData.gender === g ? 'on' : ''}`}></div>
                    <span className="radio-label">{g}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="section-divider">Programme Selection</div>
          <div className="field-grid full">
            <div className="fg">
              <label>Which programme are you applying for? <span className="req">*</span></label>
              <select className={formData.programmeId ? 'filled' : ''} value={formData.programmeId} onChange={(e) => updateForm('programmeId', e.target.value)}>
                <option value="">Select a programme</option>
                {programmes.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name} (Cutoff: {p.jamb_cutoff})</option>
                ))}
              </select>
            </div>
          </div>

        </div>
        <div className="form-footer">
          <span className="footer-hint">All fields marked * are required</span>
          <button className="btn-next" onClick={onNext} disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.programmeId}>Save & continue →</button>
        </div>
      </div>
    </div>
  )
}
