'use client'

import { useState } from 'react'
import { Pencil, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CATEGORIES,
  discountedPrice,
  formatDuration,
  formatINR,
  services as seed,
  type Service,
  type ServiceCategory,
} from '@/lib/data'
import { cn } from '@/lib/utils'

type Draft = {
  id?: string
  name: string
  category: ServiceCategory
  description: string
  price: string
  duration: string
  discount: string
  active: boolean
}

const emptyDraft: Draft = {
  name: '',
  category: 'Skin Care',
  description: '',
  price: '',
  duration: '',
  discount: '0',
  active: true,
}

export function ServicesView() {
  const [list, setList] = useState<Service[]>(seed)
  const [editing, setEditing] = useState<Draft | null>(null)

  const toggleActive = (id: string) =>
    setList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    )

  const openAdd = () => setEditing({ ...emptyDraft })
  const openEdit = (s: Service) =>
    setEditing({
      id: s.id,
      name: s.name,
      category: s.category,
      description: s.description,
      price: String(s.price),
      duration: String(s.duration),
      discount: String(s.discount),
      active: s.active,
    })

  const save = (draft: Draft) => {
    const record: Service = {
      id: draft.id ?? draft.name.toLowerCase().replace(/\s+/g, '-'),
      name: draft.name.trim(),
      category: draft.category,
      description: draft.description.trim(),
      price: Number(draft.price) || 0,
      duration: Number(draft.duration) || 0,
      discount: Number(draft.discount) || 0,
      active: draft.active,
      image:
        list.find((s) => s.id === draft.id)?.image ?? '/images/svc-skincare.png',
    }
    setList((prev) => {
      const exists = prev.some((s) => s.id === record.id)
      return exists
        ? prev.map((s) => (s.id === record.id ? record : s))
        : [record, ...prev]
    })
    setEditing(null)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {list.filter((s) => s.active).length} active of {list.length} services
        </p>
        <Button onClick={openAdd} className="h-9 rounded-full px-4">
          <Plus className="size-4" />
          Add Service
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {list.map((s) => {
          const hasDiscount = s.discount > 0
          return (
            <div
              key={s.id}
              className={cn(
                'flex items-center gap-3 rounded-2xl border border-border bg-card p-3 sm:p-4',
                !s.active && 'opacity-60',
              )}
            >
              <img
                src={s.image || '/placeholder.svg'}
                alt=""
                className="size-14 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-medium">{s.name}</p>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {s.category}
                  </span>
                  {hasDiscount && (
                    <span className="rounded-full bg-[color:var(--burgundy)]/10 px-2 py-0.5 text-[11px] font-medium text-[color:var(--burgundy)]">
                      {s.discount}% off
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {s.description}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDuration(s.duration)} · {formatINR(discountedPrice(s))}
                  {hasDiscount && (
                    <span className="ml-1 line-through">
                      {formatINR(s.price)}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Toggle
                  active={s.active}
                  onToggle={() => toggleActive(s.id)}
                  label={`${s.active ? 'Disable' : 'Enable'} ${s.name}`}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(s)}
                  className="h-8 rounded-full px-3"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {editing && (
        <ServiceFormModal
          draft={editing}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  )
}

function Toggle({
  active,
  onToggle,
  label,
}: {
  active: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        active ? 'bg-primary' : 'bg-muted-foreground/30',
      )}
    >
      <span
        className={cn(
          'inline-block size-5 rounded-full bg-white shadow transition-transform',
          active ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </button>
  )
}

function ServiceFormModal({
  draft,
  onCancel,
  onSave,
}: {
  draft: Draft
  onCancel: () => void
  onSave: (d: Draft) => void
}) {
  const [form, setForm] = useState<Draft>(draft)
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const inputClass =
    'w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={draft.id ? 'Edit service' : 'Add service'}
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
        className="relative flex max-h-[92dvh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl bg-background shadow-2xl animate-in slide-in-from-bottom-6 sm:rounded-3xl sm:zoom-in-95 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background/95 px-5 py-3.5 backdrop-blur">
          <p className="font-serif text-lg font-semibold">
            {draft.id ? 'Edit Service' : 'Add Service'}
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

        <div className="flex flex-col gap-4 px-5 py-5">
          <Field label="Service Name" htmlFor="sf-name">
            <input
              id="sf-name"
              required
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Category" htmlFor="sf-cat">
            <select
              id="sf-cat"
              value={form.category}
              onChange={(e) =>
                update('category', e.target.value as ServiceCategory)
              }
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Description" htmlFor="sf-desc">
            <textarea
              id="sf-desc"
              rows={2}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className={cn(inputClass, 'resize-none')}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Price (₹)" htmlFor="sf-price">
              <input
                id="sf-price"
                type="number"
                min={0}
                required
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Duration (min)" htmlFor="sf-dur">
              <input
                id="sf-dur"
                type="number"
                min={0}
                required
                value={form.duration}
                onChange={(e) => update('duration', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Discount (%)" htmlFor="sf-disc">
            <input
              id="sf-disc"
              type="number"
              min={0}
              max={100}
              value={form.discount}
              onChange={(e) => update('discount', e.target.value)}
              className={inputClass}
            />
          </Field>

          <label className="flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-2.5">
            <span className="text-sm font-medium">Active</span>
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => update('active', e.target.checked)}
              className="size-4 accent-[color:var(--rose)]"
            />
          </label>
        </div>

        <div className="sticky bottom-0 flex gap-3 border-t border-border bg-background/95 px-5 py-3.5 backdrop-blur">
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

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  )
}
