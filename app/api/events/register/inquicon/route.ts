import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { resend } from '@/lib/resend/client'
import QRCode from 'qrcode'

// Inquicon Pass registration handler
const EVENT_CONFIG = {
  id: 'inquicon',
  name: 'Inquicon Pass',
  tableName: 'event_registrations_inquicon',
  emailFrom: 'inquicon@inquivesta.in',
  formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSeJvpkFXVb5SwxVKk11BmrZ07zaPY2WUqpLdE23bp4AVZ49bQ/viewform',
}

interface EventParticipation {
  id: string
  name: string
  selected: boolean
  requiresForm?: boolean
  grantsStagePass?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      participant_name,
      participant_email,
      participant_phone,
      institution,
      pass_type,
      events_participation,
      total_amount,
      amount_paid,
      utr_number,
      payment_qr_used,
    } = body

    // Validate required fields
    if (!participant_name || !participant_email || !participant_phone || !institution) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Check for duplicate email
    const { data: existingRegistration } = await supabaseAdmin
      .from(EVENT_CONFIG.tableName)
      .select('id')
      .eq('participant_email', participant_email.toLowerCase())
      .single()

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'This email is already registered for Inquicon' },
        { status: 400 }
      )
    }

    // Prepare data for insert
    const insertData = {
      participant_name,
      participant_email: participant_email.toLowerCase(),
      participant_phone,
      institution,
      pass_type: pass_type || 'general',
      events_participation: events_participation || [],
      total_amount,
      amount_paid,
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

    // Determine if user needs form link (Pokemon PvP or Cosplay selected)
    const selectedEvents = (events_participation as EventParticipation[]).filter(e => e.selected)
    const needsFormLink = selectedEvents.some(e => e.requiresForm)
    const isStagePass = pass_type === 'stage'

    // Build selected events list for email
    const eventsList = selectedEvents.length > 0
      ? selectedEvents.map(e => `• ${e.name}${e.grantsStagePass ? ' (Stage Pass)' : ''}`).join('<br>')
      : '• General Entry Only'

    // Send confirmation email
    try {
      await resend.emails.send({
        from: `${EVENT_CONFIG.name} <${EVENT_CONFIG.emailFrom}>`,
        to: participant_email.toLowerCase(),
        subject: `${isStagePass ? '🎭 Stage' : '🎫 General'} Pass Confirmed - ${EVENT_CONFIG.name} | Inquivesta XII`,
        html: generateInquiconEmailHTML({
          participantName: participant_name,
          registrationId: registration.id,
          passType: pass_type,
          eventsList,
          amountPaid: amount_paid,
          needsFormLink,
          formLink: EVENT_CONFIG.formLink,
        }),
        attachments: [
          {
            filename: 'qrcode.png',
            content: qrCodeBase64,
            contentId: 'qrcode',
          },
          {
            filename: `inquicon-pass-${registration.id.slice(0, 8)}.png`,
            content: qrCodeBase64,
          },
        ],
      })

      // Update email_sent status
      await supabaseAdmin
        .from(EVENT_CONFIG.tableName)
        .update({ 
          email_sent: true, 
          qr_code_sent: true,
          form_link_sent: needsFormLink 
        })
        .eq('id', registration.id)

    } catch (emailError) {
      console.error('Email send error:', emailError)
    }

    return NextResponse.json({
      success: true,
      registrationId: registration.id,
      passType: pass_type,
      needsFormLink,
      message: 'Pass registration successful! Check your email for confirmation.',
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}

interface InquiconEmailData {
  participantName: string
  registrationId: string
  passType: string
  eventsList: string
  amountPaid: number
  needsFormLink: boolean
  formLink: string
}

function generateInquiconEmailHTML(data: InquiconEmailData): string {
  const currentYear = new Date().getFullYear()
  const isStagePass = data.passType === 'stage'
  const themeColor = isStagePass ? '#EC4899' : '#A855F7'
  const passEmoji = isStagePass ? '🎭' : '🎫'
  const passLabel = isStagePass ? 'STAGE PASS' : 'GENERAL PASS'

  const formLinkSection = data.needsFormLink ? `
              <tr>
                <td colspan="2" style="padding: 15px; background-color: #2a1a30; border: 1px solid ${themeColor};">
                  <p style="margin: 0; font-size: 12px; color: ${themeColor}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">⚠️ REQUIRED: FILL EVENT DETAILS FORM</p>
                  <p style="margin: 0; font-size: 13px; color: #ccc; line-height: 1.6; margin-bottom: 15px;">
                    Since you registered for Pokemon PvP or Cosplay, please fill out the detailed event form:
                  </p>
                  <a href="${data.formLink}" style="display: inline-block; background: linear-gradient(90deg, #A855F7, #EC4899); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold;">
                    Fill Event Details Form →
                  </a>
                </td>
              </tr>
  ` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${passLabel} Confirmed - Inquicon</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1A1A1A; border: 2px solid ${themeColor};">
          
          <tr>
            <td style="background: linear-gradient(90deg, #A855F7, #EC4899); height: 4px;"></td>
          </tr>

          <tr>
            <td style="padding: 20px 30px; border-bottom: 1px dashed ${themeColor};">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left">
                    <p style="color: ${themeColor}; font-size: 10px; margin: 0; letter-spacing: 2px; font-family: monospace;">IISER KOLKATA</p>
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
                &lt; INQUICON - ANIME & GAMING UNIVERSE &gt;
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid ${themeColor};">
                <tr>
                  <td style="background: linear-gradient(90deg, #A855F7, #EC4899); padding: 10px; text-align: center;">
                    <p style="color: white; margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-family: monospace;">
                      ${passEmoji} ${passLabel} CONFIRMED ${passEmoji}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px; font-family: 'Courier New', monospace;">
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                <span style="color: ${themeColor};">&gt; PASS HOLDER</span><br>
                Name: <strong>${data.participantName}</strong><br>
                Pass Type: <span style="background: linear-gradient(90deg, #A855F7, #EC4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">${passLabel}</span>
              </p>
              
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
                Welcome to <strong style="color: #ffffff; border-bottom: 1px dotted ${themeColor};">INQUICON</strong> - Your gateway to the Anime & Gaming Universe!
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #333; margin-bottom: 30px;">
                <tr>
                  <td colspan="2" style="background-color: #252525; padding: 5px 15px; border-bottom: 1px solid #333;">
                    <p style="margin: 0; color: #666; font-size: 10px; letter-spacing: 2px;">// PASS DATA</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">NAME</p>
                    <p style="margin: 0; font-size: 14px; color: #fff;">${data.participantName}</p>
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">PASS TYPE</p>
                    <p style="margin: 0; font-size: 14px; color: ${themeColor};">${passEmoji} ${passLabel}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">REGISTRATION CODE</p>
                    <p style="margin: 0; font-size: 14px; color: ${themeColor};">${data.registrationId}</p>
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">AMOUNT PAID</p>
                    <p style="margin: 0; font-size: 18px; color: ${themeColor};">₹${data.amountPaid}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 15px;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">EVENTS PARTICIPATION</p>
                    <div style="margin: 0; font-size: 13px; color: #ccc; line-height: 1.8;">
                      ${data.eventsList}
                    </div>
                  </td>
                </tr>
                ${formLinkSection}
              </table>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; padding: 15px; border: 1px dashed ${themeColor}; background-color: #252525;">
                  <p style="color: #666; margin: 0 0 15px 0; font-size: 10px; letter-spacing: 2px;">YOUR ${passLabel}</p>
                  <table cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #ffffff;">
                    <tr>
                      <td style="padding: 15px; background-color: #ffffff;">
                        <img src="cid:qrcode" alt="Entry QR Code" width="200" height="200" style="display: block; width: 200px; height: 200px;">
                      </td>
                    </tr>
                  </table>
                  <p style="color: #666; margin: 15px 0 0 0; font-size: 10px; letter-spacing: 2px;">SCAN AT VENUE ENTRANCE</p>
                </div>
              </div>
              
              <p style="color: #666; font-size: 11px; text-align: center; margin: 0 0 30px 0;">
                If the QR code doesn't display, please find it attached to this email.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border: 1px solid ${themeColor}; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="color: ${themeColor}; margin: 0 0 10px 0; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      ✨ WHAT'S INCLUDED
                    </p>
                    <ul style="color: #cccccc; margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.6; list-style-type: square;">
                      <li>Access to all Inquicon activities</li>
                      <li>Anime screenings & gaming zones</li>
                      <li>Exclusive merchandise booths</li>
                      ${isStagePass ? '<li><strong style="color: #EC4899;">Priority access to stage events</strong></li>' : ''}
                    </ul>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1A1A1A; border: 1px solid #333; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 15px; text-align: center;">
                    <p style="color: #888; margin: 0; font-size: 12px; line-height: 1.6;">
                      💬 If you have any issues, reply to this email with <a href="mailto:inquivesta@iiserkol.ac.in" style="color: ${themeColor}; text-decoration: none;">inquivesta@iiserkol.ac.in</a> in CC.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #000000; padding: 20px; text-align: center; border-top: 2px solid ${themeColor};">
              <p style="color: ${themeColor}; margin: 0 0 10px 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-family: monospace;">
                INQUIVESTA XII - INQUICON
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
