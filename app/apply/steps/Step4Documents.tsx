'use client'
import React, { useRef } from 'react'

export default function Step4Documents({ formData, updateForm, onNext, onBack }: any) {
  const transcriptRef = useRef<HTMLInputElement>(null)
  const idRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateForm(key, file)
    }
  }

  return (
    <div className="two-col">
      <input 
        type="file" 
        ref={transcriptRef} 
        style={{ display: 'none' }} 
        onChange={(e) => handleFileChange('transcript', e)}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <input 
        type="file" 
        ref={idRef} 
        style={{ display: 'none' }} 
        onChange={(e) => handleFileChange('idCopy', e)}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      <div>
        <div className="card">
          <div className="card-header"><span className="card-title">Upload checklist</span></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ 
                display: 'flex', 
                gap: 10, 
                padding: 10, 
                background: formData.transcript ? '#f0fdf9' : '#f8fafb', 
                border: formData.transcript ? '0.5px solid #9FE1CB' : '0.5px solid #eef0f3', 
                borderRadius: 8 
              }}>
                <div style={{ 
                  background: formData.transcript ? '#1D9E75' : '#eef0f3', 
                  color: '#fff', 
                  width: 18, 
                  height: 18, 
                  borderRadius: '50%', 
                  fontSize: 9, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: formData.transcript ? 'none' : '0.5px solid #c5d0da'
                }}>
                  {formData.transcript ? '✓' : ''}
                </div>
                <span style={{ 
                  fontSize: 12.5, 
                  color: formData.transcript ? '#0F6E56' : '#8a9aab', 
                  fontWeight: formData.transcript ? 500 : 400 
                }}>
                  Academic transcript
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                gap: 10, 
                padding: 10, 
                background: formData.idCopy ? '#f0fdf9' : '#f8fafb', 
                border: formData.idCopy ? '0.5px solid #9FE1CB' : '0.5px solid #eef0f3', 
                borderRadius: 8 
              }}>
                <div style={{ 
                  background: formData.idCopy ? '#1D9E75' : '#eef0f3', 
                  color: '#fff', 
                  width: 18, 
                  height: 18, 
                  borderRadius: '50%', 
                  fontSize: 9, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  border: formData.idCopy ? 'none' : '0.5px solid #c5d0da'
                }}>
                  {formData.idCopy ? '✓' : ''}
                </div>
                <span style={{ 
                  fontSize: 12.5, 
                  color: formData.idCopy ? '#0F6E56' : '#8a9aab', 
                  fontWeight: formData.idCopy ? 500 : 400 
                }}>
                  ID / passport copy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Supporting documents</span><span className="card-sub">Step 4 of 5</span></div>
        <div className="card-body">
          <div className="doc-item">
            <div className="doc-label-row"><span className="doc-label">Academic transcript</span><span className="doc-req required">Required</span></div>
            <div className="doc-hint">Official results or predicted grades from your school or examining body</div>
            <div 
              className={`upload-zone ${formData.transcript ? 'has-file' : ''}`}
              onClick={() => transcriptRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <div className="uz-text">
                {formData.transcript ? (
                  <span style={{ color: '#1D9E75' }}>{formData.transcript.name}</span>
                ) : (
                  <><span>Click to upload</span> or drag and drop</>
                )}
              </div>
              <div className="uz-hint">PDF, JPG, PNG · Max 5MB</div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="doc-item">
            <div className="doc-label-row"><span className="doc-label">Passport / national ID</span><span className="doc-req optional">Optional</span></div>
            <div className="doc-hint">Clear scan of photo page only — used for identity verification</div>
            <div 
              className={`upload-zone ${formData.idCopy ? 'has-file' : ''}`}
              onClick={() => idRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <div className="uz-text">
                {formData.idCopy ? (
                  <span style={{ color: '#1D9E75' }}>{formData.idCopy.name}</span>
                ) : (
                  <><span>Click to upload</span> or drag and drop</>
                )}
              </div>
              <div className="uz-hint">PDF, JPG, PNG · Max 5MB</div>
            </div>
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
