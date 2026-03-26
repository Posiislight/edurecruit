'use client'

import Link from 'next/link'
import { CheckCircle2, Eye, CircleHelp, Scale } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#1a2f44] py-24 text-white w-full border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-slate-400 text-sm font-medium mb-4 tracking-wide">Fair, Explainable AI for University Admissions</p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1]">
            Every Decision<br />
            <span className="text-[#38b2ac]">Explained</span><span className="text-amber-400">.</span>
          </h1>
          <div className="text-slate-300 max-w-xl text-lg mb-12 leading-relaxed space-y-1 font-light">
            <p>AI-powered admissions screening with full transparency.</p>
            <p>Students know why decisions are made.</p>
            <p>Officers can audit every step.</p>
            <p>Humans remain in control.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-sm font-medium text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-[#38b2ac] w-5 h-5" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-[#38b2ac] w-5 h-5" />
              <span>Bias-Audited</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-[#38b2ac] w-5 h-5" />
              <span>Human-in-the-Loop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#f8f9fa] py-24 w-full border-t border-slate-200 border-dashed">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Why EduRecruit</h2>
            <p className="text-slate-600 text-lg">Accountability and fairness at every step of the admissions process.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col items-center border border-slate-100/50">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-400">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Transparency</h3>
              <p className="text-slate-600 leading-relaxed text-sm w-[90%] mx-auto">
                Every AI decision comes with a clear, human readable explanation. No black boxes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-10 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col items-center border border-slate-100/50">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-400">
                <CircleHelp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Bias Detection</h3>
              <p className="text-slate-600 leading-relaxed text-sm w-[90%] mx-auto">
                Built-in fairness auditing flags potential bias before any decision is finalised.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-10 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col items-center border border-slate-100/50">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-rose-400">
                <Scale className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Human Final Call</h3>
              <p className="text-slate-600 leading-relaxed text-sm w-[90%] mx-auto">
                AI assists &mdash; humans decide. Officers review, override, and approve every application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a2f44] py-16 text-slate-300 w-full mt-auto border-t border-slate-800 border-dashed">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">EduRecruit</h2>
              <p className="text-sm text-slate-400 max-w-sm">
                Transparent, explainable, and fair AI-powered university admissions.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-white mb-1">Platforms</h3>
              <Link href="/programmes" className="text-sm hover:text-white transition-colors">Programmes</Link>
              <Link href="/apply" className="text-sm hover:text-white transition-colors">Apply</Link>
              <Link href="/application-status" className="text-sm hover:text-white transition-colors">Status</Link>
              <Link href="/officer-login" className="text-sm hover:text-white transition-colors">Officer Portals</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold text-white mb-1">Trust & Transparency</h3>
              <span className="text-sm hover:text-white transition-colors cursor-pointer">Every Decision Explained</span>
              <span className="text-sm hover:text-white transition-colors cursor-pointer">Bias Detection Built-in</span>
              <span className="text-sm hover:text-white transition-colors cursor-pointer">Human Final Review Always</span>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8 flex items-center justify-center md:justify-start">
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span>&copy;</span> 2026 EduRecruit. Fairness in Admission
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
