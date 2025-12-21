import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getSession } from '@/lib/eo-auth/session'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch registrations for this event
    const { data: registrations, error } = await supabaseAdmin
      .from(session.tableName)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching registrations:', error)
      return NextResponse.json(
        { error: 'Failed to fetch registrations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      eventName: session.eventName,
      eventId: session.eventId,
      registrations: registrations || [],
      totalCount: registrations?.length || 0,
      checkedInCount: registrations?.filter(r => r.checked_in).length || 0,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}
