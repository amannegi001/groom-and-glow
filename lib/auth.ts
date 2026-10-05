import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

export const AUTH_COOKIE_NAME = 'admin_token'

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
}

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'groom-glow-secure-jwt-secret-key-change-in-production-min-32-chars'

function getJwtSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET)
}

export interface AdminTokenPayload {
  adminId: string
  role: string
  email?: string
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function signAdminToken(payload: AdminTokenPayload): Promise<string> {
  return await new SignJWT({
    adminId: payload.adminId,
    role: payload.role,
    email: payload.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.adminId)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecretKey())
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey())
    const adminId = (payload.adminId as string) || (payload.sub as string)
    const role = payload.role as string
    const email = payload.email as string | undefined

    if (!adminId || !role) {
      return null
    }

    return { adminId, role, email }
  } catch {
    return null
  }
}

export async function getAdminSession(
  req?: NextRequest
): Promise<AdminTokenPayload | null> {
  let token: string | undefined

  if (req) {
    token = req.cookies.get(AUTH_COOKIE_NAME)?.value
  } else {
    try {
      const cookieStore = await cookies()
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value
    } catch {
      token = undefined
    }
  }

  if (!token) {
    return null
  }

  return await verifyAdminToken(token)
}

export async function verifyAdminAuth(req?: NextRequest): Promise<
  | { success: true; admin: AdminTokenPayload }
  | { success: false; response: NextResponse }
> {
  const session = await getAdminSession(req)

  if (!session) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Unauthorized. Admin authentication required.' },
        { status: 401 }
      ),
    }
  }

  if (session.role !== 'admin') {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Forbidden. Admin privileges required.' },
        { status: 403 }
      ),
    }
  }

  return {
    success: true,
    admin: session,
  }
}
