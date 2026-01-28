import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/lib/admin-auth/session'

// Define all event tables and their names
const EVENT_TABLES = [
  { id: 'botprix', name: 'Botprix', tableName: 'event_registrations_botprix' },
  { id: 'csi', name: 'CSI - Crime Scene Investigation', tableName: 'event_registrations_csi' },
  { id: 'junkyard-wars', name: 'Junkyard Wars', tableName: 'event_registrations_junkyard_wars' },
  { id: 'inquizzitive', name: 'Inquizzitive', tableName: 'event_registrations_inquizzitive' },
  { id: 'beat-the-drop', name: 'Beat the Drop', tableName: 'event_registrations_beat_the_drop' },
  { id: 'thrust', name: 'Thrust', tableName: 'event_registrations_thrust' },
  { id: 'headshot-bgmi', name: 'Headshot - BGMI', tableName: 'event_registrations_headshot_bgmi' },
  { id: 'headshot-valorant', name: 'Headshot - Valorant', tableName: 'event_registrations_headshot_valorant' },
  { id: 'lost', name: 'L.O.S.T', tableName: 'event_registrations_lost' },
  { id: 'photon', name: 'Photon', tableName: 'event_registrations_photon' },
  { id: 'art-in-a-culture', name: 'Art in a Culture', tableName: 'event_registrations_art_in_a_culture' },
  { id: 'soulbeats', name: 'Soulbeats', tableName: 'event_registrations_soulbeats' },
  { id: 'bullseye', name: 'Bullseye', tableName: 'event_registrations_bullseye' },
  { id: 'smash7', name: 'Smash7', tableName: 'event_registrations_smash7' },
  { id: 'nukkad-natak', name: 'Nukkad Natak', tableName: 'event_registrations_nukkad_natak' },
  { id: 'hoop-hustle', name: 'Hoop Hustle (3v3 Basketball)', tableName: 'event_registrations_hoop_hustle' },
  { id: 'inquicon', name: 'Inquicon', tableName: 'event_registrations_inquicon' },
  { id: 'table-tennis-singles', name: 'Table Tennis - Singles', tableName: 'event_registrations_table_tennis_singles' },
  { id: 'table-tennis-doubles', name: 'Table Tennis - Doubles', tableName: 'event_registrations_table_tennis_doubles' },
  { id: 'masquerade', name: 'Masquerade', tableName: 'event_registrations_masquerade' },
  { id: 'day-passes', name: 'Day Passes', tableName: 'event_registrations_day_passes' },
]

export async function GET() {
  try {
    const session = await getAdminSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const events = []

    for (const event of EVENT_TABLES) {
      try {
        // Get all registrations - select * to handle tables with different schemas
        const { data: registrations, error } = await supabaseAdmin
          .from(event.tableName)
          .select('*')

        if (error) {
          console.error(`Error fetching ${event.tableName}:`, error.message)
          // Still add the event with 0 counts if table doesn't exist or query fails
          events.push({
            id: event.id,
            name: event.name,
            tableName: event.tableName,
            registrationCount: 0,
            verifiedCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
            totalCollection: 0,
            checkedInCount: 0,
          })
          continue
        }

        const total = registrations?.length || 0
        const verified = registrations?.filter(r => r.registration_status === 'verified').length || 0
        const cancelled = registrations?.filter(r => r.registration_status === 'cancelled').length || 0
        const pending = total - verified - cancelled
        
        // Calculate total collection (use amount_paid or total_amount)
        const totalCollection = registrations?.reduce((sum, r) => {
          const amount = r.amount_paid ?? r.total_amount ?? 0
          return sum + (typeof amount === 'number' ? amount : parseFloat(amount) || 0)
        }, 0) || 0
        
        // Count checked-in registrations
        const checkedInCount = registrations?.filter(r => r.checked_in === true).length || 0

        events.push({
          id: event.id,
          name: event.name,
          tableName: event.tableName,
          registrationCount: total,
          verifiedCount: verified,
          pendingCount: pending,
          cancelledCount: cancelled,
          totalCollection: totalCollection,
          checkedInCount: checkedInCount,
        })
      } catch (err) {
        console.error(`Error processing ${event.tableName}:`, err)
        // Still add the event with 0 counts on exception
        events.push({
          id: event.id,
          name: event.name,
          tableName: event.tableName,
          registrationCount: 0,
          verifiedCount: 0,
          pendingCount: 0,
          cancelledCount: 0,
          totalCollection: 0,
          checkedInCount: 0,
        })
      }
    }

    return NextResponse.json({
      success: true,
      events,
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
