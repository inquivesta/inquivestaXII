import { NextRequest, NextResponse } from 'next/server'
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
  // Add more events as needed
]

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('event') || 'all'

    let allRegistrations: Record<string, unknown>[] = []

    if (eventId === 'all') {
      // Fetch from all tables
      for (const event of EVENT_TABLES) {
        try {
          const { data: registrations, error } = await supabaseAdmin
            .from(event.tableName)
            .select('*')
            .order('created_at', { ascending: false })

          if (error) {
            console.error(`Error fetching ${event.tableName}:`, error)
            continue
          }

          // Add event info to each registration
          const regsWithEventInfo = (registrations || []).map(reg => ({
            ...reg,
            _event_id: event.id,
            _event_name: event.name,
            _event_table: event.tableName,
          }))

          allRegistrations = [...allRegistrations, ...regsWithEventInfo]
        } catch (err) {
          console.error(`Error processing ${event.tableName}:`, err)
        }
      }

      // Sort all by created_at
      allRegistrations.sort((a, b) => {
        const dateA = new Date(a.created_at as string).getTime()
        const dateB = new Date(b.created_at as string).getTime()
        return dateB - dateA
      })
    } else {
      // Fetch from specific event table
      const event = EVENT_TABLES.find(e => e.id === eventId)
      
      if (!event) {
        return NextResponse.json(
          { error: 'Invalid event ID' },
          { status: 400 }
        )
      }

      const { data: registrations, error } = await supabaseAdmin
        .from(event.tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error(`Error fetching ${event.tableName}:`, error)
        return NextResponse.json(
          { error: 'Failed to fetch registrations' },
          { status: 500 }
        )
      }

      allRegistrations = (registrations || []).map(reg => ({
        ...reg,
        _event_id: event.id,
        _event_name: event.name,
        _event_table: event.tableName,
      }))
    }

    return NextResponse.json({
      success: true,
      registrations: allRegistrations,
      totalCount: allRegistrations.length,
    })
  } catch (error) {
    console.error('Error fetching registrations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}
