import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { createAdminSession, setAdminSessionCookie } from '@/lib/admin-auth/session'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Fetch admin credentials from Supabase
    const { data: adminAuth, error } = await supabaseAdmin
      .from('admin_auth')
      .select('*')
      .eq('username', username.toLowerCase().trim())
      .eq('is_active', true)
      .single()

    if (error || !adminAuth) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password (plain text comparison for simplicity)
    // In production, use bcrypt.compare()
    if (adminAuth.password_hash !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login
    await supabaseAdmin
      .from('admin_auth')
      .update({ last_login: new Date().toISOString() })
      .eq('id', adminAuth.id)

    // Create session
    const sessionData = {
      adminId: adminAuth.id,
      username: adminAuth.username,
      role: adminAuth.role || 'admin',
      loggedInAt: Date.now(),
    }

    const token = await createAdminSession(sessionData)
    await setAdminSessionCookie(token)

    return NextResponse.json({
      success: true,
      role: adminAuth.role,
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
