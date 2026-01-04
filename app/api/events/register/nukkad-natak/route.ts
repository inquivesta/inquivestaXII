import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { resend } from '@/lib/resend/client'
import QRCode from 'qrcode'

// Nukkad Natak (Street Play) registration handler
const EVENT_CONFIG = {
  id: 'nukkad-natak',
  name: 'Nukkad Natak',
  tableName: 'event_registrations_nukkad_natak',
  emailFrom: 'nukkad-natak@inquivesta.in',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      team_leader_name,
      team_leader_email,
      team_leader_phone,
      college_name,
      team_size,
      drama_synopsis,
      amount_paid,
      utr_number,
      payment_qr_used,
    } = body

    // Validate required fields
    if (!team_leader_name || !team_leader_email || !team_leader_phone || 
        !college_name || !team_size || !drama_synopsis || !utr_number) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate UTR number (12 digits)
    if (!utr_number || utr_number.length !== 12) {
      return NextResponse.json({ error: 'Please enter a valid 12-digit UTR number' }, { status: 400 })
    }

    // Validate team size (5-15)
    if (team_size < 5 || team_size > 15) {
      return NextResponse.json({ error: 'Team size must be between 5 and 15' }, { status: 400 })
    }

    // Check for duplicate email
    const { data: existingRegistration } = await supabaseAdmin
      .from(EVENT_CONFIG.tableName)
      .select('id')
      .eq('team_leader_email', team_leader_email.toLowerCase())
      .single()

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'This email is already registered for this event' },
        { status: 400 }
      )
    }

    // Prepare data for insert
    const insertData = {
      team_leader_name,
      team_leader_email: team_leader_email.toLowerCase(),
      team_leader_phone,
      college_name,
      team_size,
      drama_synopsis,
      amount_paid: amount_paid || 150,
      utr_number,
      payment_qr_used,
    }

    // Insert registration into database
    const { data: registration, error: insertError } = await supabaseAdmin
      .from(EVENT_CONFIG.tableName)
      .insert(insertData)
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create registration. Please try again.' },
        { status: 500 }
      )
    }

    // Generate QR Code
    const qrCodeBuffer = await QRCode.toBuffer(registration.id, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'H'
    })
    const qrCodeBase64 = qrCodeBuffer.toString('base64')

    // Send confirmation email
    try {
      await resend.emails.send({
        from: `${EVENT_CONFIG.name} <${EVENT_CONFIG.emailFrom}>`,
        to: team_leader_email.toLowerCase(),
        subject: `Team Registration Confirmed - ${EVENT_CONFIG.name} | Inquivesta XII`,
        html: generateNukkadNatakEmailHTML({
          teamLeaderName: team_leader_name,
          collegeName: college_name,
          registrationId: registration.id,
          teamSize: team_size,
          synopsis: drama_synopsis,
          amountPaid: amount_paid || 150,
        }),
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeBase64,
            contentId: 'qrcode',
          },
          {
            filename: `entry-qr-${registration.id.slice(0, 8)}.png`,
            content: qrCodeBase64,
          },
        ],
      })

      // Update email_sent status
      await supabaseAdmin
        .from(EVENT_CONFIG.tableName)
        .update({ email_sent: true, qr_code_sent: true })
        .eq('id', registration.id)

    } catch (emailError) {
      console.error('Email send error:', emailError)
    }

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
      message: 'Team registration successful! Check your email for confirmation.',
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}

interface NukkadNatakEmailData {
  teamLeaderName: string
  collegeName: string
  registrationId: string
  teamSize: number
  synopsis: string
  amountPaid: number
}

function generateNukkadNatakEmailHTML(data: NukkadNatakEmailData): string {
  const currentYear = new Date().getFullYear()
  // Truncate synopsis if too long
  const truncatedSynopsis = data.synopsis.length > 500 
    ? data.synopsis.substring(0, 500) + '...' 
    : data.synopsis

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Registration Confirmed - Nukkad Natak</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1A1A1A; border: 2px solid #E74C3C;">
          
          <tr>
            <td style="background-color: #E74C3C; height: 4px;"></td>
          </tr>

          <tr>
            <td style="padding: 20px 30px; border-bottom: 1px dashed #E74C3C;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <p style="color: #E74C3C; font-size: 10px; margin: 0; letter-spacing: 2px; font-family: monospace;">IISER KOLKATA</p>
                  </td>
                  <td align="right">
                    <p style="color: #666; font-size: 10px; margin: 0; letter-spacing: 2px; font-family: monospace;">${currentYear}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px 20px 30px; text-align: center;">
              <img src="https://www.inquivesta.in/logo.png" alt="INQUIVESTA" width="300" style="display: block; width: 300px; max-width: 100%; height: auto; margin: 0 auto;">
              <p style="color: #666; margin: 15px 0 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; font-family: monospace;">
                &lt; NUKKAD NATAK - STREET PLAY &gt;
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E74C3C;">
                <tr>
                  <td style="background-color: #E74C3C; padding: 10px; text-align: center;">
                    <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-family: monospace;">
                      [ TEAM REGISTERED ]
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px; font-family: 'Courier New', monospace;">
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                <span style="color: #E74C3C;">&gt; TEAM DETAILS</span><br>
                Leader: <strong>${data.teamLeaderName}</strong><br>
                College: <strong>${data.collegeName}</strong><br>
                Amount Paid: <span style="background-color: #F4D03F; color: #1A1A1A; padding: 0 4px; font-size: 12px;">₹${data.amountPaid}</span>
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #333; margin-bottom: 30px;">
                <tr>
                  <td colspan="2" style="background-color: #252525; padding: 5px 15px; border-bottom: 1px solid #333;">
                    <p style="margin: 0; color: #666; font-size: 10px; letter-spacing: 2px;">// REGISTRATION DATA</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">REGISTRATION ID</p>
                    <p style="margin: 0; font-size: 12px; color: #E74C3C; word-break: break-all;">${data.registrationId}</p>
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">TEAM SIZE</p>
                    <p style="margin: 0; font-size: 18px; color: #E74C3C;">${data.teamSize} Members</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 15px;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">DRAMA SYNOPSIS</p>
                    <div style="margin: 0; font-size: 12px; color: #ccc; line-height: 1.6; font-style: italic;">
                      "${truncatedSynopsis}"
                    </div>
                  </td>
                </tr>
              </table>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; padding: 15px; border: 1px dashed #E74C3C; background-color: #252525;">
                  <p style="color: #666; margin: 0 0 15px 0; font-size: 10px; letter-spacing: 2px;">TEAM ENTRY QR CODE</p>
                  <table cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #ffffff;">
                    <tr>
                      <td style="padding: 15px; background-color: #ffffff;">
                        <img src="cid:qrcode" alt="Entry QR Code" width="200" height="200" style="display: block; width: 200px; height: 200px;">
                      </td>
                    </tr>
                  </table>
                  <p style="color: #666; margin: 15px 0 0 0; font-size: 10px; letter-spacing: 2px;">SCAN AT VENUE</p>
                </div>
              </div>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border: 1px solid #E74C3C; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="color: #E74C3C; margin: 0 0 10px 0; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      🎭 PERFORMANCE DAY INFO
                    </p>
                    <ul style="color: #cccccc; margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.6; list-style-type: square;">
                      <li>All team members must carry valid ID cards.</li>
                      <li>Team leader must report 1 hour before scheduled slot.</li>
                      <li>Props and costumes are allowed.</li>
                      <li>Performance timings will be shared before the event.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border: 1px solid #333; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 15px; text-align: center;">
                    <p style="color: #888; margin: 0; font-size: 12px; line-height: 1.6;">
                      💬 If you have any issues, reply to this email with <a href="mailto:inquivesta@iiserkol.ac.in" style="color: #E74C3C; text-decoration: none;">inquivesta@iiserkol.ac.in</a> in CC.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #000000; padding: 20px; text-align: center; border-top: 2px solid #E74C3C;">
              <p style="color: #E74C3C; margin: 0 0 10px 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-family: monospace;">
                INQUIVESTA XII
              </p>
              <p style="color: #444; margin: 0; font-size: 10px; line-height: 1.4; font-family: monospace;">
                IISER KOLKATA • MOHANPUR, WB
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
