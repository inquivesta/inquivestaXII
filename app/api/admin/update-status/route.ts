import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/client'
import { getAdminSession } from '@/lib/admin-auth/session'
import { resend } from '@/lib/resend/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const {
      registrationId,
      eventTableName,
      eventName,
      registrationStatus,
      paymentVerified,
      emailMessage,
      recipientEmail,
      recipientName,
    } = await request.json()

    if (!registrationId || !eventTableName) {
      return NextResponse.json(
        { error: 'Registration ID and event table name are required' },
        { status: 400 }
      )
    }

    // Update the registration in the database
    const { error: updateError } = await supabaseAdmin
      .from(eventTableName)
      .update({
        registration_status: registrationStatus,
        payment_verified: paymentVerified,
        updated_at: new Date().toISOString(),
      })
      .eq('id', registrationId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update registration status' },
        { status: 500 }
      )
    }

    // Send email notification if recipient email is provided
    if (recipientEmail) {
      try {
        const emailSubject = getEmailSubject(registrationStatus, paymentVerified, eventName)
        const emailBody = getEmailBody(recipientName, registrationStatus, paymentVerified, emailMessage, eventName, registrationId)

        await resend.emails.send({
          from: 'INQUIVESTA XII <noreply@inquivesta.in>',
          to: [recipientEmail],
          cc: ['inquivesta@iiserkol.ac.in'],
          subject: emailSubject,
          html: emailBody,
        })
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Don't fail the entire request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Registration status updated successfully',
    })
  } catch (error) {
    console.error('Update status error:', error)
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    )
  }
}

function getEmailSubject(registrationStatus: string, paymentVerified: boolean, eventName: string): string {
  const event = eventName || 'Event'
  if (registrationStatus === 'cancelled') {
    return `INQUIVESTA XII - ${event} Registration Cancelled`
  }
  if (registrationStatus === 'verified' && paymentVerified) {
    return `INQUIVESTA XII - ${event} Registration Verified ✓`
  }
  if (!paymentVerified) {
    return `INQUIVESTA XII - ${event} Payment Verification Required`
  }
  return `INQUIVESTA XII - ${event} Registration Status Update`
}

function getEmailBody(
  recipientName: string,
  registrationStatus: string,
  paymentVerified: boolean,
  customMessage: string | null,
  eventName: string,
  registrationId: string
): string {
  const name = recipientName || 'Participant'
  const event = eventName || 'Event'
  
  let statusMessage = ''
  let statusColor = '#F8C471'
  
  if (registrationStatus === 'cancelled') {
    statusMessage = `
      <p style="color: #ef4444; font-weight: bold; font-size: 18px;">
        ❌ Your registration has been cancelled.
      </p>
      <p>
        If you believe this is an error or have any questions, please contact us immediately 
        at <a href="mailto:inquivesta@iiserkol.ac.in">inquivesta@iiserkol.ac.in</a>.
      </p>
    `
    statusColor = '#ef4444'
  } else if (registrationStatus === 'verified' && paymentVerified) {
    statusMessage = `
      <p style="color: #22c55e; font-weight: bold; font-size: 18px;">
        ✓ Your registration has been verified!
      </p>
      <p>
        Your payment has been confirmed and your registration is now complete. 
        We look forward to seeing you at INQUIVESTA XII!
      </p>
    `
    statusColor = '#22c55e'
  } else if (!paymentVerified) {
    statusMessage = `
      <p style="color: #eab308; font-weight: bold; font-size: 18px;">
        ⚠️ Payment Verification Required
      </p>
      <p>
        We could not verify your payment. Please ensure you have made the correct payment 
        and provide us with the correct UTR/Transaction ID.
      </p>
      <p>
        If you have already paid, please reply to this email with your payment screenshot 
        and transaction details.
      </p>
    `
    statusColor = '#eab308'
  } else {
    statusMessage = `
      <p style="color: #F8C471; font-weight: bold; font-size: 18px;">
        📋 Registration Status Update
      </p>
      <p>
        Your registration status has been updated. Current status: <strong>${registrationStatus}</strong>
      </p>
    `
  }

  const customMessageHtml = customMessage ? `
    <div style="background: #2A2A2A; border-left: 4px solid ${statusColor}; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="color: #D2B997; font-size: 12px; margin-bottom: 8px;">Message from Admin:</p>
      <p style="color: #ffffff; margin: 0;">${customMessage}</p>
    </div>
  ` : ''

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #1A1A1A; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header with Logo -->
        <div style="text-align: center; padding: 30px 0; border-bottom: 1px solid #D2B997;">
          <img src="https://www.inquivesta.in/logo.png" alt="INQUIVESTA XII" width="300" style="display: block; width: 300px; max-width: 100%; height: auto; margin: 0 auto;">
          <p style="color: #A8D8EA; margin: 15px 0 0 0; font-size: 14px;">
            Annual Science Fest of IISER Kolkata
          </p>
        </div>

        <!-- Event & Registration Info -->
        <div style="background: #2A2A2A; padding: 15px 20px; margin-top: 20px; border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #D2B997; font-size: 12px; padding: 5px 0;">Event:</td>
              <td style="color: #ffffff; font-size: 14px; font-weight: bold; padding: 5px 0; text-align: right;">${event}</td>
            </tr>
            <tr>
              <td style="color: #D2B997; font-size: 12px; padding: 5px 0;">Registration ID:</td>
              <td style="color: #A8D8EA; font-size: 12px; font-family: monospace; padding: 5px 0; text-align: right;">${registrationId}</td>
            </tr>
          </table>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px; color: #ffffff;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Dear <strong>${name}</strong>,
          </p>

          ${statusMessage}

          ${customMessageHtml}

          <p style="margin-top: 30px; color: #D2B997;">
            If you have any questions, feel free to reach out to us.
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; border-top: 1px solid #D2B997; color: #888;">
          <p style="margin: 0; font-size: 12px;">
            INQUIVESTA XII | IISER Kolkata
          </p>
          <p style="margin: 5px 0 0 0; font-size: 12px;">
            <a href="mailto:inquivesta@iiserkol.ac.in" style="color: #A8D8EA;">inquivesta@iiserkol.ac.in</a>
          </p>
          <p style="margin: 10px 0 0 0; font-size: 11px; color: #666;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}
