'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScoreBreakdownBar } from '@/components/score-breakdown-bar'
import { ConfidenceBadge } from '@/components/confidence-badge'
import { RecommendationBadge } from '@/components/recommendation-badge'
import { BiasFlagIndicator } from '@/components/bias-flag-indicator'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ApplicantDetailPage({ params }: { params: { id: string } }) {
  const [decision, setDecision] = useState<'admit' | 'review' | 'reject' | null>(null)
  const [overrideReason, setOverrideReason] = useState('')
  const [showOverride, setShowOverride] = useState(false)

  // Mock data - in a real app, this would come from a database
  const applicantData = {
    id: params.id,
    name: 'Chioma Eze',
    email: 'chioma.eze@email.com',
    phone: '+234 801 234 5678',
    programme: 'Computer Science',
    jambScore: 220,
    jambCutoff: 200,
    olevels: [
      { subject: 'English Language', grade: 'A1', points: 9 },
      { subject: 'Mathematics', grade: 'A1', points: 9 },
      { subject: 'Physics', grade: 'B2', points: 7 },
      { subject: 'Chemistry', grade: 'B3', points: 6 },
      { subject: 'Biology', grade: 'B2', points: 7 },
    ],
    aiScore: 78,
    maxScore: 100,
    confidence: 'high' as const,
    recommendation: 'admit' as const,
    reasoning:
      'Applicant demonstrates strong academic performance with JAMB score of 220 (above 200 cutoff) and excellent O\'level results. Consistent A and B grades indicate solid grasp of foundational concepts required for computer science. O\'level Mathematics performance (A1) is particularly relevant for the programme.',
    factors: [
      'JAMB Score above cutoff',
      'Excellent O\'level Mathematics grade',
      'Strong overall O\'level performance',
      'Consistent academic record',
      'All required subjects presented',
    ],
    biasDetected: false,
    biasExplanation: 'No systematic patterns detected that would suggest demographic-based evaluation bias.',
  }

  const scoreComponents = [
    { label: 'JAMB', percentage: 35, color: 'var(--chart-1)' },
    { label: 'O\'level', percentage: 40, color: 'var(--chart-2)' },
    { label: 'Consistency', percentage: 15, color: 'var(--chart-3)' },
    { label: 'Recency', percentage: 10, color: 'var(--chart-5)' },
  ]

  const handleDecision = (selectedDecision: 'admit' | 'review' | 'reject') => {
    setDecision(selectedDecision)
    if (selectedDecision !== applicantData.recommendation) {
      setShowOverride(true)
    } else {
      setShowOverride(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar variant="dashboard" />

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
                          <td className="py-3 px-3 font-semibold">{result.points}</td>
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
                  <p className="text-sm font-semibold mb-2">Reasoning</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {applicantData.reasoning}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-3">Factors Considered</p>
                  <ul className="space-y-2">
                    {applicantData.factors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <BiasFlagIndicator
                    detected={applicantData.biasDetected}
                    explanation={applicantData.biasExplanation}
                  />
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
                      disabled={showOverride && !overrideReason}
                    >
                      Submit Decision
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
