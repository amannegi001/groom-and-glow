'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import type { Service } from '@/lib/data'
import { BookingSheet } from './booking-sheet'

type BookingContextValue = {
  open: (service?: Service) => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialService, setInitialService] = useState<Service | undefined>()

  const open = useCallback((service?: Service) => {
    setInitialService(service)
    setIsOpen(true)
  }, [])

  return (
    <BookingContext.Provider value={{ open }}>
      {children}
      <BookingSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialService={initialService}
      />
    </BookingContext.Provider>
  )
}
