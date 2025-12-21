import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getSession } from '@/lib/eo-auth/session'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { registrationId } = await request.json()

    if (!registrationId) {
      return NextResponse.json(
        { error: 'Registration ID is required' },
        { status: 400 }
      )
    }

    // Verify registration exists and belongs to this event
    const { data: registration, error: fetchError } = await supabaseAdmin
      .from(session.tableName)
      .select('*')
      .eq('id', registrationId)
      .single()

    if (fetchError || !registration) {
      return NextResponse.json(
        { error: 'Registration not found for this event' },
        { status: 404 }
      )
    }

    if (registration.checked_in) {
      return NextResponse.json({
        success: false,
        error: 'Already checked in',
        alreadyCheckedIn: true,
        registration: registration,
      })
    }

    // Update checked_in status
    const { error: updateError } = await supabaseAdmin
      .from(session.tableName)
      .update({ checked_in: true })
      .eq('id', registrationId)

    if (updateError) {
      console.error('Error updating check-in:', updateError)
      return NextResponse.json(
        { error: 'Failed to check in' },
        { status: 500 }
      )
    }

    // Fetch updated registration details for confirmation
    const { data: updatedReg } = await supabaseAdmin
      .from(session.tableName)
      .select('*')
      .eq('id', registrationId)
      .single()

    return NextResponse.json({
      success: true,
      message: 'Check-in successful',
      registration: updatedReg,
    })
  } catch (error) {
    console.error('Check-in error:', error)
    return NextResponse.json(
      { error: 'Check-in failed' },
      { status: 500 }
    )
  }
}
