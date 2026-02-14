import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { email, hotelName, hotelLocation, roomNumber, guests, roomType } = await request.json();

        if (!email || !hotelName || !hotelLocation || !roomNumber) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass) {
            console.warn("⚠️  Email credentials not found.");
            return NextResponse.json({ message: 'Server misconfigured: Missing email credentials', success: false }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        const guestListHtml = guests && guests.length > 0
            ? `<ul style="padding-left: 20px; color: #555;">${guests.map((g: string) => `<li>${g}</li>`).join('')}</ul>`
            : '<p style="color: #777; font-style: italic;">No guests assigned yet.</p>';

        const mailOptions = {
            from: `"Shaadi Sutra" <${emailUser}>`,
            to: email,
            subject: `Room Allocation Details - Room ${roomNumber}`,
            html: `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5d5c5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <div style="background-color: #8b4513; padding: 20px; text-align: center;">
                        <h2 style="color: #ffffff; margin: 0; font-family: 'Times New Roman', serif; letter-spacing: 1px;">Room Allocation Details</h2>
                    </div>
                    
                    <div style="padding: 30px;">
                        <p style="font-size: 16px; color: #333; line-height: 1.5; margin-top: 0;">Hello,</p>
                        <p style="font-size: 16px; color: #333; line-height: 1.5;">Here are the details for your room allocation:</p>

                        <div style="background-color: #fcfbf9; border-left: 4px solid #d4af37; padding: 20px; margin: 25px 0; border-radius: 4px;">
                            <h3 style="color: #8b4513; margin-top: 0; font-size: 20px;">Room #${roomNumber} <span style="font-size: 14px; color: #666; font-weight: normal;">(${roomType})</span></h3>
                            
                            <div style="margin-bottom: 15px;">
                                <strong style="color: #555; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Hotel</strong>
                                <span style="font-size: 16px; color: #333;">${hotelName}</span>
                            </div>

                            <div style="margin-bottom: 15px;">
                                <strong style="color: #555; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Location</strong>
                                <a href="${hotelLocation}" target="_blank" style="color: #d4af37; text-decoration: none; font-size: 16px;">View on Google Maps &rarr;</a>
                            </div>

                            <div>
                                <strong style="color: #555; display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Guests</strong>
                                ${guestListHtml}
                            </div>

                        </div>

                        <div style="background-color: #fdfbf7; border-top: 2px solid #d4af37; border-bottom: 2px solid #d4af37; padding: 20px; margin: 30px 0; text-align: center;">
                            <p style="margin: 0; color: #8b4513; font-family: 'Times New Roman', serif; font-size: 18px; font-style: italic;">
                                Further details will be shared soon. Stay connected!
                            </p>
                        </div>

                        <p style="font-size: 14px; color: #666; font-style: italic;">Please save this email for your reference during check-in.</p>
                    </div>

                    <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-top: 1px solid #eee;">
                        <p style="font-size: 12px; color: #888; margin: 0;">Sent via Shaadi Sutra - Wedding Planner</p>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Email sent successfully', success: true });
    } catch (error: any) {
        console.error('Error sending room email:', error);
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
    }
}
