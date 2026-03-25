'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'

export interface NavbarProps {
  variant?: 'landing' | 'dashboard'
}

export function Navbar({ variant = 'landing' }: NavbarProps) {
  const pathname = usePathname()

  if (variant === 'dashboard') {
    return (
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg text-white flex items-center justify-center font-bold">A</div>
            AdmitAI
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className={pathname === '/dashboard' ? 'text-primary' : ''}>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild className={pathname === '/applicants' ? 'text-primary' : ''}>
              <Link href="/applicants">Applicants</Link>
            </Button>
            <Button variant="ghost" asChild className={pathname === '/audit' ? 'text-primary' : ''}>
              <Link href="/audit">Audit Log</Link>
            </Button>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <div className="w-8 h-8 bg-primary rounded-lg text-white flex items-center justify-center font-bold">A</div>
          AdmitAI
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/#features">Features</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/apply">Apply Now</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/officer-login">Officer Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
