'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getHardRuleReason, getTransparencyBreakdown } from '@/lib/screening-transparency'

export default function ConfirmationPage() {
  const [application, setApplication] = useState<any>(null)
  const screeningDecision = application?.screening_decision
  const logicBreakdown = getTransparencyBreakdown(screeningDecision)
  const hardRuleReason = getHardRuleReason(screeningDecision)

  useEffect(() => {
    const saved = localStorage.getItem('latest_application')
    if (saved) {
      try {
        setApplication(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved application')
      }
    }
  }, [])

  const referenceNumber = application?.reference_number || 'LOADING...'

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <section className="max-w-3xl mx-auto px-6">
        <Card className="border-0 shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="text-center pb-0 pt-10">
            <div className="flex justify-center mb-6">
              {application?.status === 'admitted' ? (
                <CheckCircle2 className="w-20 h-20 text-green-500 animate-in zoom-in duration-500" />
              ) : application?.status === 'rejected' ? (
                <XCircle className="w-20 h-20 text-red-500 animate-in zoom-in duration-500" />
              ) : (
                <CheckCircle2 className="w-20 h-20 text-[#38b2ac] animate-in zoom-in duration-500" />
              )}
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-8 p-10 pt-0">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0a192f] mb-2 tracking-tight">
                {application?.status === 'admitted' ? 'Congratulations! You are Admitted' : 
                 application?.status === 'rejected' ? 'Application Unsuccessful' :
                 'Application Submitted Successfully'}
              </h1>
              <p className="text-slate-500 max-w-md mx-auto">
                {application?.status === 'admitted' ? 'Based on your academic performance, our AI system has recommended you for immediate admission.' :
                 application?.status === 'rejected' ? 'Unfortunately, you did not meet the minimum requirements for this programme at this time.' :
                 'Your application has been received and is currently being processed.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 flex flex-col items-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Reference Number</p>
              <p className="text-3xl font-black text-[#0a192f] font-mono tracking-wider">{referenceNumber}</p>
              <div className="mt-4">
                {application?.status === 'admitted' ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 px-4 py-1.5 font-bold rounded-full">
                    ADMITTED
                  </Badge>
                ) : application?.status === 'rejected' ? (
                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 px-4 py-1.5 font-bold rounded-full">
                    REJECTED
                  </Badge>
                ) : (
                  <Badge className="bg-[#38b2ac]/10 text-[#38b2ac] hover:bg-[#38b2ac]/10 border-0 px-4 py-1.5 font-bold rounded-full">
                    PENDING REVIEW
                  </Badge>
                )}
              </div>
            </div>

            {/* AI Transparency Section for Applicant */}
            {application?.screening_decision && (
              <div className="border-t border-slate-100 pt-8 mt-4 text-left">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-5 h-5 text-[#38b2ac]" />
                  <h3 className="font-bold text-slate-900">AI Screening Transparency</h3>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">AI Score</p>
                    <p className="text-2xl font-black text-slate-900">{application.screening_decision.ai_score}/100</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                    <p className="text-lg font-bold text-slate-900 capitalize">{application.screening_decision.recommendation}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-800">Reasoning Breakdown:</p>
                  {hardRuleReason && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-700 mb-2">
                        Exact Hard Rule Triggered
                      </p>
                      <p className="text-sm text-red-900 leading-relaxed">{hardRuleReason}</p>
                    </div>
                  )}
                  <div className="space-y-3 bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200">
                    {logicBreakdown.slice(0, 3).map((step: string, idx: number) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <span className="text-slate-400 font-bold">{idx + 1}.</span>
                        <p className="text-slate-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                    <p className="text-xs text-[#38b2ac] font-medium pt-2">
                       Full logic breakdown available in the "Check Status" portal.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-4 text-left">
              <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-amber-900">Next Steps</p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {application?.status === 'admitted' ? 
                    'An admission letter has been sent to your email. Please follow the instructions to accept and pay fees.' :
                    'Our officers will conduct a final human audit of the AI decision. You will receive an official update within 48 hours.'}
                </p>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline" className="flex-1 h-12 rounded-xl">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild className="flex-1 h-12 rounded-xl bg-[#38b2ac] hover:bg-teal-600 text-white font-bold border-0 shadow-lg shadow-[#38b2ac]/20">
                <Link href="/programmes">Browse More</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
