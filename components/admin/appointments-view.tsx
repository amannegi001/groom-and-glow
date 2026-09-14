'use client'

import { useMemo, useState } from 'react'
import { Check, MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  appointments as seed,
  formatINR,
  type Appointment,
  type AppointmentStatus,
} from '@/lib/data'
import { StatusBadge } from './status-badge'
import { cn } from '@/lib/utils'

type FilterKey = 'ALL' | AppointmentStatus

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
]

function confirmationMessage(a: Appointment) {
  return `Hello ${a.customer},\n\nYour appointment at Groom & Glow has been successfully booked.\n\nService: ${a.service}\nDate: ${a.date}\nTime: ${a.time}\n\nPlease arrive 10 minutes before your appointment.\n\nWe look forward to seeing you!`
}

function rejectionMessage(a: Appointment) {
  return `Hello ${a.customer},\n\nUnfortunately, your requested appointment could not be confirmed.\n\nService: ${a.service}\nDate: ${a.date}\nTime: ${a.time}\n\nPlease contact Groom & Glow to choose another available time.\n\nThank you.`
}

export function AppointmentsView() {
  const [list, setList] = useState<Appointment[]>(seed)
  const [filter, setFilter] = useState<FilterKey>('ALL')
  const [preview, setPreview] = useState<{
    appointment: Appointment
    kind: 'confirmed' | 'rejected'
  } | null>(null)

  const visible = useMemo(
    () => (filter === 'ALL' ? list : list.filter((a) => a.status === filter)),
    [list, filter],
  )

  const setStatus = (id: string, status: AppointmentStatus) =>
    setList((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))

  const handleConfirm = (a: Appointment) => {
    setStatus(a.id, 'CONFIRMED')
    setPreview({ appointment: { ...a, status: 'CONFIRMED' }, kind: 'confirmed' })
  }
  const handleReject = (a: Appointment) => {
    setStatus(a.id, 'CANCELLED')
    setPreview({ appointment: { ...a, status: 'CANCELLED' }, kind: 'rejected' })
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Filters */}
      <div className="mb-5 -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={cn(
              'shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
              filter === f.key
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-foreground/80 hover:border-primary/50',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-border bg-card p-4 sm:flex sm:items-center sm:gap-4"
          >
            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-medium">{a.customer}</p>
                  <span className="font-mono text-xs text-muted-foreground">
                    {a.id}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {a.service} · {a.date} · {a.time}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {a.phone} · {formatINR(a.price)}
                  {a.note ? ` · Note: ${a.note}` : ''}
                </p>
              </div>
              <div className="sm:hidden">
                <StatusBadge status={a.status} />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-0 sm:shrink-0">
              <span className="hidden sm:inline">
                <StatusBadge status={a.status} />
              </span>
              {a.status === 'PENDING' && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleConfirm(a)}
                    className="h-8 rounded-full px-3"
                  >
                    <Check className="size-3.5" />
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(a)}
                    className="h-8 rounded-full px-3"
                  >
                    <X className="size-3.5" />
                    Reject
                  </Button>
                </>
              )}
              {a.status === 'CONFIRMED' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setStatus(a.id, 'COMPLETED')}
                  className="h-8 rounded-full px-3"
                >
                  Mark Completed
                </Button>
              )}
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No appointments in this view.
          </p>
        )}
      </div>

      {preview && (
        <WhatsAppPreviewModal
          message={
            preview.kind === 'confirmed'
              ? confirmationMessage(preview.appointment)
              : rejectionMessage(preview.appointment)
          }
          kind={preview.kind}
          phone={preview.appointment.phone}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  )
}

function WhatsAppPreviewModal({
  message,
  kind,
  phone,
  onClose,
}: {
  message: string
  kind: 'confirmed' | 'rejected'
  phone: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="WhatsApp message preview"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-espresso/50 backdrop-blur-[2px] animate-in fade-in duration-200"
      />
      <div className="relative w-full max-w-md rounded-t-3xl bg-background p-5 shadow-2xl animate-in slide-in-from-bottom-6 sm:rounded-3xl sm:zoom-in-95 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 font-serif text-lg font-semibold">
            <MessageCircle className="size-5 text-[#25D366]" />
            WhatsApp sent
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X className="size-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          This automated message was {kind === 'confirmed' ? 'sent' : 'sent'} to
          the customer.
        </p>

        <div className="mt-4 rounded-2xl bg-[#e5ddd5] p-4">
          <div className="rounded-2xl rounded-tr-sm border border-[#c8e6c9] bg-[#dcf8c6] p-3 text-sm leading-relaxed whitespace-pre-line text-espresso">
            {message}
            <span className="mt-1 block text-right text-[10px] text-muted-foreground">
              to {phone}
            </span>
          </div>
        </div>

        <Button onClick={onClose} className="mt-5 h-11 w-full rounded-full">
          Done
        </Button>
      </div>
    </div>
  )
}
