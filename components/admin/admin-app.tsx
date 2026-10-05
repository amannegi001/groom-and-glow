'use client'

import { useState } from 'react'
import { AdminLogin } from './admin-login'
import { AdminShell, type AdminSection } from './admin-shell'
import { DashboardView } from './dashboard-view'
import { AppointmentsView } from './appointments-view'
import { ServicesView } from './services-view'
import { InventoryView } from './inventory-view'

export function AdminApp({
  initialAuthenticated = false,
  adminEmail,
}: {
  initialAuthenticated?: boolean
  adminEmail?: string
}) {
  const [authed, setAuthed] = useState(initialAuthenticated)
  const [currentEmail, setCurrentEmail] = useState(adminEmail || '')
  const [section, setSection] = useState<AdminSection>('dashboard')

  const handleLogin = (email?: string) => {
    if (email) {
      setCurrentEmail(email)
    }
    setAuthed(true)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      })
    } catch (err) {
      console.error('Error logging out:', err)
    } finally {
      setAuthed(false)
      setCurrentEmail('')
    }
  }

  if (!authed) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <AdminShell
      section={section}
      onSection={setSection}
      onLogout={handleLogout}
      adminEmail={currentEmail}
    >
      {section === 'dashboard' && <DashboardView />}
      {section === 'appointments' && <AppointmentsView />}
      {section === 'services' && <ServicesView />}
      {section === 'inventory' && <InventoryView />}
    </AdminShell>
  )
}
