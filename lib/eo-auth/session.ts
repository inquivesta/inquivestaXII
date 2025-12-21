import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.EO_SESSION_SECRET || 'inquivesta-eo-secret-key-2026'
)

export interface EOSession {
  eventId: string
  eventName: string
  tableName: string
  username: string
  loggedInAt: number
}

export async function createSession(data: EOSession): Promise<string> {
  const token = await new SignJWT({ ...data })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY)
  
  return token
}

export async function verifySession(token: string): Promise<EOSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as unknown as EOSession
  } catch {
    return null
  }
}

export async function getSession(): Promise<EOSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('eo_session')?.value
  
  if (!token) return null
  
  return verifySession(token)
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set('eo_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('eo_session')
}
