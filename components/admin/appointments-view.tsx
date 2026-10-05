'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  Clock,
  Loader2,
  MessageCircle,
  RefreshCw,
  X,
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { formatDuration, formatINR } from '@/lib/data'
import {
  createCustomerConfirmedWhatsAppUrl,
  createCustomerRejectedWhatsAppUrl,
} from '@/lib/notifications'
import { StatusBadge } from './status-badge'
import { cn } from '@/lib/utils'

export type RealAppointment = {
  _id: string
  appointmentId: string
  customerName: string
  customerPhone: string
  customerNote?: string
  serviceId: string
  serviceName: string
  servicePrice: number
  serviceDiscount: number
  serviceFinalPrice: number
  serviceDuration: number
  appointmentDate: string
  appointmentTime: string
  status: 'pending' | 'confirmed' | 'rejected'
  adminNote?: string
  createdAt?: string
}

type FilterKey = 'all' | 'pending' | 'confirmed' | 'rejected'

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'rejected', label: 'Rejected' },
]

export function AppointmentsView() {
  const [list, setList] = useState<RealAppointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterKey>('all')
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  // Rejection modal state
  const [rejectingAppt, setRejectingAppt] = useState<RealAppointment | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  // WhatsApp notification modal state
  const [notifyModal, setNotifyModal] = useState<{
    appointment: RealAppointment
    kind: 'confirmed' | 'rejected'
    whatsappUrl: string
  } | null>(null)

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/appointments')
      const data = await res.json()
      if (res.status === 401) {
        setError('Your admin session has expired. Please refresh the page to sign in.')
        return
      }
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch appointments.')
      }
      setList(data.appointments || [])
    } catch (err: unknown) {
      console.error(err)
      setError('Unable to load appointments from database. Make sure MongoDB is connected.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const visible = useMemo(
    () => (filter === 'all' ? list : list.filter((a) => a.status === filter)),
    [list, filter],
  )

  const handleConfirm = async (a: RealAppointment) => {
    setActionLoadingId(a._id)
    try {
      const res = await fetch(`/api/appointments/${a._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to confirm appointment.')
        return
      }

      const updated = data.appointment
      setList((prev) => prev.map((item) => (item._id === a._id ? updated : item)))

      const whatsappUrl = createCustomerConfirmedWhatsAppUrl({
        customerName: updated.customerName,
        customerPhone: updated.customerPhone,
        serviceName: updated.serviceName,
        appointmentDate: updated.appointmentDate,
        appointmentTime: updated.appointmentTime,
        serviceDuration: updated.serviceDuration,
        serviceFinalPrice: updated.serviceFinalPrice,
      })

      setNotifyModal({
        appointment: updated,
        kind: 'confirmed',
        whatsappUrl,
      })
    } catch (err: unknown) {
      console.error(err)
      alert('Network error while confirming appointment.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const openRejectDialog = (a: RealAppointment) => {
    setRejectingAppt(a)
    setRejectionReason('The selected time is unavailable.')
  }

  const handleRejectSubmit = async () => {
    if (!rejectingAppt) return
    setActionLoadingId(rejectingAppt._id)
    try {
      const res = await fetch(`/api/appointments/${rejectingAppt._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'rejected',
          adminNote: rejectionReason.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Failed to reject appointment.')
        return
      }

      const updated = data.appointment
      setList((prev) =>
        prev.map((item) => (item._id === rejectingAppt._id ? updated : item)),
      )

      const whatsappUrl = createCustomerRejectedWhatsAppUrl({
        customerName: updated.customerName,
        customerPhone: updated.customerPhone,
        serviceName: updated.serviceName,
        appointmentDate: updated.appointmentDate,
        appointmentTime: updated.appointmentTime,
        adminNote: updated.adminNote,
      })

      setRejectingAppt(null)
      setNotifyModal({
        appointment: updated,
        kind: 'rejected',
        whatsappUrl,
      })
    } catch (err: unknown) {
      console.error(err)
      alert('Network error while rejecting appointment.')
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleOpenNotification = (a: RealAppointment) => {
    const isConfirmed = a.status === 'confirmed'
    const whatsappUrl = isConfirmed
      ? createCustomerConfirmedWhatsAppUrl({
          customerName: a.customerName,
          customerPhone: a.customerPhone,
          serviceName: a.serviceName,
          appointmentDate: a.appointmentDate,
          appointmentTime: a.appointmentTime,
          serviceDuration: a.serviceDuration,
          serviceFinalPrice: a.serviceFinalPrice,
        })
      : createCustomerRejectedWhatsAppUrl({
          customerName: a.customerName,
          customerPhone: a.customerPhone,
          serviceName: a.serviceName,
          appointmentDate: a.appointmentDate,
          appointmentTime: a.appointmentTime,
          adminNote: a.adminNote,
        })

    setNotifyModal({
      appointment: a,
      kind: isConfirmed ? 'confirmed' : 'rejected',
      whatsappUrl,
    })
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header controls */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
              {f.key !== 'all' && (
                <span className="ml-1.5 opacity-70">
                  (
                  {
                    list.filter((item) =>
                      f.key === 'pending'
                        ? item.status === 'pending'
                        : f.key === 'confirmed'
                          ? item.status === 'confirmed'
                          : item.status === 'rejected',
                    ).length
                  }
                  )
                </span>
              )}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchAppointments}
          disabled={loading}
          className="h-8 rounded-full px-3 text-xs"
        >
          <RefreshCw className={cn('mr-1 size-3.5', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="mt-3">Loading appointments from database...</p>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-center text-sm text-destructive">
          <p>{error}</p>
          <Button
            size="sm"
            onClick={fetchAppointments}
            className="mt-3 rounded-full"
          >
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {visible.map((a) => {
            const isActing = actionLoadingId === a._id
            return (
              <div
                key={a._id}
                className="rounded-2xl border border-border bg-card p-4 sm:flex sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="font-medium text-foreground">{a.customerName}</p>
                      <span className="font-mono text-xs font-semibold text-muted-foreground">
                        {a.appointmentId}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-foreground/90">
                      {a.serviceName} · {a.appointmentDate} · {a.appointmentTime}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Mobile: {a.customerPhone} · {formatDuration(a.serviceDuration)} ·{' '}
                      {formatINR(a.serviceFinalPrice)}
                      {a.customerNote ? ` · Note: "${a.customerNote}"` : ''}
                    </p>
                    {a.adminNote && (
                      <p className="mt-1 text-xs text-rose-700">
                        Rejection reason: {a.adminNote}
                      </p>
                    )}
                  </div>
                  <div className="sm:hidden">
                    <StatusBadge status={a.status} />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-0 sm:shrink-0">
                  <span className="hidden sm:inline">
                    <StatusBadge status={a.status} />
                  </span>

                  {a.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        disabled={isActing}
                        onClick={() => handleConfirm(a)}
                        className="h-8 rounded-full px-3 text-xs"
                      >
                        {isActing ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Check className="size-3.5" />
                        )}
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isActing}
                        onClick={() => openRejectDialog(a)}
                        className="h-8 rounded-full px-3 text-xs"
                      >
                        <X className="size-3.5" />
                        Reject
                      </Button>
                    </>
                  )}

                  {(a.status === 'confirmed' || a.status === 'rejected') && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenNotification(a)}
                      className="h-8 rounded-full border-border px-3 text-xs"
                    >
                      <MessageCircle className="mr-1 size-3.5 text-[#25D366]" />
                      Notify on WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            )
          })}

          {visible.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No appointments found in this view.
            </p>
          )}
        </div>
      )}

      {/* Reject reason dialog */}
      {rejectingAppt && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Reject Appointment"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setRejectingAppt(null)}
            className="absolute inset-0 bg-espresso/50 backdrop-blur-[2px] animate-in fade-in duration-200"
          />
          <div className="relative w-full max-w-md rounded-t-3xl bg-background p-5 shadow-2xl animate-in slide-in-from-bottom-6 sm:rounded-3xl sm:zoom-in-95 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Reject Appointment Request
              </h3>
              <button
                type="button"
                onClick={() => setRejectingAppt(null)}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Provide an optional reason to include in the notification to{' '}
              <strong className="text-foreground">{rejectingAppt.customerName}</strong>.
            </p>

            <div className="mt-4">
              <label
                htmlFor="reject-reason"
                className="mb-1.5 block text-xs font-medium text-foreground"
              >
                Reason for Rejection
              </label>
              <textarea
                id="reject-reason"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. The selected time slot is unavailable."
                className="w-full resize-none rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
              />
            </div>

            <div className="mt-5 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRejectingAppt(null)}
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={actionLoadingId === rejectingAppt._id}
                onClick={handleRejectSubmit}
                className="flex-1 rounded-full"
              >
                {actionLoadingId === rejectingAppt._id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Reject Request'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp notification modal */}
      {notifyModal && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="WhatsApp Notification"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setNotifyModal(null)}
            className="absolute inset-0 bg-espresso/50 backdrop-blur-[2px] animate-in fade-in duration-200"
          />
          <div className="relative w-full max-w-md rounded-t-3xl bg-background p-5 shadow-2xl animate-in slide-in-from-bottom-6 sm:rounded-3xl sm:zoom-in-95 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
                <MessageCircle className="size-5 text-[#25D366]" />
                Customer WhatsApp Notification
              </p>
              <button
                type="button"
                onClick={() => setNotifyModal(null)}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Appointment status is saved as{' '}
              <strong className="capitalize text-foreground">
                {notifyModal.kind}
              </strong>
              . Click below to open WhatsApp with the message pre-filled to{' '}
              <strong className="text-foreground">
                {notifyModal.appointment.customerName}
              </strong>{' '}
              (+91 {notifyModal.appointment.customerPhone}).
            </p>

            <a
              href={notifyModal.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white shadow-sm hover:bg-[#20ba5a]',
              )}
            >
              <MessageCircle className="size-4" />
              Notify Customer on WhatsApp
              <ArrowRight className="size-4" />
            </a>

            <div className="mt-4 rounded-2xl bg-[#e5ddd5] p-3.5">
              <p className="mb-1 text-[11px] font-semibold text-muted-foreground uppercase">
                Prepared Message Preview
              </p>
              <div className="rounded-xl border border-[#c8e6c9] bg-[#dcf8c6] p-3 text-xs leading-relaxed whitespace-pre-line text-espresso">
                {decodeURIComponent(notifyModal.whatsappUrl.split('text=')[1] || '')}
              </div>
              <p className="mt-1.5 text-right text-[10px] text-muted-foreground">
                Target: +91 {notifyModal.appointment.customerPhone}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setNotifyModal(null)}
              className="mt-4 h-10 w-full rounded-full"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
