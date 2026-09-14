'use client'

import { useState } from 'react'
import { CATEGORIES, services, type ServiceCategory } from '@/lib/data'
import { ServiceCard } from './service-card'
import { cn } from '@/lib/utils'

type Filter = 'All' | ServiceCategory

export function Services() {
  const [filter, setFilter] = useState<Filter>('All')
  const filters: Filter[] = ['All', ...CATEGORIES]

  const active = services.filter((s) => s.active)
  const visible =
    filter === 'All' ? active : active.filter((s) => s.category === filter)

  return (
    <section id="services" className="scroll-mt-16 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-3 text-muted-foreground">
            Beauty, grooming and self-care services tailored to you.
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                filter === f
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground/80 hover:border-primary/50',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
