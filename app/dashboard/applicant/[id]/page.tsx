'use client'

import { useState, use, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScoreBreakdownBar } from '@/components/score-breakdown-bar'
import { ConfidenceBadge } from '@/components/confidence-badge'
import { RecommendationBadge } from '@/components/recommendation-badge'
import { BiasFlagIndicator } from '@/components/bias-flag-indicator'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fetchApi } from '@/lib/api'

export default function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [decision, setDecision] = useState<'admit' | 'review' | 'reject' | null>(null)
  const [overrideReason, setOverrideReason] = useState('')
  const [showOverride, setShowOverride] = useState(false)
  
  const router = useRouter()
  const [applicantData, setApplicantData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchApi(`/api/applications/${id}/`)
      .then(res => res.json())
      .then(data => {
        const sd = data.screening_decision || {}
        setApplicantData({
          id: data.id,
          name: data.student_name,
          email: data.email,
          phone: data.phone,
          programme: data.programme?.name || 'Unknown',
          jambScore: data.jamb_score,
          jambCutoff: data.programme?.jamb_cutoff || 200,
          olevels: data.olevel_results || [],
          aiScore: data.ai_score || 0,
          maxScore: 100,
          confidence: sd.confidence || 'low',
          recommendation: sd.recommendation === 'admit' ? 'admit' : (sd.recommendation === 'reject' ? 'reject' : 'review'),
          reasoning: sd.reasoning || 'No reasoning available.',
          summaryPoints: sd.factors_used || [],
          biasDetected: sd.bias_flag || false,
          biasExplanation: sd.bias_explanation || 'No bias detected.',
          auditPassed: sd.audit_passed ?? true,
          auditRemarks: sd.audit_remarks || '',
          identifiedRisks: sd.identified_risks || [],
          status: data.status,
          jambComponent: sd.jamb_component || 0,
          olevelComponent: sd.olevel_component || 0,
          sittingComponent: sd.sitting_component || 0,
          recencyComponent: sd.recency_component || 0,
        })
      })
      .catch(err => console.error("Failed to load:", err))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading || !applicantData) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse font-medium">Loading applicant details...</p>
        </div>
      </div>
    )
  }

  const scoreDetails = [
    { label: 'JAMB', points: applicantData.jambComponent || 0, max: 50, color: 'var(--chart-1)' },
    { label: 'O\'level', points: applicantData.olevelComponent || 0, max: 30, color: 'var(--chart-2)' },
    { label: 'Consistency', points: applicantData.sittingComponent || 0, max: 10, color: 'var(--chart-3)' },
    { label: 'Recency', points: applicantData.recencyComponent || 0, max: 10, color: 'var(--chart-5)' },
  ]
  const scoreComponents = scoreDetails.map(({ label, points, color }) => ({
    label,
    percentage: points,
    color,
  }))

  const handleDecision = (selectedDecision: 'admit' | 'review' | 'reject') => {
    setDecision(selectedDecision)
    if (selectedDecision !== applicantData.recommendation) {
      setShowOverride(true)
    } else {
      setShowOverride(false)
      setOverrideReason('')
    }
  }

  const handleSubmit = async () => {
    if (!decision) return
    setIsSubmitting(true)

    const payloadDecision = decision === 'admit' ? 'admitted' : (decision === 'reject' ? 'rejected' : 'review')

    try {
      const res = await fetchApi('/api/decisions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: parseInt(id as string),
          decision: payloadDecision,
          override_reason: overrideReason
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.override_reason?.[0] || 'Failed to submit decision')
      }

      router.push('/dashboard')
    } catch (e: any) {
      alert(e.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <section className="max-w-6xl mx-auto px-6 py-8">
        <Link href="/applicants" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Applicants
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Personal & Academic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student Info Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Applicant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-semibold">{applicantData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-sm">{applicantData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-semibold">{applicantData.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Programme</p>
                    <p className="font-semibold text-primary">{applicantData.programme}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* JAMB Score Card */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>JAMB Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-4xl font-bold text-primary">{applicantData.jambScore}</p>
                    <p className="text-xs text-muted-foreground">/ 400</p>
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-muted rounded-full overflow-hidden flex items-center">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${(applicantData.jambScore / 400) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {applicantData.jambScore >= applicantData.jambCutoff ? (
                        <span className="text-green-600 font-semibold">
                          ✓ Above cutoff ({applicantData.jambCutoff})
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          ✗ Below cutoff ({applicantData.jambCutoff})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* O\'level Results */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>O&apos;level Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Subject</th>
                        <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Grade</th>
                        <th className="text-left py-2 px-3 font-semibold text-muted-foreground">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicantData.olevels.map((result, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-3">{result.subject}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
                              {result.grade}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-semibold">{result.points || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* AI Score Card - Large */}
            <Card className="border-0 shadow-sm border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle>AI Screening Score</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ScoreBreakdownBar
                  components={scoreComponents}
                  totalScore={applicantData.aiScore}
                  maxScore={applicantData.maxScore}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Confidence Level</p>
                    <ConfidenceBadge level={applicantData.confidence} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Recommendation</p>
                    <RecommendationBadge recommendation={applicantData.recommendation} />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">Short reason summary</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {applicantData.reasoning}
                  </p>
                  {applicantData.summaryPoints.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {applicantData.summaryPoints.map((point: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-3">Score breakdown</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {scoreDetails.map((component) => (
                      <div key={component.label} className="rounded-lg border border-slate-200 bg-white/70 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: component.color }}
                            />
                            <span className="text-sm font-medium text-slate-700">{component.label}</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">
                            {component.points}/{component.max}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <BiasFlagIndicator
                    detected={applicantData.biasDetected}
                    explanation={applicantData.biasExplanation}
                  />
                </div>

                <div className={`mt-4 pt-4 border-t rounded-lg p-4 ${applicantData.auditPassed ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                   <div className="flex items-center gap-2 mb-2">
                     <div className={`w-2 h-2 rounded-full ${applicantData.auditPassed ? 'bg-green-500' : 'bg-red-500'}`} />
                     <p className="text-sm font-bold text-slate-900">Ethics Auditor Verification</p>
                     <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${applicantData.auditPassed ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                        {applicantData.auditPassed ? 'Passed' : 'Risk Detected'}
                     </span>
                   </div>
                   <p className="text-xs text-slate-700 leading-relaxed italic">
                     &ldquo;{applicantData.auditRemarks || (applicantData.auditPassed ? 'No ethics violations or proxy biases identified in the primary screening.' : 'Primary AI decision shows signs of bias or logical inconsistency.')}&rdquo;
                   </p>
                   {applicantData.identifiedRisks.length > 0 && (
                     <div className="mt-3 space-y-1">
                        <p className="text-[10px] font-bold text-red-700 uppercase">Identified Risks:</p>
                        {applicantData.identifiedRisks.map((risk: string, idx: number) => (
                          <p key={idx} className="text-[10px] text-red-600 flex items-center gap-1">
                            <span className="w-1 h-1 bg-red-400 rounded-full" /> {risk}
                          </p>
                        ))}
                     </div>
                   )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Decision */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm sticky top-8">
              <CardHeader>
                <CardTitle>Officer Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Review and make your final decision on this application.
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleDecision('admit')}
                    variant={decision === 'admit' ? 'default' : 'outline'}
                    className={`w-full justify-start ${decision === 'admit' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    ✓ Admit
                  </Button>
                  <Button
                    onClick={() => handleDecision('review')}
                    variant={decision === 'review' ? 'default' : 'outline'}
                    className={`w-full justify-start ${decision === 'review' ? 'bg-amber-600 hover:bg-amber-700' : ''}`}
                  >
                    ⚠ Send for Review
                  </Button>
                  <Button
                    onClick={() => handleDecision('reject')}
                    variant={decision === 'reject' ? 'default' : 'outline'}
                    className={`w-full justify-start ${decision === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  >
                    ✗ Reject
                  </Button>
                </div>

                {decision && (
                  <>
                    {showOverride && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-xs font-semibold text-amber-900 mb-2">
                          ⚠ Overriding AI Recommendation
                        </p>
                        <p className="text-xs text-amber-800 mb-3">
                          You are overriding the AI recommendation of &quot;{applicantData.recommendation}&quot;. Please provide a reason.
                        </p>
                        <Textarea
                          placeholder="Explain your decision..."
                          value={overrideReason}
                          onChange={(e) => setOverrideReason(e.target.value)}
                          className="min-h-20 text-xs"
                        />
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-900">
                        <span className="font-semibold">⚠ Warning:</span> This decision will be logged permanently in the audit trail.
                      </p>
                    </div>

                    <Button
                      className="w-full"
                      disabled={(showOverride && !overrideReason) || isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Decision"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
