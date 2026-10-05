import { NextResponse } from 'next/server'
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '@/lib/auth'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.',
    })

    // Clear the HTTP-only auth cookie immediately
    response.cookies.set(AUTH_COOKIE_NAME, '', {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 0,
      expires: new Date(0),
    })

    return response
  } catch (error: unknown) {
    console.error('Error during admin logout:', error)
    return NextResponse.json(
      { error: 'Failed to log out.' },
      { status: 500 }
    )
  }
}
