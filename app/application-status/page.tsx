'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Clock, ShieldCheck, HelpCircle } from 'lucide-react'
import { fetchApi } from '@/lib/api'
import { getHardRuleReason, getScoreBreakdown, getTransparencyBreakdown } from '@/lib/screening-transparency'

export default function StudentStatusPage() {
  const [refNumber, setRefNumber] = useState('')
  const [application, setApplication] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const screeningDecision = application?.screening_decision
  const reasonSummary = getTransparencyBreakdown(screeningDecision)
  const scoreBreakdown = getScoreBreakdown(screeningDecision)
  const hardRuleReason = getHardRuleReason(screeningDecision)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setApplication(null)

    try {
      const res = await fetchApi(`/api/applications/track/?reference_number=${encodeURIComponent(refNumber)}`)
      
      if (res.status === 404) {
        setError('Application not found. Please check your reference number.')
        return
      }

      if (!res.ok) {
        throw new Error('Failed to track')
      }

      const data = await res.json()
      setApplication(data)
    } catch (err) {
      setError('Failed to fetch application status. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-20 flex flex-col items-center">
        <div className="text-center mb-12 max-w-2xl px-4">
          <h1 className="text-4xl font-extrabold text-[#0a192f] mb-4 tracking-tight">Track Your Application</h1>
          <p className="text-slate-600 text-lg font-light leading-relaxed">
            Enter your reference number to see your status and screening transparency report.
          </p>
        </div>

        {!application ? (
          <Card className="w-full max-w-xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.08)] border-0 rounded-2xl overflow-hidden mb-20 animate-in fade-in zoom-in-95 duration-500">
            <CardHeader className="p-10 pb-2">
              <CardTitle className="text-xl font-bold text-slate-900">Application Details</CardTitle>
              <CardDescription className="text-slate-500 font-normal">Use the reference number sent after your application was submitted.</CardDescription>
            </CardHeader>
            <CardContent className="p-10 pt-6">
              <form onSubmit={handleTrack} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800">Reference Number</label>
                  <Input 
                    placeholder="e.g. ADM-2026-XXXX" 
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    required
                    className="h-12 bg-slate-50/50 border-slate-200 focus-visible:ring-1 focus-visible:ring-primary rounded-lg"
                  />
                </div>
                <div className="pt-2">
                  <Button type="submit" className="w-full h-12 bg-[#051e56] hover:bg-[#03153c] text-white rounded-lg font-bold shadow-lg shadow-[#051e56]/20 transition-all text-base" disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Track Application'}
                  </Button>
                </div>
                {error && <p className="text-sm text-red-600 mt-4 text-center">{error}</p>}
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20">
            {/* ... Rest of existing application display logic ... */}
            <Card className="border-0 shadow-xl overflow-hidden rounded-2xl">
              <div className={`h-2 ${
                application.status === 'admitted' ? 'bg-green-500' : 
                application.status === 'rejected' ? 'bg-red-500' :
                application.status === 'screened' ? 'bg-blue-500' : 'bg-amber-500'
              }`} />
              <CardContent className="p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <p className="text-xs font-bold text-[#38b2ac] uppercase tracking-widest mb-2">
                      REF: {application.reference_number}
                    </p>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-1">{application.student_name}</h2>
                    <p className="text-slate-600 text-lg">{application.programme?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Current Status</p>
                    <div className="flex items-center gap-2">
                      {application.status === 'admitted' ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 flex gap-2 items-center px-4 py-2 font-bold rounded-full">
                          <CheckCircle2 className="w-5 h-5" /> Admitted
                        </Badge>
                      ) : application.status === 'rejected' ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 flex gap-2 items-center px-4 py-2 font-bold rounded-full">
                          <XCircle className="w-5 h-5" /> Not Successful
                        </Badge>
                      ) : application.status === 'review' ? (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 flex gap-2 items-center px-4 py-2 font-bold rounded-full">
                          <Clock className="w-5 h-5" /> Manual Review Required
                        </Badge>
                      ) : application.status === 'screened' ? (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 flex gap-2 items-center px-4 py-2 font-bold rounded-full">
                          <ShieldCheck className="w-5 h-5" /> AI Screened
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 flex gap-2 items-center px-4 py-2 font-bold rounded-full">
                          <Clock className="w-5 h-5" /> In Screening
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transparency Report */}
            <Card className="border-0 shadow-xl bg-white rounded-2xl overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 p-8 pt-10">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#38b2ac]" />
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">AI Transparency Report</CardTitle>
                    <CardDescription className="text-slate-500">How your entry was evaluated by our "Glass-Box" AI.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="p-10 border-r border-slate-100 space-y-8">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-[0.2em]">Evaluation Criteria</h3>
                    <div className="space-y-5">
                      <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis mr-2">JAMB Score (400)</span>
                        <span className="font-extrabold text-slate-900">{application.jamb_score}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis mr-2">O'level Sittings</span>
                        <span className="font-extrabold text-slate-900">{application.number_of_sittings === 1 ? 'Single' : 'Combined'}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis mr-2">Result Recency</span>
                        <span className="font-extrabold text-slate-900">{application.result_year}</span>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-[#38b2ac]/5 rounded-xl border border-[#38b2ac]/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                         <ShieldCheck className="w-16 h-16" />
                      </div>
                      <div className="flex gap-4 relative z-10">
                        <HelpCircle className="w-6 h-6 text-[#38b2ac] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-[#38b2ac] uppercase tracking-widest mb-1">Trust Guarantee</p>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            Your application was screened purely on academic merit. 
                            Our AI is programmed to ignore all demographic factors like gender or origin.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-10 bg-slate-50/40 space-y-8">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-[0.2em]">Reason Summary</h3>
                    {hardRuleReason && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-red-700 mb-2">
                          Exact Hard Rule Triggered
                        </p>
                        <p className="text-sm font-medium text-red-900 leading-relaxed">
                          {hardRuleReason}
                        </p>
                      </div>
                    )}
                    <div className="space-y-6">
                      {reasonSummary.length > 0 ? (
                        reasonSummary.map((step: string, idx: number) => (
                          <div key={idx} className="flex gap-4 text-sm items-start">
                             <div className="w-5 h-5 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-slate-400">
                               {idx + 1}
                             </div>
                             <p className="text-slate-600 leading-relaxed">
                               {step}
                             </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 italic">
                          Manual review notes will appear here after screening is complete.
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-[0.2em]">Score Breakdown</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {scoreBreakdown.map((item) => (
                          <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{item.label}</p>
                            <p className="text-lg font-bold text-slate-900">{item.score}/{item.max}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-8">
              <Button variant="ghost" className="text-slate-400 hover:text-[#38b2ac] font-medium transition-colors" onClick={() => setApplication(null)}>
                Track another application
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2f44] py-16 text-slate-300 w-full mt-auto border-t border-slate-800 border-dashed">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 font-sans">UniLink</h2>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Transparent, explainable, and fair AI-powered university admissions.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-widest">Platforms</h3>
              <Link href="/programmes" className="text-sm hover:text-white transition-colors">Programmes</Link>
              <Link href="/apply" className="text-sm hover:text-white transition-colors">Apply</Link>
              <Link href="/application-status" className="text-sm hover:text-white transition-colors">Status</Link>
              <Link href="/officer-login" className="text-sm hover:text-white transition-colors">Officer Portals</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-widest">Trust</h3>
              <span className="text-sm hover:text-white transition-colors cursor-pointer">Every Decision Explained</span>
              <span className="text-sm hover:text-white transition-colors cursor-pointer">Bias Detection Built-in</span>
              <span className="text-sm hover:text-white transition-colors cursor-pointer">Human Final Review</span>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 text-center md:text-left">
            <p className="text-xs text-slate-500">
              &copy; 2026 UniLink. Fairness in Admission
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
