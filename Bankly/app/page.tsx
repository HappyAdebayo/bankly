'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary mb-2">Bankly</h1>
          <p className="text-foreground/60 text-lg">Modern Banking Made Simple</p>
        </div>

        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/signin">
              Sign In
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/signup">
              Sign Up
            </Link>
          </Button>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-foreground/50 mb-4">
            This is a demo banking application
          </p>
          <p className="text-xs text-foreground/40">
            Showcasing authentication and password recovery flows
          </p>
        </div>
      </div>
    </div>
  )
}
