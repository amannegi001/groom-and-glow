'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBooking } from '@/components/booking/booking-context'
import { services } from '@/lib/data'

export function Offers() {
  const { open } = useBooking()
  const offerServices = services.filter((s) => s.active && s.discount > 0)

  // Only render when there are active offers.
  if (offerServices.length === 0) return null

  const maxDiscount = Math.max(...offerServices.map((s) => s.discount))

  return (
    <section id="offers" className="scroll-mt-16 py-6 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-[color:var(--burgundy)] px-6 py-10 text-white sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[color:var(--rose)]/40 blur-2xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-secondary/20 blur-2xl"
          />
          <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase">
                <Sparkles className="size-3.5" />
                Special Offers
              </span>
              <p className="mt-4 max-w-md font-serif text-3xl font-semibold sm:text-4xl">
                Glow more, spend less.
              </p>
              <p className="mt-2 text-white/80">
                Up to {maxDiscount}% off on selected services this season.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 sm:items-end">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-6xl font-semibold leading-none">
                  {maxDiscount}%
                </span>
                <span className="text-lg font-medium text-white/80">OFF</span>
              </div>
              <Button
                onClick={() => open()}
                size="lg"
                className="h-12 rounded-full bg-white px-7 text-sm text-[color:var(--burgundy)] hover:bg-white/90"
              >
                Book Now
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
