import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/mongodb'
import { Appointment } from '@/models/Appointment'
import { verifyAdminAuth } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdminAuth(req)
    if (!auth.success) {
      return auth.response
    }

    const { id } = await params
    const body = await req.json()
    const { status, adminNote } = body

    if (!status || !['confirmed', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be either 'confirmed' or 'rejected'." },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { appointmentId: id }] }
      : { appointmentId: id }

    const appointment = await Appointment.findOne(query)

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found.' },
        { status: 404 }
      )
    }

    if (appointment.status === status) {
      return NextResponse.json(
        { error: `Appointment is already ${status}.` },
        { status: 400 }
      )
    }

    if (appointment.status !== 'pending') {
      return NextResponse.json(
        {
          error: `Cannot change status of an appointment that is already ${appointment.status}.`,
        },
        { status: 400 }
      )
    }

    appointment.status = status
    if (adminNote !== undefined) {
      appointment.adminNote = typeof adminNote === 'string' ? adminNote.trim() : ''
    }

    await appointment.save()

    return NextResponse.json({
      success: true,
      appointment,
    })
  } catch (error: unknown) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment status.' },
      { status: 500 }
    )
  }
}
