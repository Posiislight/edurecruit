'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Microscope, Users } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
            Fair, Transparent, Explainable University Admissions
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            AI-powered screening where every decision comes with a reason
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link href="/apply">Apply Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/officer-login">Officer Login</Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16" id="features">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Microscope className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Explainable AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Every decision is backed by clear, understandable reasoning. Know exactly how your application was evaluated.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Bias Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced bias detection algorithms ensure fair evaluation across all demographics and backgrounds.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Human Oversight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Admissions officers retain complete control with the ability to review and override any AI recommendation.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 AdmitAI. Fair admissions through transparent AI.</p>
        </div>
      </footer>
    </div>
  )
}
