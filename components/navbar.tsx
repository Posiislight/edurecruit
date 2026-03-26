'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/applicants') || pathname.startsWith('/audit')
  const variant = isDashboard ? 'dashboard' : 'landing'

  const handleSignOut = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/officer-login')
  }

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
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-[#f6f7f9] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl text-[#1a3042]">
          EduRecruit
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-[#38b2ac]' : 'text-slate-600 hover:text-slate-900'}`}>Home</Link>
          <Link href="/programmes" className={`text-sm font-medium transition-colors ${pathname === '/programmes' ? 'text-[#38b2ac]' : 'text-slate-600 hover:text-slate-900'}`}>Programmes</Link>
          <Link href="/apply" className={`text-sm font-medium transition-colors ${pathname === '/apply' ? 'text-[#38b2ac]' : 'text-slate-600 hover:text-slate-900'}`}>Apply</Link>
          <Link href="/application-status" className={`text-sm font-medium transition-colors ${pathname === '/application-status' ? 'text-[#38b2ac]' : 'text-slate-600 hover:text-slate-900'}`}>Check Status</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/officer-login" className="hidden sm:inline-flex text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Officer Login
          </Link>
          <Button asChild className="bg-[#38b2ac] hover:bg-teal-500 text-white rounded-full px-6 font-medium shadow-sm transition-all">
            <Link href="/apply">Start Application</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
