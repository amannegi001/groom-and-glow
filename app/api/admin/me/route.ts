import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req)
    if (!auth.success) {
      return auth.response
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: auth.admin.adminId,
        email: auth.admin.email,
        role: auth.admin.role,
      },
    })
  } catch (error: unknown) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json(
      { error: 'Failed to verify admin status.' },
      { status: 500 }
    )
  }
}
