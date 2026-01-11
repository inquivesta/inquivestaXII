import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { resend } from '@/lib/resend/client'
import QRCode from 'qrcode'

// Masquerade registration handler
const EVENT_CONFIG = {
  id: 'masquerade',
  name: 'Masquerade',
  tableName: 'event_registrations_masquerade',
  emailFrom: 'masquerade@inquivesta.in',
  blindDateFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSdAVEU4YCQizp3Pwte0tZqbdVxcwn6w4zbae1yThgiMrlgAlQ/viewform',
}

interface Partner {
  name: string
  email: string
  phone: string
  institution: string
  gender: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      pass_type,
      name,
      email,
      phone,
      institution,
      gender,
      partner,
      total_amount,
      amount_paid,
      utr_number,
      payment_qr_used,
    } = body

    // Validate required fields
    if (!pass_type || !name || !email || !phone || !institution || !gender) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Validate pass type
    if (!['couple', 'single'].includes(pass_type)) {
      return NextResponse.json({ error: 'Invalid pass type' }, { status: 400 })
    }

    // Validate partner details for couple pass
    if (pass_type === 'couple') {
      if (!partner || !partner.name || !partner.email || !partner.phone || !partner.institution || !partner.gender) {
        return NextResponse.json({ error: 'Partner details are required for couple pass' }, { status: 400 })
      }
    }

    // Check for duplicate email
    const { data: existingRegistration } = await supabaseAdmin
      .from(EVENT_CONFIG.tableName)
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'This email is already registered for Masquerade' },
        { status: 400 }
      )
    }

    // Prepare data for insert
    const insertData = {
      pass_type,
      name,
      email: email.toLowerCase(),
      phone,
      institution,
      gender,
      partner: pass_type === 'couple' ? {
        name: partner.name,
        email: partner.email.toLowerCase(),
        phone: partner.phone,
        institution: partner.institution,
        gender: partner.gender,
      } : null,
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

    const passTypeLabel = pass_type === 'couple' ? 'Couple Pass' : `Single Pass (${gender === 'male' ? 'Male' : 'Female'})`

    // Send confirmation email
    try {
      await resend.emails.send({
        from: `${EVENT_CONFIG.name} <${EVENT_CONFIG.emailFrom}>`,
        to: email.toLowerCase(),
        subject: `You're In! ${EVENT_CONFIG.name} - ${passTypeLabel} | Inquivesta XII`,
        html: generateMasqueradeEmailHTML({
          name,
          email,
          institution,
          gender,
          passType: pass_type,
          passTypeLabel,
          partner: partner as Partner | null,
          registrationId: registration.id,
          amountPaid: amount_paid,
          blindDateFormUrl: EVENT_CONFIG.blindDateFormUrl,
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

interface MasqueradeEmailData {
  name: string
  email: string
  institution: string
  gender: string
  passType: string
  passTypeLabel: string
  partner: Partner | null
  registrationId: string
  amountPaid: number
  blindDateFormUrl: string
}

function generateMasqueradeEmailHTML(data: MasqueradeEmailData): string {
  const currentYear = new Date().getFullYear()
  const themeColor = '#EC4899' // Pink

  const partnerSection = data.partner ? `
    <tr>
      <td colspan="2" style="padding: 15px; border-bottom: 1px solid #333;">
        <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">💕 YOUR PARTNER</p>
        <p style="margin: 0; font-size: 13px; color: #ccc;">
          <strong>${data.partner.name}</strong><br>
          ${data.partner.email}<br>
          ${data.partner.phone}<br>
          ${data.partner.institution}
        </p>
      </td>
    </tr>
  ` : ''

  const singlePassSection = data.passType === 'single' ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border: 1px solid ${themeColor}; margin-bottom: 20px;">
      <tr>
        <td style="padding: 15px;">
          <p style="color: ${themeColor}; margin: 0 0 10px 0; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
            💫 BLIND DATE MATCHING
          </p>
          <p style="color: #cccccc; margin: 0 0 15px 0; font-size: 12px; line-height: 1.6;">
            As a single pass holder, you'll have a chance to find your prom partner through our blind date matching!
          </p>
          <a href="${data.blindDateFormUrl}" style="display: inline-block; background-color: ${themeColor}; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 12px; font-weight: bold;">
            FILL THE BLIND DATE FORM →
          </a>
        </td>
      </tr>
    </table>
  ` : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're In! - Masquerade</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050505;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #050505; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1A1A1A; border: 2px solid ${themeColor};">
          
          <tr>
            <td style="background-color: ${themeColor}; height: 4px;"></td>
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
                &lt; MASQUERADE - PROM NIGHT &gt;
              </p>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 0 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid ${themeColor};">
                <tr>
                  <td style="background-color: ${themeColor}; padding: 10px; text-align: center;">
                    <p style="color: white; margin: 0; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; font-family: monospace;">
                      🎭 YOU'RE IN! 🎭
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 30px; font-family: 'Courier New', monospace;">
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                <span style="color: ${themeColor};">&gt; PASS DETAILS</span><br>
                Name: <strong>${data.name}</strong><br>
                Pass: <span style="background-color: ${themeColor}; color: white; padding: 0 4px; font-size: 12px;">${data.passTypeLabel}</span>
              </p>
              
              <p style="color: #cccccc; font-size: 14px; line-height: 1.6; margin: 0 0 30px 0;">
                Your pass for <strong style="color: #ffffff; border-bottom: 1px dotted ${themeColor};">Masquerade</strong> has been confirmed! Get ready for an unforgettable night!
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
                    <p style="margin: 0; font-size: 14px; color: ${themeColor};">${data.registrationId}</p>
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #333; width: 50%; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">AMOUNT PAID</p>
                    <p style="margin: 0; font-size: 18px; color: ${themeColor};">₹${data.amountPaid}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px; border-bottom: 1px solid #333; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">NAME</p>
                    <p style="margin: 0; font-size: 13px; color: #ccc;">${data.name}</p>
                  </td>
                  <td style="padding: 15px; border-bottom: 1px solid #333; vertical-align: top;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">PASS TYPE</p>
                    <p style="margin: 0; font-size: 13px; color: ${themeColor};">${data.passTypeLabel}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 15px; border-bottom: 1px solid #333;">
                    <p style="margin: 0; font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">INSTITUTION</p>
                    <p style="margin: 0; font-size: 13px; color: #ccc;">${data.institution}</p>
                  </td>
                </tr>
                ${partnerSection}
              </table>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; padding: 15px; border: 1px dashed ${themeColor}; background-color: #252525;">
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

              ${singlePassSection}
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #252525; border: 1px solid ${themeColor}; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="color: ${themeColor}; margin: 0 0 10px 0; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                      🎭 IMPORTANT INFO
                    </p>
                    <ul style="color: #cccccc; margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.6; list-style-type: square;">
                      <li>Show this QR code at the venue for entry.</li>
                      <li>Your details will be verified at entry.</li>
                      <li>Dress code: Semi-formal / Prom attire.</li>
                      <li>No refunds will be issued under any circumstances.</li>
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

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 15px; text-align: center;">
                    <p style="color: ${themeColor}; margin: 0; font-size: 14px; font-style: italic;">
                      "Be Bold, Dance Bolder, Have Fun!" 🎭💃🕺
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #000000; padding: 20px; text-align: center; border-top: 2px solid ${themeColor};">
              <p style="color: ${themeColor}; margin: 0 0 10px 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; font-family: monospace;">
                INQUIVESTA XII - MASQUERADE
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
