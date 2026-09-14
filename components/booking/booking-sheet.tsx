'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  MessageCircle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  discountedPrice,
  formatDuration,
  formatINR,
  services as allServices,
  type Service,
} from '@/lib/data'
import { cn } from '@/lib/utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  initialService?: Service
}

const STEP_LABELS = ['Service', 'Date', 'Time', 'Details', 'Review']

const TIME_SLOTS: { time: string; available: boolean }[] = [
  { time: '10:00 AM', available: true },
  { time: '10:30 AM', available: true },
  { time: '11:00 AM', available: false },
  { time: '11:30 AM', available: true },
  { time: '12:00 PM', available: true },
  { time: '12:30 PM', available: false },
  { time: '4:00 PM', available: true },
  { time: '4:30 PM', available: true },
  { time: '5:00 PM', available: true },
  { time: '5:30 PM', available: true },
  { time: '6:00 PM', available: false },
  { time: '6:30 PM', available: true },
]

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

type DayOption = {
  key: string
  weekday: string
  day: number
  month: string
  label: string
  available: boolean
}

function buildDays(): DayOption[] {
  const base = new Date(2026, 8, 14) // 14 Sep 2026
  const days: DayOption[] = []
  for (let i = 0; i < 14; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    const weekday = d.getDay()
    days.push({
      key: d.toISOString().slice(0, 10),
      weekday: WEEKDAYS[weekday],
      day: d.getDate(),
      month: MONTHS[d.getMonth()],
      label: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      available: weekday !== 0, // salon closed on Sundays (mock)
    })
  }
  return days
}

export function BookingSheet({ isOpen, onClose, initialService }: Props) {
  const days = useMemo(buildDays, [])
  const [step, setStep] = useState(0)
  const [service, setService] = useState<Service | undefined>(initialService)
  const [day, setDay] = useState<DayOption | undefined>()
  const [time, setTime] = useState<string | undefined>()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [submitted, setSubmitted] = useState(false)
  const [bookingId, setBookingId] = useState('GG-1042')

  const panelRef = useRef<HTMLDivElement>(null)
  const startStep = initialService ? 1 : 0

  // Reset each time the sheet opens.
  useEffect(() => {
    if (isOpen) {
      setService(initialService)
      setStep(initialService ? 1 : 0)
      setDay(undefined)
      setTime(undefined)
      setName('')
      setPhone('')
      setNote('')
      setErrors({})
      setSubmitted(false)
    }
  }, [isOpen, initialService])

  // Lock body scroll + Escape to close.
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const activeServices = allServices.filter((s) => s.active)

  const canContinue = () => {
    if (step === 0) return !!service
    if (step === 1) return !!day
    if (step === 2) return !!time
    if (step === 3) return name.trim() && /^\d{10}$/.test(phone.trim())
    return true
  }

  const validateDetails = () => {
    const next: { name?: string; phone?: string } = {}
    if (!name.trim()) next.name = 'Please enter your name.'
    if (!/^\d{10}$/.test(phone.trim()))
      next.phone = 'Enter a valid 10-digit mobile number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const goNext = () => {
    if (step === 3 && !validateDetails()) return
    setStep((s) => Math.min(s + 1, 4))
    panelRef.current?.scrollTo({ top: 0 })
  }

  const goBack = () => {
    setStep((s) => Math.max(s - 1, startStep))
    panelRef.current?.scrollTo({ top: 0 })
  }

  const submit = () => {
    setBookingId(`GG-${1042 + Math.floor(Math.random() * 40)}`)
    setSubmitted(true)
  }

  const price = service ? discountedPrice(service) : 0

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Book an appointment"
    >
      <button
        type="button"
        aria-label="Close booking"
        onClick={onClose}
        className="absolute inset-0 bg-espresso/50 backdrop-blur-[2px] animate-in fade-in duration-200"
      />

      <div
        ref={panelRef}
        className={cn(
          'relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-y-auto bg-background shadow-2xl',
          'rounded-t-3xl sm:rounded-3xl',
          'animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300',
          'pb-[max(1.25rem,env(safe-area-inset-bottom))]',
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
          {step > startStep && !submitted ? (
            <button
              type="button"
              onClick={goBack}
              aria-label="Go back"
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ChevronLeft className="size-5" />
            </button>
          ) : (
            <span className="size-9" aria-hidden="true" />
          )}
          <div className="flex-1 text-center">
            <p className="font-serif text-base font-semibold">
              {submitted ? 'Booking Request' : 'Book Appointment'}
            </p>
            {!submitted && (
              <p className="text-xs text-muted-foreground">
                Step {step + 1} of 5 · {STEP_LABELS[step]}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="flex gap-1.5 px-4 pt-3">
            {STEP_LABELS.map((label, i) => (
              <span
                key={label}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors',
                  i <= step ? 'bg-primary' : 'bg-muted',
                )}
              />
            ))}
          </div>
        )}

        <div className="flex-1 px-4 py-5">
          {submitted ? (
            <SuccessView
              service={service}
              day={day}
              time={time}
              name={name}
              phone={phone}
              price={price}
              bookingId={bookingId}
            />
          ) : (
            <>
              {/* STEP 1 — Service */}
              {step === 0 && (
                <fieldset>
                  <legend className="mb-1 font-serif text-lg font-semibold">
                    Select a service
                  </legend>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Choose the treatment you&apos;d like to book.
                  </p>
                  <div className="flex flex-col gap-2">
                    {activeServices.map((s) => {
                      const selected = service?.id === s.id
                      return (
                        <label
                          key={s.id}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-colors',
                            selected
                              ? 'border-primary bg-secondary/40 ring-1 ring-primary'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50',
                          )}
                        >
                          <input
                            type="radio"
                            name="service"
                            className="sr-only"
                            checked={selected}
                            onChange={() => setService(s)}
                          />
                          <img
                            src={s.image || '/placeholder.svg'}
                            alt=""
                            className="size-12 shrink-0 rounded-xl object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-medium">
                              {s.name}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {formatDuration(s.duration)} ·{' '}
                              {formatINR(discountedPrice(s))}
                            </span>
                          </span>
                          <span
                            className={cn(
                              'grid size-5 shrink-0 place-items-center rounded-full border',
                              selected
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border',
                            )}
                          >
                            {selected && <Check className="size-3.5" />}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              {/* STEP 2 — Date */}
              {step === 1 && (
                <div>
                  <h3 className="mb-1 font-serif text-lg font-semibold">
                    Choose a date
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    September 2026 · closed on Sundays
                  </p>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {days.map((d) => {
                      const selected = day?.key === d.key
                      return (
                        <button
                          key={d.key}
                          type="button"
                          disabled={!d.available}
                          onClick={() => setDay(d)}
                          aria-pressed={selected}
                          className={cn(
                            'flex flex-col items-center gap-0.5 rounded-2xl border py-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                            selected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/50',
                            !d.available &&
                              'cursor-not-allowed opacity-40 line-through hover:border-border',
                          )}
                        >
                          <span
                            className={cn(
                              'text-[11px]',
                              selected
                                ? 'text-primary-foreground/80'
                                : 'text-muted-foreground',
                            )}
                          >
                            {d.weekday}
                          </span>
                          <span className="font-serif text-lg font-semibold">
                            {d.day}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3 — Time */}
              {step === 2 && (
                <div>
                  <h3 className="mb-1 font-serif text-lg font-semibold">
                    Pick a time
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {day?.label} · available slots
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const selected = time === slot.time
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setTime(slot.time)}
                          aria-pressed={selected}
                          className={cn(
                            'rounded-xl border py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                            selected
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/50',
                            !slot.available &&
                              'cursor-not-allowed opacity-40 line-through hover:border-border',
                          )}
                        >
                          {slot.time}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4 — Details */}
              {step === 3 && (
                <div>
                  <h3 className="mb-1 font-serif text-lg font-semibold">
                    Your details
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    We&apos;ll use this to confirm your appointment.
                  </p>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label
                        htmlFor="b-name"
                        className="mb-1.5 block text-sm font-medium"
                      >
                        Your Name <span className="text-primary">*</span>
                      </label>
                      <input
                        id="b-name"
                        type="text"
                        value={name}
                        autoComplete="name"
                        onChange={(e) => setName(e.target.value)}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'b-name-err' : undefined}
                        className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive"
                        placeholder="e.g. Aman"
                      />
                      {errors.name && (
                        <p id="b-name-err" className="mt-1 text-xs text-destructive">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="b-phone"
                        className="mb-1.5 block text-sm font-medium"
                      >
                        Mobile Number <span className="text-primary">*</span>
                      </label>
                      <input
                        id="b-phone"
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        autoComplete="tel"
                        maxLength={10}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, ''))
                        }
                        aria-invalid={!!errors.phone}
                        aria-describedby={
                          errors.phone ? 'b-phone-err' : undefined
                        }
                        className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive"
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && (
                        <p
                          id="b-phone-err"
                          className="mt-1 text-xs text-destructive"
                        >
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="b-note"
                        className="mb-1.5 block text-sm font-medium"
                      >
                        Note{' '}
                        <span className="font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </label>
                      <textarea
                        id="b-note"
                        value={note}
                        rows={3}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full resize-none rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
                        placeholder="Anything we should know?"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5 — Review */}
              {step === 4 && service && day && time && (
                <div>
                  <h3 className="mb-4 font-serif text-lg font-semibold">
                    Review appointment
                  </h3>
                  <div className="overflow-hidden rounded-2xl border border-border">
                    <div className="flex items-center gap-3 bg-secondary/40 p-4">
                      <img
                        src={service.image || '/placeholder.svg'}
                        alt=""
                        className="size-14 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-serif text-base font-semibold">
                          {service.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDuration(service.duration)} ·{' '}
                          {formatINR(price)}
                        </p>
                      </div>
                    </div>
                    <dl className="divide-y divide-border">
                      <ReviewRow label="Date" value={day.label} />
                      <ReviewRow label="Time" value={time} />
                      <ReviewRow
                        label="Duration"
                        value={formatDuration(service.duration)}
                      />
                      <ReviewRow label="Price" value={formatINR(price)} />
                      <ReviewRow label="Name" value={name} />
                      <ReviewRow label="Mobile" value={phone} />
                      {note.trim() && (
                        <ReviewRow label="Note" value={note.trim()} />
                      )}
                    </dl>
                  </div>
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
                    <MessageCircle className="mt-0.5 size-4 shrink-0 text-[color:var(--rose)]" />
                    No payment required now. We&apos;ll confirm your appointment
                    over WhatsApp after reviewing this request.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer actions */}
        {!submitted && (
          <div className="sticky bottom-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
            {step < 4 ? (
              <Button
                size="lg"
                disabled={!canContinue()}
                onClick={goNext}
                className="h-12 w-full rounded-full text-sm"
              >
                Continue
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={submit}
                className="h-12 w-full rounded-full text-sm"
              >
                Submit Booking Request
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  )
}

function SuccessView({
  service,
  day,
  time,
  name,
  phone,
  price,
  bookingId,
}: {
  service?: Service
  day?: DayOption
  time?: string
  name: string
  phone: string
  price: number
  bookingId: string
}) {
  return (
    <div className="flex flex-col items-center py-4 text-center animate-in fade-in duration-300">
      <div className="grid size-16 place-items-center rounded-full bg-secondary/60">
        <CheckCircle2 className="size-9 text-[color:var(--burgundy)]" />
      </div>
      <h3 className="mt-4 font-serif text-xl font-semibold">
        Booking Request Received
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Your appointment request has been sent to Groom &amp; Glow. We&apos;ll
        confirm your appointment through WhatsApp.
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-full bg-muted px-4 py-2">
        <span className="text-xs text-muted-foreground">Booking ID</span>
        <span className="font-mono text-sm font-semibold">{bookingId}</span>
      </div>

      <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700">
        <Clock className="size-3.5" />
        Status: Pending confirmation
      </div>

      {/* WhatsApp preview */}
      <div className="mt-6 w-full text-left">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <MessageCircle className="size-3.5 text-[#25D366]" />
          Preview of your WhatsApp update
        </p>
        <div className="rounded-2xl rounded-tl-sm border border-[#c8e6c9] bg-[#e8f5e9] p-3 text-sm leading-relaxed text-espresso">
          <p>Hello {name || 'there'},</p>
          <p className="mt-2">
            We&apos;ve received your appointment request at Groom &amp; Glow.
          </p>
          <p className="mt-2">
            Service: {service?.name}
            <br />
            Date: {day?.label}
            <br />
            Time: {time}
            <br />
            Price: {formatINR(price)}
          </p>
          <p className="mt-2 text-muted-foreground">
            You&apos;ll get a confirmation message once our team reviews it.
          </p>
          <p className="mt-1 text-right text-[10px] text-muted-foreground">
            to {phone}
          </p>
        </div>
      </div>
    </div>
  )
}
