import mongoose, { Schema, Document, Model } from 'mongoose'

export type AppointmentStatus = 'pending' | 'confirmed' | 'rejected'

export interface IAppointment {
  appointmentId: string
  customerName: string
  customerPhone: string
  customerNote?: string
  serviceId: string
  serviceName: string
  servicePrice: number
  serviceDiscount: number
  serviceFinalPrice: number
  serviceDuration: number
  appointmentDate: string
  appointmentTime: string
  status: AppointmentStatus
  adminNote?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IAppointmentDocument extends IAppointment, Document {}

const AppointmentSchema = new Schema<IAppointmentDocument>(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone is required'],
      trim: true,
    },
    customerNote: {
      type: String,
      trim: true,
      default: '',
    },
    serviceId: {
      type: String,
      required: [true, 'Service ID is required'],
      trim: true,
    },
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    servicePrice: {
      type: Number,
      required: true,
    },
    serviceDiscount: {
      type: Number,
      default: 0,
    },
    serviceFinalPrice: {
      type: Number,
      required: true,
    },
    serviceDuration: {
      type: Number,
      required: true,
    },
    appointmentDate: {
      type: String,
      required: [true, 'Appointment date is required'],
      trim: true,
      index: true,
    },
    appointmentTime: {
      type: String,
      required: [true, 'Appointment time is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending',
      index: true,
    },
    adminNote: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

export const Appointment: Model<IAppointmentDocument> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointmentDocument>('Appointment', AppointmentSchema)
