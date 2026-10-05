'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

export function AdminLogin({
  onLogin,
}: {
  onLogin: (adminEmail?: string) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid email or password.')
        return
      }

      onLogin(data.admin?.email)
    } catch {
      setError('Unable to connect to the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h1 className="font-serif text-2xl font-semibold">
            Groom &amp; Glow Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your salon.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="admin-email"
                className="mb-1.5 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="name@groomandglow.in"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-sm font-medium"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="mt-1 h-12 w-full rounded-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}
