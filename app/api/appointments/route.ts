import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Appointment } from '@/models/Appointment'
import { discountedPrice, services } from '@/lib/data'
import { verifyAdminAuth } from '@/lib/auth'

function generateAppointmentId(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `GG-${dateStr}-${code}`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      serviceId,
      appointmentDate,
      appointmentTime,
      customerName,
      customerPhone,
      customerNote,
    } = body

    // 1. Validate customer inputs
    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return NextResponse.json(
        { error: 'Customer name is required.' },
        { status: 400 }
      )
    }

    const cleanPhone = (customerPhone || '').replace(/\D/g, '')
    if (!cleanPhone || !/^\d{10}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      )
    }

    if (!appointmentDate || typeof appointmentDate !== 'string' || !appointmentDate.trim()) {
      return NextResponse.json(
        { error: 'Appointment date is required.' },
        { status: 400 }
      )
    }

    if (!appointmentTime || typeof appointmentTime !== 'string' || !appointmentTime.trim()) {
      return NextResponse.json(
        { error: 'Appointment time is required.' },
        { status: 400 }
      )
    }

    // 2. Validate service on server
    const service = services.find((s) => s.id === serviceId && s.active)
    if (!service) {
      return NextResponse.json(
        { error: 'The selected service is not available.' },
        { status: 400 }
      )
    }

    // 3. Connect to database
    await connectToDatabase()

    // 4. Duplicate time-slot protection
    const existing = await Appointment.findOne({
      appointmentDate: appointmentDate.trim(),
      appointmentTime: appointmentTime.trim(),
      status: { $in: ['pending', 'confirmed'] },
    })

    if (existing) {
      return NextResponse.json(
        {
          error:
            'This time slot already has a pending or confirmed booking. Please choose another time.',
        },
        { status: 409 }
      )
    }

    // 5. Calculate snapshot values server-side
    const finalPrice = discountedPrice(service)
    const appointmentId = generateAppointmentId()

    // 6. Create appointment document
    const newAppointment = await Appointment.create({
      appointmentId,
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      customerNote: (customerNote || '').trim(),
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDiscount: service.discount || 0,
      serviceFinalPrice: finalPrice,
      serviceDuration: service.duration,
      appointmentDate: appointmentDate.trim(),
      appointmentTime: appointmentTime.trim(),
      status: 'pending',
    })

    return NextResponse.json(
      {
        success: true,
        appointment: {
          appointmentId: newAppointment.appointmentId,
          customerName: newAppointment.customerName,
          customerPhone: newAppointment.customerPhone,
          serviceName: newAppointment.serviceName,
          appointmentDate: newAppointment.appointmentDate,
          appointmentTime: newAppointment.appointmentTime,
          serviceDuration: newAppointment.serviceDuration,
          serviceFinalPrice: newAppointment.serviceFinalPrice,
          status: newAppointment.status,
          createdAt: newAppointment.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error('Error creating appointment:', error)

    const isConnectionError =
      error instanceof Error &&
      (error.name === 'MongooseServerSelectionError' ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('buffering timed out'))

    const errorMessage = isConnectionError
      ? 'Database connection error: Could not reach MongoDB. Please verify that MongoDB is running and MONGODB_URI in .env.local is configured correctly.'
      : 'Failed to submit appointment request. Please try again.'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req)
    if (!auth.success) {
      return auth.response
    }

    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const statusParam = searchParams.get('status')

    const filter: Record<string, unknown> = {}
    if (statusParam && ['pending', 'confirmed', 'rejected'].includes(statusParam)) {
      filter.status = statusParam
    }

    const appointments = await Appointment.find(filter)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      appointments,
    })
  } catch (error: unknown) {
    console.error('Error fetching appointments:', error)

    const isConnectionError =
      error instanceof Error &&
      (error.name === 'MongooseServerSelectionError' ||
        error.message.includes('ECONNREFUSED'))

    const errorMessage = isConnectionError
      ? 'Database connection error: Could not reach MongoDB. Please verify that MongoDB is running and MONGODB_URI in .env.local is configured correctly.'
      : 'Failed to retrieve appointments.'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
