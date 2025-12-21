import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(
  process.env.EO_SESSION_SECRET || 'inquivesta-eo-secret-key-2026'
)

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
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

  return NextResponse.next()
}

export const config = {
  matcher: ['/eo/:path*'],
}
