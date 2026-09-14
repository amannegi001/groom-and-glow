'use client'

import { ArrowRight, Clock, MapPin } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { useBooking } from '@/components/booking/booking-context'
import { CONTACT } from '@/lib/data'
import { cn } from '@/lib/utils'

export function Hero() {
  const { open } = useBooking()

  return (
    <section id="home" className="relative overflow-hidden pt-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 pb-6 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:pt-16 lg:pb-16">
        {/* Copy */}
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center rounded-full border border-rose/30 bg-secondary/40 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[color:var(--burgundy)] uppercase">
            Unisex Beauty &amp; Grooming
          </span>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Groom <span className="text-[color:var(--rose)]">&amp;</span> Glow
          </h1>
          <p className="mt-4 max-w-md text-base text-muted-foreground sm:text-lg">
            Beauty, grooming and self-care, all in one place.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              onClick={() => open()}
              size="lg"
              className="h-12 rounded-full px-7 text-sm"
            >
              Book Appointment
              <ArrowRight className="size-4" />
            </Button>
            <a
              href="#services"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-12 rounded-full border-foreground/15 bg-card px-7 text-sm',
              )}
            >
              Explore Services
            </a>
          </div>

          <dl className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-[color:var(--rose)]" />
              <dt className="sr-only">Opening hours</dt>
              <dd>{CONTACT.hours}</dd>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-[color:var(--rose)]" />
              <dt className="sr-only">Location</dt>
              <dd>Location details coming soon</dd>
            </div>
          </dl>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-black/5">
            <img
              src="/images/hero-salon.png"
              alt="Warm, modern interior of the Groom and Glow salon"
              className="aspect-4/5 w-full object-cover sm:aspect-3/4 lg:aspect-4/5"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso/20 to-transparent" />
          </div>
          <div className="absolute -bottom-4 left-4 hidden rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur sm:block">
            <p className="font-serif text-sm font-semibold">
              Professional · Welcoming
            </p>
            <p className="text-xs text-muted-foreground">For everyone.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
