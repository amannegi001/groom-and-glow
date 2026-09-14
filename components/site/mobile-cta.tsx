'use client'

import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBooking } from '@/components/booking/booking-context'

export function MobileCta() {
  const { open } = useBooking()

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md md:hidden">
      <Button
        onClick={() => open()}
        size="lg"
        className="h-12 w-full rounded-full text-sm"
      >
        <CalendarDays className="size-4" />
        Book Appointment
      </Button>
    </div>
  )
}
