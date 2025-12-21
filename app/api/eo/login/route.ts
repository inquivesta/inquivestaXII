import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { createSession, setSessionCookie } from '@/lib/eo-auth/session'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Fetch EO credentials from Supabase
    const { data: eoAuth, error } = await supabaseAdmin
      .from('eo_auth')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !eoAuth) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password (plain text comparison for simplicity)
    // In production, use bcrypt.compare()
    if (eoAuth.password_hash !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login
    await supabaseAdmin
      .from('eo_auth')
      .update({ last_login: new Date().toISOString() })
      .eq('id', eoAuth.id)

    // Create session
    const sessionData = {
      eventId: eoAuth.event_id,
      eventName: eoAuth.event_name,
      tableName: eoAuth.table_name,
      username: eoAuth.username,
      loggedInAt: Date.now(),
    }

    const token = await createSession(sessionData)
    await setSessionCookie(token)

    return NextResponse.json({
      success: true,
      eventName: eoAuth.event_name,
      eventId: eoAuth.event_id,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
