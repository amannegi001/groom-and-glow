'use client'

import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBooking } from '@/components/booking/booking-context'
import {
  discountedPrice,
  formatDuration,
  formatINR,
  type Service,
} from '@/lib/data'

export function ServiceCard({ service }: { service: Service }) {
  const { open } = useBooking()
  const hasDiscount = service.discount > 0
  const finalPrice = discountedPrice(service)

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={service.image || '/placeholder.svg'}
          alt={`${service.name} at Groom and Glow`}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground/80 backdrop-blur">
          {service.category}
        </span>
        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-[color:var(--burgundy)] px-2.5 py-1 text-[11px] font-semibold text-white shadow">
            {service.discount}% OFF
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg font-semibold">{service.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          {formatDuration(service.duration)}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-foreground">
              {formatINR(finalPrice)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatINR(service.price)}
              </span>
            )}
          </div>
          <Button
            onClick={() => open(service)}
            className="h-9 rounded-full px-5"
            aria-label={`Book ${service.name}`}
          >
            Book
          </Button>
        </div>
      </div>
    </article>
  )
}
