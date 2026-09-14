'use client'

import { useState } from 'react'
import { Minus, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  inventory as seed,
  type InventoryItem,
  type InventoryStatus,
} from '@/lib/data'
import { InventoryBadge } from './status-badge'

function statusFor(qty: number): InventoryStatus {
  if (qty <= 0) return 'Out'
  if (qty <= 5) return 'Low'
  return 'Good'
}

type Draft = { id?: string; name: string; quantity: string }

export function InventoryView() {
  const [list, setList] = useState<InventoryItem[]>(seed)
  const [editing, setEditing] = useState<Draft | null>(null)

  const changeQty = (id: string, delta: number) =>
    setList((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i
        const quantity = Math.max(0, i.quantity + delta)
        return { ...i, quantity, status: statusFor(quantity) }
      }),
    )

  const remove = (id: string) =>
    setList((prev) => prev.filter((i) => i.id !== id))

  const save = (draft: Draft) => {
    const quantity = Math.max(0, Number(draft.quantity) || 0)
    const record: InventoryItem = {
      id: draft.id ?? `inv-${Date.now()}`,
      name: draft.name.trim(),
      quantity,
      status: statusFor(quantity),
    }
    setList((prev) => {
      const exists = prev.some((i) => i.id === record.id)
      return exists
        ? prev.map((i) => (i.id === record.id ? record : i))
        : [...prev, record]
    })
    setEditing(null)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {list.filter((i) => i.status !== 'Good').length} items need restocking
        </p>
        <Button
          onClick={() => setEditing({ name: '', quantity: '' })}
          className="h-9 rounded-full px-4"
        >
          <Plus className="size-4" />
          Add Item
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="hidden grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-border px-5 py-3 text-xs tracking-wide text-muted-foreground uppercase sm:grid">
          <span>Item</span>
          <span className="w-32 text-center">Quantity</span>
          <span className="w-20 text-center">Status</span>
          <span className="w-20 text-right">Actions</span>
        </div>
        <ul className="divide-y divide-border">
          {list.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-3 px-4 py-3 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4 sm:px-5"
            >
              <span className="min-w-0 flex-1 font-medium">{item.name}</span>

              <div className="flex w-32 items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => changeQty(item.id, -1)}
                  aria-label={`Decrease ${item.name}`}
                  className="grid size-7 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-9 text-center text-sm font-semibold tabular-nums">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => changeQty(item.id, 1)}
                  aria-label={`Increase ${item.name}`}
                  className="grid size-7 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <div className="flex w-20 justify-center">
                <InventoryBadge status={item.status} />
              </div>

              <div className="flex w-20 justify-end gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setEditing({
                      id: item.id,
                      name: item.name,
                      quantity: String(item.quantity),
                    })
                  }
                  aria-label={`Edit ${item.name}`}
                  className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Delete ${item.name}`}
                  className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editing && (
        <InventoryFormModal
          draft={editing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  )
}

function InventoryFormModal({
  draft,
  onCancel,
  onSave,
}: {
  draft: Draft
  onCancel: () => void
  onSave: (d: Draft) => void
}) {
  const [form, setForm] = useState<Draft>(draft)
  const inputClass =
    'w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={draft.id ? 'Edit item' : 'Add item'}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 bg-espresso/50 backdrop-blur-[2px] animate-in fade-in duration-200"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(form)
        }}
        className="relative w-full max-w-sm rounded-t-3xl bg-background p-5 shadow-2xl animate-in slide-in-from-bottom-6 sm:rounded-3xl sm:zoom-in-95 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="font-serif text-lg font-semibold">
            {draft.id ? 'Edit Item' : 'Add Item'}
          </p>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="iv-name" className="mb-1.5 block text-sm font-medium">
              Item Name
            </label>
            <input
              id="iv-name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="iv-qty" className="mb-1.5 block text-sm font-medium">
              Quantity
            </label>
            <input
              id="iv-qty"
              type="number"
              min={0}
              required
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantity: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="h-11 flex-1 rounded-full"
          >
            Cancel
          </Button>
          <Button type="submit" className="h-11 flex-1 rounded-full">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}
