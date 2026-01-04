import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { resend } from '@/lib/resend/client'
import { getMultiEventConfig } from '@/lib/events/multi-event-config'
import QRCode from 'qrcode'

// Multi-event registration handler for events like Soulbeats and Bullseye
// These events have multiple sub-events that participants can choose from

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventId, ...registrationData } = body

    // Validate event exists in multi-event config
    const config = getMultiEventConfig(eventId)
    if (!config) {
      return NextResponse.json({ error: 'Invalid multi-event' }, { status: 400 })
    }

    // Validate email
    const email = registrationData.participant_email
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check for duplicate email
    const { data: existingRegistration } = await supabaseAdmin
      .from(config.tableName)
      .select('id')
      .eq('participant_email', email.toLowerCase())
      .single()

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'This email is already registered for this event' },
        { status: 400 }
      )
    }

    // Validate sub_events
    if (!registrationData.sub_events || !Array.isArray(registrationData.sub_events) || registrationData.sub_events.length === 0) {
      return NextResponse.json({ error: 'Please select at least one event' }, { status: 400 })
    }

    // Prepare data for insert
    const insertData = {
      participant_name: registrationData.participant_name,
      participant_email: email.toLowerCase(),
      participant_phone: registrationData.participant_phone,
      institution: registrationData.institution || null,
      sub_events: registrationData.sub_events,
      total_amount: registrationData.total_amount,
      amount_paid: registrationData.amount_paid,
      utr_number: registrationData.utr_number || null,
      payment_qr_used: registrationData.payment_qr_used || null,
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
        from: `${config.name} <${config.emailFrom}>`,
        to: email.toLowerCase(),
        subject: `Registration Confirmed - ${config.name} | Inquivesta XII`,
        html: generateMultiEventEmailHTML({
          eventName: config.name,
          participantName: registrationData.participant_name,
          registrationId: registration.id,
          subEvents: registrationData.sub_events,
          amountPaid: registrationData.amount_paid,
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

interface SubEventData {
  id: string
  name: string
  fee: number
  group_size?: number
  members?: string[]
}

interface MultiEventEmailData {
  eventName: string
  participantName: string
  registrationId: string
  subEvents: SubEventData[]
  amountPaid: number
}

function generateMultiEventEmailHTML(data: MultiEventEmailData): string {
  const subEventsList = data.subEvents.map(se => {
    let eventStr = `<strong>${se.name}</strong> - ${se.fee === 0 ? 'FREE' : `₹${se.fee}`}`
    if (se.group_size) {
      eventStr += ` (${se.group_size} members)`
    }
    if (se.members && se.members.length > 0) {
      eventStr += `<br><span style="color: #888; font-size: 12px;">Team: ${se.members.join(', ')}</span>`
    }
    return eventStr
  }).join('<br><br>')

  const currentYear = new Date().getFullYear()

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed - ${data.eventName}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1A1A1A; border: 2px solid #D2B997;">
          
          <tr>
            <td style="background-color: #D2B997; height: 4px;"></td>
          </tr>

          <tr>
            <td style="padding: 20px 30px; border-bottom: 1px dashed #D2B997;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <p style="color: #D2B997; font-size: 10px; margin: 0; letter-spacing: 2px; font-family: monospace;">IISER KOLKATA</p>
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
                &lt; INDIA'S LARGEST SCIENCE FESTIVAL &gt;
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #D2B997;">
                <tr>
                  <td style="background-color: #D2B997; padding: 10px; text-align: center;">
                    <p style="color: #1A1A1A; margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-family: monospace;">
                      [ REGISTRATION CONFIRMED ]
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px; font-family: 'Courier New', monospace;">
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                <span style="color: #D2B997;">&gt; PARTICIPANT DETAILS</span><br>
                User: <strong>${data.participantName}</strong><br>
                Status: <span style="background-color: #D2B997; color: #1A1A1A; padding: 0 4px; font-size: 12px;">ACTIVE</span>
              </p>
              
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
                Your registration for <strong style="color: #ffffff; border-bottom: 1px dotted #D2B997;">${data.eventName}</strong> has been successfully confirmed.
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
                    <p style="margin: 0; font-size: 14px; color: #D2B997;">${data.registrationId}</p>
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">AMOUNT PAID</p>
                    <p style="margin: 0; font-size: 18px; color: #D2B997;">${data.amountPaid === 0 ? 'FREE' : `₹${data.amountPaid}`}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 15px;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">REGISTERED EVENTS</p>
                    <div style="margin: 0; font-size: 13px; color: #ccc; line-height: 1.8;">
                      ${subEventsList}
                    </div>
                  </td>
                </tr>
              </table>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; padding: 15px; border: 1px dashed #D2B997; background-color: #252525;">
                  <p style="color: #666; margin: 0 0 15px 0; font-size: 10px; letter-spacing: 2px;">ENTRY QR CODE</p>
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
              
              <p style="color: #666; font-size: 11px; text-align: center; margin: 0 0 30px 0;">
                If the QR code doesn't display, please find it attached to this email.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border: 1px solid #D2B997; margin-bottom: 20px;">
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

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border: 1px solid #333; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 15px; text-align: center;">
                    <p style="color: #888; margin: 0; font-size: 12px; line-height: 1.6;">
                      💬 If you have any issues, reply to this email with <a href="mailto:inquivesta@iiserkol.ac.in" style="color: #D2B997; text-decoration: none;">inquivesta@iiserkol.ac.in</a> in CC.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #000000; padding: 20px; text-align: center; border-top: 2px solid #D2B997;">
              <p style="color: #D2B997; margin: 0 0 10px 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-family: monospace;">
                INQUIVESTA XII
              </p>
              <p style="color: #444; margin: 0; font-size: 10px; line-height: 1.4; font-family: monospace;">
                IISER KOLKATA<br>
                MOHANPUR, WB
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
