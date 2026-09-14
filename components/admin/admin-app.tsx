'use client'

import { useState } from 'react'
import { AdminLogin } from './admin-login'
import { AdminShell, type AdminSection } from './admin-shell'
import { DashboardView } from './dashboard-view'
import { AppointmentsView } from './appointments-view'
import { ServicesView } from './services-view'
import { InventoryView } from './inventory-view'

export function AdminApp() {
  const [authed, setAuthed] = useState(false)
  const [section, setSection] = useState<AdminSection>('dashboard')

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />

  return (
    <AdminShell
      section={section}
      onSection={setSection}
      onLogout={() => setAuthed(false)}
    >
      {section === 'dashboard' && <DashboardView />}
      {section === 'appointments' && <AppointmentsView />}
      {section === 'services' && <ServicesView />}
      {section === 'inventory' && <InventoryView />}
    </AdminShell>
  )
}
