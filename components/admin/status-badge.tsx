import type { AppointmentStatus, InventoryStatus } from '@/lib/data'
import { cn } from '@/lib/utils'

const APPT_STYLES: Record<AppointmentStatus, string> = {
  PENDING: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  CONFIRMED: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  COMPLETED: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
  CANCELLED: 'bg-rose-500/15 text-rose-700 border-rose-500/30',
}

const APPT_LABEL: Record<AppointmentStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        APPT_STYLES[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {APPT_LABEL[status]}
    </span>
  )
}

const INV_STYLES: Record<InventoryStatus, string> = {
  Good: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  Low: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  Out: 'bg-rose-500/15 text-rose-700 border-rose-500/30',
}

export function InventoryBadge({ status }: { status: InventoryStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        INV_STYLES[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {status}
    </span>
  )
}
