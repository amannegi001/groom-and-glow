import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Admin } from '@/models/Admin'
import {
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS,
  comparePassword,
  signAdminToken,
} from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    // 1. Validate inputs
    if (
      !email ||
      typeof email !== 'string' ||
      !email.trim() ||
      !password ||
      typeof password !== 'string' ||
      !password.trim()
    ) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 400 }
      )
    }

    // 2. Connect to database
    await connectToDatabase()

    // 3. Find admin by normalized email
    const normalizedEmail = email.trim().toLowerCase()
    const admin = await Admin.findOne({ email: normalizedEmail })

    // 4. Generic error if admin does not exist (never reveal whether email exists)
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // 5. Compare password hash
    const isMatch = await comparePassword(password, admin.passwordHash)
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // 6. Verify role
    if (admin.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Administrator privileges required.' },
        { status: 403 }
      )
    }

    // 7. Sign JWT session token with minimal claims
    const token = await signAdminToken({
      adminId: admin._id.toString(),
      role: admin.role,
      email: admin.email,
    })

    // 8. Return response with HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
    })

    response.cookies.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS)

    return response
  } catch (error: unknown) {
    console.error('Error during admin login:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred during login. Please try again.' },
      { status: 500 }
    )
  }
}
