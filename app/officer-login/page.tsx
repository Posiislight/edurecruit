'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function OfficerLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid credentials')
      }

      const data = await response.json()
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex flex-col">
      
      <main className="flex-1 flex items-center justify-center p-6 bg-muted/30">
        <Card className="w-full max-w-md shadow-lg border-0 bg-white">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-primary rounded-xl text-white flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
              A
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Officer Portal Login</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access the AdmitAI dashboard
            </CardDescription>
            <div className="mt-2 p-2 bg-amber-50 border border-amber-100 rounded-md text-xs text-amber-800">
              <strong>Demo Credentials:</strong><br/>
              Email: <code className="bg-amber-100/50 px-1 rounded">officer@university.edu</code><br/>
              Password: <code className="bg-amber-100/50 px-1 rounded">password123</code>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="officer@university.edu" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in to Dashboard"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center border-t bg-muted/10 p-4">
            <p className="text-sm text-muted-foreground text-center">
              Secure access provided by AdmitAI
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
