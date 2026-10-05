import type { InventoryStatus } from '@/lib/data'
import { cn } from '@/lib/utils'

const APPT_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-700 border-amber-500/30',
  confirmed: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30',
  rejected: 'bg-rose-500/15 text-rose-700 border-rose-500/30',
  completed: 'bg-sky-500/15 text-sky-700 border-sky-500/30',
  cancelled: 'bg-rose-500/15 text-rose-700 border-rose-500/30',
}

const APPT_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  rejected: 'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function StatusBadge({ status }: { status: string }) {
  const key = (status || '').toLowerCase()
  const style = APPT_STYLES[key] || 'bg-muted text-muted-foreground border-border'
  const label = APPT_LABEL[key] || status

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        style,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {label}
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
