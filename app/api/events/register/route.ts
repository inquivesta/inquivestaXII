import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { resend } from '@/lib/resend/client'
import { eventConfigs } from '@/lib/events/config'
import QRCode from 'qrcode'

// Gaming events that use player1_email instead of team_leader_email
const GAMING_EVENTS = ['headshot-bgmi', 'headshot-valorant']

// Individual events that use participant_email instead of team_leader_email
const INDIVIDUAL_EVENTS = ['photon', 'art-in-a-culture']

// Events that use direct name/email fields
const DIRECT_FIELD_EVENTS = ['masquerade', 'day-passes']

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, ...registrationData } = body

    // Validate event exists
    const config = eventConfigs[eventId]
    if (!config) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 })
    }

    // Check if registration is open
    if (!config.registrationOpen) {
      return NextResponse.json({ error: 'Registration is closed for this event' }, { status: 400 })
    }

    // Determine the email field based on event type
    const isGamingEvent = GAMING_EVENTS.includes(eventId)
    const isIndividualEvent = INDIVIDUAL_EVENTS.includes(eventId)
    const isDirectFieldEvent = DIRECT_FIELD_EVENTS.includes(eventId)
    
    let emailField: string
    let email: string
    
    if (isGamingEvent) {
      emailField = 'player1_email'
      email = registrationData.player1_email
    } else if (isIndividualEvent) {
      emailField = 'participant_email'
      email = registrationData.participant_email
    } else if (isDirectFieldEvent) {
      emailField = 'email'
      email = registrationData.email
    } else {
      emailField = 'team_leader_email'
      email = registrationData.team_leader_email
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check for duplicate email
    const { data: existingRegistration } = await supabaseAdmin
      .from(config.tableName)
      .select('id')
      .eq(emailField, email.toLowerCase())
      .single()

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'This email is already registered for this event' },
        { status: 400 }
      )
    }

    // Prepare data for insert - normalize email to lowercase
    const insertData = { ...registrationData }
    if (isGamingEvent) {
      insertData.player1_email = email.toLowerCase()
    } else if (isIndividualEvent) {
      insertData.participant_email = email.toLowerCase()
    } else if (isDirectFieldEvent) {
      insertData.email = email.toLowerCase()
    } else {
      insertData.team_leader_email = email.toLowerCase()
    }

    // Insert registration into database
    const { data: registration, error: insertError } = await supabaseAdmin
      .from(config.tableName)
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

    // Generate QR Code as Buffer for email attachment
    const qrCodeBuffer = await QRCode.toBuffer(registration.id, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'H'
    })

    // Convert buffer to base64 for attachments
    const qrCodeBase64 = qrCodeBuffer.toString('base64')

    // Get the appropriate name and email for the confirmation
    const recipientEmail = email.toLowerCase()
    let recipientName: string
    
    if (isGamingEvent) {
      recipientName = registrationData.player1_name
    } else if (isIndividualEvent) {
      recipientName = registrationData.participant_name
    } else if (isDirectFieldEvent) {
      recipientName = registrationData.name
    } else {
      recipientName = registrationData.team_leader_name
    }

    // Send confirmation email with QR code as CID inline image + regular attachment as fallback
    try {
      await resend.emails.send({
        from: `${config.name} <${config.emailFrom}>`,
        to: recipientEmail,
        subject: `Registration Confirmed - ${config.name} | Inquivesta XII`,
        html: generateEmailHTML({
          eventName: config.name,
          teamName: isIndividualEvent || isDirectFieldEvent ? null : registrationData.team_name,
          teamLeaderName: recipientName,
          registrationId: registration.id,
          teamMembers: isGamingEvent ? generateGamingTeamMembers(registrationData, eventId) : (isIndividualEvent || isDirectFieldEvent ? null : registrationData.team_members),
          amountPaid: registrationData.amount_paid,
          isGamingEvent,
          isIndividualEvent,
          isDirectFieldEvent,
          photoTitles: isIndividualEvent ? registrationData.photo_titles : null,
          passName: registrationData.pass_name,
          passDate: registrationData.pass_date,
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
        .from(config.tableName)
        .update({ email_sent: true, qr_code_sent: true })
        .eq('id', registration.id)

    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
      message: 'Registration successful! Check your email for confirmation.',
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}

// Helper function to generate team members array for gaming events
function generateGamingTeamMembers(data: Record<string, unknown>, eventId: string): Array<{ name: string }> {
  const members: Array<{ name: string }> = []
  const playerCount = eventId === 'headshot-bgmi' ? 5 : 4 // BGMI has 5 players, Valorant has 4
  
  for (let i = 1; i <= playerCount; i++) {
    const playerName = data[`player${i}_name`] as string
    if (playerName) {
      members.push({ name: playerName })
    }
  }
  
  return members
}

interface EmailData {
  eventName: string
  teamName: string | null
  teamLeaderName: string
  registrationId: string
  teamMembers: Array<{ name: string; [key: string]: string }> | null
  amountPaid: number
  isGamingEvent?: boolean
  isIndividualEvent?: boolean
  isDirectFieldEvent?: boolean
  photoTitles?: string[] | null
  passName?: string
  passDate?: string
}

function generateEmailHTML(data: EmailData): string {
  const membersList = data.teamMembers
    ?.map((member) => `${member.name}`)
    .join('<br>') || ''

  const photoTitlesList = data.photoTitles
    ?.map((title) => `• ${title}`)
    .join('<br>') || ''

  const currentYear = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Registration Confirmed - ${data.eventName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Client-specific resets */
    table, td, div, h1, p { font-family: 'Courier New', Courier, 'Lucida Sans Typewriter', 'Lucida Typewriter', monospace; }
    body { margin: 0; padding: 0; background-color: #0d0d0d; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    
    /* Utilities */
    .mono { font-family: 'Courier New', Courier, monospace; }
    .uppercase { text-transform: uppercase; letter-spacing: 2px; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #050505;">
  
  <!-- Preheader -->
  <div style="display: none; font-size: 1px; color: #050505; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Registration confirmed for ${data.eventName}. See ticket details inside.
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #050505; padding: 20px 0;">
    <tr>
      <td align="center">
        
        <!-- Main Container (The Terminal) -->
        <!--[if mso]>
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0"><tr><td width="600">
        <![endif]-->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #1A1A1A; border: 2px solid #D2B997; min-width: 320px;">
          
          <!-- Top Decorator Bar -->
          <tr>
            <td style="background-color: #D2B997; height: 4px; line-height: 4px; font-size: 1px;">&nbsp;</td>
          </tr>

          <!-- System Header -->
          <tr>
            <td style="padding: 20px 30px; border-bottom: 1px dashed #D2B997; text-align: left;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="left">
                     <p style="color: #D2B997; font-size: 10px; margin: 0; letter-spacing: 2px;">IISER KOLKATA</p>
                  </td>
                  <td align="right">
                    <p style="color: #666; font-size: 10px; margin: 0; letter-spacing: 2px;">${currentYear}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Logo Section -->
          <tr>
            <td style="padding: 40px 30px 20px 30px; text-align: center;">
              <img src="https://www.inquivesta.in/logo.png" alt="INQUIVESTA" width="300" style="display: block; border: 0; width: 300px; max-width: 100%; height: auto; margin: 0 auto;">
              <p style="color: #666; margin: 15px 0 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">
                &lt; INDIA'S LARGEST SCIENCE FESTIVAL &gt;
              </p>
            </td>
          </tr>
          
          <!-- Status Banner -->
          <tr>
            <td style="padding: 0 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border: 1px solid #D2B997;">
                <tr>
                  <td style="background-color: #D2B997; padding: 10px; text-align: center;">
                    <p style="color: #1A1A1A; margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                      [ REGISTRATION CONFIRMED ]
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                <span style="color: #D2B997;">&gt; PARTICIPANT DETAILS</span><br>
                User: <strong>${data.teamLeaderName}</strong><br>
                Status: <span style="background-color: #D2B997; color: #1A1A1A; padding: 0 4px; font-size: 12px;">ACTIVE</span>
              </p>
              
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
                Your registration for <strong style="color: #ffffff; border-bottom: 1px dotted #D2B997;">${data.eventName}</strong> has been successfully confirmed. Please use the details below for entry.
              </p>
              
              <!-- Data Grid -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border: 1px solid #333; margin-bottom: 30px;">
                <tr>
                  <td colspan="2" style="background-color: #252525; padding: 5px 15px; border-bottom: 1px solid #333;">
                     <p style="margin: 0; color: #666; font-size: 10px; letter-spacing: 2px;">// REGISTRATION DATA</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #333; border-right: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">REGISTRATION ID</p>
                    <p style="margin: 0; font-size: 14px; color: #D2B997;">${data.registrationId}</p>
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">${data.isIndividualEvent || data.isDirectFieldEvent ? 'PARTICIPANT' : 'TEAM NAME'}</p>
                    <p style="margin: 0; font-size: 14px; color: #D2B997;">${data.isIndividualEvent || data.isDirectFieldEvent ? data.teamLeaderName : data.teamName}</p>
                  </td>
                </tr>
                ${data.passName ? `
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #333; border-right: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">PASS TYPE</p>
                    <p style="margin: 0; font-size: 14px; color: #F4D03F;">${data.passName}</p>
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">VALID FOR</p>
                    <p style="margin: 0; font-size: 14px; color: #F4D03F;">${data.passDate}</p>
                  </td>
                </tr>
                ` : ''}
                ${data.isIndividualEvent ? `
                ${photoTitlesList ? `
                <tr>
                  <td colspan="2" style="padding: 15px; border-bottom: 1px solid #333;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">PHOTOGRAPH TITLE(S)</p>
                    <div style="margin: 0; font-size: 13px; color: #ccc; line-height: 1.6;">
                       ${photoTitlesList}
                    </div>
                  </td>
                </tr>
                ` : ''}
                ` : `
                <tr>
                  <td colspan="2" style="padding: 15px; border-bottom: 1px solid #333;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">TEAM MEMBERS</p>
                    ${membersList ? `
                    <div style="margin: 0; font-size: 13px; color: #ccc; line-height: 1.6;">
                       ${membersList}
                    </div>
                    ` : '<span style="color:#666;">-</span>'}
                  </td>
                </tr>
                `}
                <tr>
                  <td colspan="2" style="padding: 15px;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">AMOUNT PAID</p>
                    <p style="margin: 0; font-size: 18px; color: #D2B997;">${data.amountPaid === 0 ? 'FREE' : `₹${data.amountPaid}`}</p>
                  </td>
                </tr>
              </table>
              
              <!-- QR Code Section -->
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; padding: 15px; border: 1px dashed #D2B997; background-color: #252525;">
                    <p style="color: #666; margin: 0 0 15px 0; font-size: 10px; letter-spacing: 2px;">ENTRY QR CODE</p>
                    <table cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #ffffff; padding: 0;">
                      <tr>
                        <td style="padding: 15px; background-color: #ffffff;">
                          <img src="cid:qrcode" alt="Entry QR Code" width="200" height="200" style="display: block; width: 200px; height: 200px; border: none;">
                        </td>
                      </tr>
                    </table>
                    <p style="color: #888; margin: 15px 0 5px 0; font-size: 11px; letter-spacing: 1px;">Registration ID:</p>
                    <p style="color: #D2B997; margin: 0 0 15px 0; font-size: 12px; font-family: monospace; word-break: break-all;">${data.registrationId}</p>
                    <p style="color: #666; margin: 0; font-size: 10px; letter-spacing: 2px;">SCAN AT VENUE</p>
                </div>
              </div>
              
              <!-- Fallback notice -->
              <p style="color: #666; font-size: 11px; text-align: center; margin: 0 0 30px 0;">
                If the QR code doesn't display, please find it attached to this email.
              </p>
              
              <!-- Important Warning -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #252525; border: 1px solid #D2B997; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="color: #D2B997; margin: 0 0 10px 0; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      ⚠ IMPORTANT INFO
                    </p>
                    <ul style="color: #cccccc; margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.6; list-style-type: square;">
                      <li>Please save this email or take a screenshot of the QR code.</li>
                      <li>Arrive at the venue at least 15 minutes before the event.</li>
                      <li>Bring your valid College/School ID card for verification.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Contact -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #1A1A1A; border: 1px solid #333; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 15px; text-align: center;">
                    <p style="color: #888; margin: 0; font-size: 12px; line-height: 1.6;">
                      💬 If you have any issues, reply to this email with <a href="mailto:inquivesta@iiserkol.ac.in" style="color: #D2B997; text-decoration: none;">inquivesta@iiserkol.ac.in</a> in CC.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px; border-top: 1px dashed #333; padding-top: 20px;">
                Have questions? <a href="mailto:inquivesta@iiserkol.ac.in" style="color: #D2B997; text-decoration: none;">Contact Support</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 20px; text-align: center; border-top: 2px solid #D2B997;">
              <p style="color: #D2B997; margin: 0 0 10px 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">
                INQUIVESTA XII
              </p>
              <p style="color: #444; margin: 0; font-size: 10px; line-height: 1.4;">
                IISER KOLKATA<br>
                MOHANPUR, WB<br>
              </p>
              <div style="margin-top: 15px;">
                 <span style="color: #333;">[</span>
                 <a href="https://www.instagram.com/inquivesta_iiserk/" style="color: #888; text-decoration: none; font-size: 10px; margin: 0 5px; text-transform: uppercase;">INSTAGRAM</a>
                 <span style="color: #333;">|</span>
                 <a href="https://www.inquivesta.in" style="color: #888; text-decoration: none; font-size: 10px; margin: 0 5px; text-transform: uppercase;">WEBSITE</a>
                 <span style="color: #333;">]</span>
              </div>
            </td>
          </tr>
          
        </table>
        <!--[if mso]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`
}
