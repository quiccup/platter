import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    try {
        const { email, restaurantName, permission } = await request.json()

        if (!email || !restaurantName || !permission) {
            return NextResponse.json(
                { error: 'Missing required fields: email, restaurantName, permission' },
                { status: 400 }
            )
        }

        const senderEmail = 'noreply@platter.digital'

        const { data, error } = await resend.emails.send({
            from: `Platter <${senderEmail}>`, 
            to: [email],
            subject: `You've been invited to collaborate on ${restaurantName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #f97316;">You're invited to collaborate!</h2>
                
                <p>Hello!</p>
                
                <p>You've been invited to collaborate on <strong>${restaurantName}</strong> on Platter.</p>
                
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Your Permission Level:</h3>
                    <p style="margin-bottom: 0;">
                    ${permission === 'edit' 
                        ? '✏️ <strong>Can Edit</strong> - You can add, edit, and remove menu items'
                        : '👁️ <strong>View Only</strong> - You can view menu items but cannot make changes'
                    }
                    </p>
                </div>
                
                <p>This is a test email to verify that Resend is working correctly!</p>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                <p style="color: #6b7280; font-size: 12px;">
                    This invitation was sent via Platter.
                </p>
                </div>
            `,
        })

        if (error) {
            console.error('Resend error:', error)
            return NextResponse.json(
                { error: `Failed to send email: ${error.message || JSON.stringify(error)}` },
                { status: 500 }
            )
        }

        return NextResponse.json({ 
            success: true, 
            messageId: data?.id 
        })
        
    } catch (error) {
        console.error('Email sending error:', error)
        return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        )
    }
}