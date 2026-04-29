'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerifyResetCode() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get email from session storage (set in forgot-password page)
    const storedEmail = sessionStorage.getItem('resetEmail')
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email, redirect back to forgot-password
      router.push('/forgot-password')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // For demo/simplicity, we just store the code and move to the next step
    // The actual verification happens on the final step at the backend
    if (code.length > 0) {
      sessionStorage.setItem('resetCode', code)
      router.push('/reset-password')
    } else {
      alert('Please enter a valid code')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/">
              <span className="text-2xl font-bold text-primary">Bankly</span>
            </Link>
          </div>
          <CardTitle>Verify Reset Code</CardTitle>
          <CardDescription>Step 2: Enter the code we sent</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Reset Code</label>
              <Input
                type="text"
                placeholder="Enter the 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-foreground/60 py-2">
              Check your email for the reset code. It may take a few moments to arrive.
            </p>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-foreground/60">
              Didn&apos;t receive a code?{' '}
              <Link href="/forgot-password" className="text-primary font-semibold hover:underline">
                Try again
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
