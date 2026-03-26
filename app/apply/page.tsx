'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import './flow.css'
import { fetchApi } from '@/lib/api'

// Sub-components for steps
import Step1PersonalInfo from './steps/Step1PersonalInfo'
import Step2Qualifications from './steps/Step2Qualifications'
import Step3Statement from './steps/Step3Statement'
import Step4Documents from './steps/Step4Documents'
import Step5Review from './steps/Step5Review'

export default function ApplyFlowPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [programmes, setProgrammes] = useState<any[]>([])
  
  // Application State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    programmeId: '',
    jambScore: '',
    
    // Step 2
    year: '2024',
    olevels: [{ subject: '', grade: '' }],
    number_of_sittings: 1,

    // Step 3
    statement: '',

    // Step 4
    transcript: null as File | null,
    idCopy: null as File | null,

    // Mocks for others
    gender: 'Prefer not to say',
    nationality: 'Nigerian',
    documents: [],
  })

  // Load programs
  useEffect(() => {
    fetchApi('/api/programmes/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProgrammes(data)
        } else if (data && Array.isArray(data.results)) {
          setProgrammes(data.results)
        } else {
          console.error("Unexpected API response format:", data)
          setProgrammes([])
        }
      })
      .catch(console.error)
  }, [])

  const steps = [
    { title: 'Personal info', id: 1 },
    { title: 'Qualifications', id: 2 },
    { title: 'Statement', id: 3 },
    { title: 'Documents', id: 4 },
    { title: 'Review', id: 5 },
  ]

  const handleNext = () => setCurrentStep(s => Math.min(s + 1, 5))
  const handleBack = () => setCurrentStep(s => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    if (!formData.programmeId) {
      alert('Please select a programme in Step 1')
      setCurrentStep(1)
      return
    }
    if (!formData.jambScore) {
      alert('Please enter your JAMB score in Step 2')
      setCurrentStep(2)
      return
    }

    setIsSubmitting(true)
    try {
      // Use FormData for multi-part submission (including files)
      const formDataObj = new FormData()
      
      formDataObj.append('student_name', `${formData.firstName} ${formData.lastName}`.trim())
      formDataObj.append('email', formData.email)
      formDataObj.append('phone', formData.phone)
      formDataObj.append('programme', formData.programmeId)
      formDataObj.append('jamb_score', formData.jambScore)
      formDataObj.append('olevel_results', JSON.stringify(formData.olevels.filter(o => o.subject && o.grade)))
      formDataObj.append('state_of_origin', 'Lagos')
      formDataObj.append('number_of_sittings', formData.number_of_sittings.toString())
      formDataObj.append('result_year', (formData.year || '2024').toString())
      
      if (formData.transcript) {
        formDataObj.append('transcript_upload', formData.transcript)
      }
      if (formData.idCopy) {
        formDataObj.append('id_upload', formData.idCopy)
      }

      const res = await fetchApi('/api/applications/', {
        method: 'POST',
        // Do not set Content-Type header, let the browser set it for FormData
        headers: {}, 
        body: formDataObj
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: 'Unknown error' }))
        console.error('Submission error:', errorData)
        
        // Format the error message for the user
        let errorMsg = 'Failed to submit application:\n'
        if (typeof errorData === 'object') {
          Object.entries(errorData).forEach(([key, val]) => {
            errorMsg += `- ${key}: ${Array.isArray(val) ? val.join(', ') : val}\n`
          })
        } else {
          errorMsg += errorData
        }
        
        alert(errorMsg)
        throw new Error('Failed to submit application')
      }
      
      const data = await res.json()
      // Store the app data for the confirmation page to show the result immediately
      localStorage.setItem('latest_application', JSON.stringify(data))
      
      router.push('/confirmation')
    } catch (err: any) {
      console.error(err)
      if (!err.message?.includes('Failed to submit')) {
        alert('Error submitting application: ' + err.message)
      }
      setIsSubmitting(false)
    }
  }

  const updateForm = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  // Calculate generic progress percentage
  const progressPercent = ((currentStep - 1) / 4) * 100

  return (
    <div className="apply-flow-wrapper">
      <div className="app-header">
        <div className="sub-header">
          <div className="page-title">Your application</div>
          <div className="page-meta">
            {(Array.isArray(programmes) ? programmes : []).find(p => p.id?.toString() === formData.programmeId)?.name || 'Undecided Programme'} · 2025/26
          </div>
          
          <div className="steps-row">
            {steps.map((step, idx) => {
              const isActive = currentStep === step.id
              const isDone = currentStep > step.id
              return (
                <div key={step.id} className={idx < steps.length - 1 ? "s-seg" : ""}>
                  <div className="s-inner" onClick={() => currentStep > step.id && setCurrentStep(step.id)}>
                    <div className={`s-circle ${isActive ? 'active' : isDone ? 'done' : 'idle'}`}>
                      {isDone ? '✓' : step.id}
                    </div>
                    <span className={`s-name ${isActive ? 'active' : isDone ? 'done' : 'idle'}`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`s-line ${isDone ? 'done' : 'idle'}`}></div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="active-underline" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="flow-body">
        {currentStep === 1 && (
          <Step1PersonalInfo 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext}
            programmes={programmes}
          />
        )}
        {currentStep === 2 && (
          <Step2Qualifications 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <Step3Statement 
            formData={formData} 
            updateForm={updateForm} 
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && (
          <Step4Documents 
            formData={formData}
            updateForm={updateForm}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 5 && (
          <Step5Review 
            formData={formData} 
            onBack={handleBack}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            programmes={programmes}
            onEdit={setCurrentStep}
          />
        )}
      </div>
    </div>
  )
}
