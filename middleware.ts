import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const EO_SECRET_KEY = new TextEncoder().encode(
  process.env.EO_SESSION_SECRET || 'inquivesta-eo-secret-key-2026'
)

const ADMIN_SECRET_KEY = new TextEncoder().encode(
  process.env.ADMIN_SESSION_SECRET || 'inquivesta-admin-secret-key-2026'
)

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, EO_SECRET_KEY)
    return payload
  } catch {
    return null
  }
}

async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET_KEY)
    return payload
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Only protect /eo routes (except login)
  if (path.startsWith('/eo') && !path.startsWith('/eo/login')) {
    const token = request.cookies.get('eo_session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/eo/login', request.url))
    }

    const session = await verifyToken(token)

    if (!session) {
      // Clear invalid session cookie
      const response = NextResponse.redirect(new URL('/eo/login', request.url))
      response.cookies.delete('eo_session')
      return response
    }
  }

  // Redirect logged-in EOs away from login page
  if (path === '/eo/login') {
    const token = request.cookies.get('eo_session')?.value

    if (token) {
      const session = await verifyToken(token)
      if (session) {
        return NextResponse.redirect(new URL('/eo/dashboard', request.url))
      }
    }
  }

  // Protect /admin routes (except login)
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_session')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const session = await verifyAdminToken(token)

    if (!session) {
      // Clear invalid session cookie
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_session')
      return response
    }
  }

  // Redirect logged-in admins away from login page
  if (path === '/admin/login') {
    const token = request.cookies.get('admin_session')?.value

    if (token) {
      const session = await verifyAdminToken(token)
      if (session) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/eo/:path*', '/admin/:path*'],
}
