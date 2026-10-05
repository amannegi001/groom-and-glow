import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAdmin {
  email: string
  passwordHash: string
  role: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IAdminDocument extends IAdmin, Document {}

const AdminSchema = new Schema<IAdminDocument>(
  {
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      default: 'admin',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Admin: Model<IAdminDocument> =
  mongoose.models.Admin || mongoose.model<IAdminDocument>('Admin', AdminSchema)
