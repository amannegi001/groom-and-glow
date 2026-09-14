'use client'

import {
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Package,
  Scissors,
} from 'lucide-react'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

export type AdminSection =
  | 'dashboard'
  | 'appointments'
  | 'services'
  | 'inventory'

const NAV: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] =
  [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'inventory', label: 'Inventory', icon: Package },
  ]

const TITLES: Record<AdminSection, string> = {
  dashboard: 'Dashboard',
  appointments: 'Appointments',
  services: 'Services',
  inventory: 'Inventory',
}

export function AdminShell({
  section,
  onSection,
  onLogout,
  children,
}: {
  section: AdminSection
  onSection: (s: AdminSection) => void
  onLogout: () => void
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-background md:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-card p-4 md:flex">
        <div className="px-2 py-2">
          <Logo showTagline={false} />
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Admin">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSection(item.id)}
              aria-current={section === item.id ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                section === item.id
                  ? 'bg-secondary/50 text-[color:var(--burgundy)]'
                  : 'text-foreground/75 hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <LogOut className="size-5" />
          Logout
        </button>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
          <div>
            <h1 className="font-serif text-xl font-semibold">
              {TITLES[section]}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              admin@groomandglow.in
            </span>
            <span className="grid size-9 place-items-center rounded-full bg-secondary/60 font-serif text-sm font-semibold text-[color:var(--burgundy)]">
              A
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Admin"
      >
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSection(item.id)}
            aria-current={section === item.id ? 'page' : undefined}
            className={cn(
              'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
              section === item.id
                ? 'text-[color:var(--burgundy)]'
                : 'text-muted-foreground',
            )}
          >
            <item.icon className="size-5" />
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onLogout}
          className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
        >
          <LogOut className="size-5" />
          Logout
        </button>
      </nav>
    </div>
  )
}
