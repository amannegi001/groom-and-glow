import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { AdminApp } from '@/components/admin/admin-app'
import { AUTH_COOKIE_NAME, verifyAdminToken } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Admin — Groom & Glow',
  description: 'Groom & Glow salon admin dashboard.',
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const session = token ? await verifyAdminToken(token) : null
  const isAuthenticated = Boolean(session && session.role === 'admin')

  return (
    <AdminApp
      initialAuthenticated={isAuthenticated}
      adminEmail={isAuthenticated ? session?.email : undefined}
    />
  )
}
