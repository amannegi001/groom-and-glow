import { formatDuration, formatINR } from './data'

export function formatWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `91${digits}`
  }
  return digits
}

export function createCustomerConfirmedWhatsAppUrl(appointment: {
  customerName: string
  customerPhone: string
  serviceName: string
  appointmentDate: string
  appointmentTime: string
  serviceDuration: number
  serviceFinalPrice: number
}): string {
  const phone = formatWhatsAppPhone(appointment.customerPhone)

  const lines = [
    `Hello ${appointment.customerName.trim()}! 👋`,
    '',
    'Your Groom & Glow appointment has been confirmed.',
    '',
    `Service: ${appointment.serviceName}`,
    `Date: ${appointment.appointmentDate}`,
    `Time: ${appointment.appointmentTime}`,
    `Duration: ${formatDuration(appointment.serviceDuration)}`,
    `Price: ${formatINR(appointment.serviceFinalPrice)}`,
    '',
    'We look forward to seeing you at Groom & Glow. ✨',
  ]

  const message = lines.join('\n')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function createCustomerRejectedWhatsAppUrl(appointment: {
  customerName: string
  customerPhone: string
  serviceName: string
  appointmentDate: string
  appointmentTime: string
  adminNote?: string
}): string {
  const phone = formatWhatsAppPhone(appointment.customerPhone)
  const reason = appointment.adminNote?.trim() || 'The selected time is unavailable.'

  const lines = [
    `Hello ${appointment.customerName.trim()},`,
    '',
    'Unfortunately, your Groom & Glow appointment request could not be accepted.',
    '',
    `Service: ${appointment.serviceName}`,
    `Requested Date: ${appointment.appointmentDate}`,
    `Requested Time: ${appointment.appointmentTime}`,
    '',
    `Reason: ${reason}`,
    '',
    'Please contact us or choose another available time.',
    '',
    'Thank you,',
    'Groom & Glow',
  ]

  const message = lines.join('\n')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
