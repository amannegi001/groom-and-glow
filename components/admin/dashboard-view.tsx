'use client'

import { useEffect, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  PackageX,
  Sparkles,
} from 'lucide-react'
import { appointments as seedAppointments, inventory } from '@/lib/data'
import { StatusBadge } from './status-badge'

type DisplayAppointment = {
  id: string
  customer: string
  service: string
  date: string
  time: string
  status: string
}

export function DashboardView() {
  const [appts, setAppts] = useState<DisplayAppointment[]>([])

  useEffect(() => {
    fetch('/api/appointments')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return
        if (data.appointments && data.appointments.length > 0) {
          const mapped: DisplayAppointment[] = data.appointments.map(
            (a: {
              _id: string
              appointmentId?: string
              customerName: string
              serviceName: string
              appointmentDate: string
              appointmentTime: string
              status: string
            }) => ({
              id: a.appointmentId || a._id,
              customer: a.customerName,
              service: a.serviceName,
              date: a.appointmentDate,
              time: a.appointmentTime,
              status: a.status,
            }),
          )
          setAppts(mapped)
        } else {
          setAppts(
            seedAppointments.map((s) => ({
              id: s.id,
              customer: s.customer,
              service: s.service,
              date: s.date,
              time: s.time,
              status: s.status,
            })),
          )
        }
      })
      .catch((err) => {
        console.error('Failed to fetch dashboard appointments:', err)
        setAppts(
          seedAppointments.map((s) => ({
            id: s.id,
            customer: s.customer,
            service: s.service,
            date: s.date,
            time: s.time,
            status: s.status,
          })),
        )
      })
  }, [])

  const pending = appts.filter((a) => a.status.toLowerCase() === 'pending').length
  const confirmed = appts.filter((a) => a.status.toLowerCase() === 'confirmed').length
  const completed = appts.filter((a) => a.status.toLowerCase() === 'completed').length
  const lowStock = inventory.filter((i) => i.status !== 'Good').length

  const stats = [
    {
      label: 'Total Requests',
      value: appts.length,
      icon: CalendarDays,
      tone: 'text-[color:var(--burgundy)] bg-secondary/50',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Clock,
      tone: 'text-amber-700 bg-amber-500/15',
    },
    {
      label: 'Confirmed',
      value: confirmed,
      icon: CheckCircle2,
      tone: 'text-emerald-700 bg-emerald-500/15',
    },
    {
      label: 'Completed',
      value: completed,
      icon: Sparkles,
      tone: 'text-sky-700 bg-sky-500/15',
    },
    {
      label: 'Low Stock',
      value: lowStock,
      icon: PackageX,
      tone: 'text-rose-700 bg-rose-500/15',
    },
  ]

  const recent = appts.slice(0, 6)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <span
              className={`grid size-9 place-items-center rounded-xl ${s.tone}`}
            >
              <s.icon className="size-5" />
            </span>
            <p className="mt-3 font-serif text-3xl font-semibold">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3.5 sm:px-5">
          <h2 className="font-serif text-lg font-semibold">
            Recent Appointments
          </h2>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{a.customer}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {a.service}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{a.date}</td>
                  <td className="px-5 py-3 text-muted-foreground">{a.time}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile list */}
        <ul className="divide-y divide-border sm:hidden">
          {recent.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium">{a.customer}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {a.service} · {a.time}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
