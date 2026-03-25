'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CheckCircle2, Clock } from 'lucide-react'

export default function ConfirmationPage() {
  const referenceNumber = `ADMIT-${Date.now().toString().slice(-9)}`

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-2xl mx-auto px-6 py-12">
        <Card className="border-0 shadow-sm">
          <CardHeader className="text-center pb-0">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Application Submitted Successfully
              </h1>
              <p className="text-muted-foreground">
                Your application is being screened by our AI system
              </p>
            </div>

            <div className="bg-primary/10 border border-primary rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Your Reference Number</p>
              <p className="text-2xl font-bold text-primary font-mono">{referenceNumber}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Save this number for your records
              </p>
            </div>

            <div className="bg-accent/10 border border-accent rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="font-semibold text-sm">Expected Response Timeline</p>
                  <p className="text-xs text-muted-foreground">
                    Your application will be reviewed within 2-3 weeks. You&apos;ll receive an email notification with the results.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                An email confirmation has been sent to your registered email address.
              </p>
              <p>
                You can track your application status at any time using your reference number.
              </p>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">Return Home</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/programmes">Browse More Programmes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
