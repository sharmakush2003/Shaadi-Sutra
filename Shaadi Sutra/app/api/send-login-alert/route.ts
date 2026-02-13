import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { to, displayName, deviceInfo, loginTime, type } = await request.json();

        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        const isSignup = type === 'signup';
        const subject = isSignup ? 'Welcome to Shaadi Sutra!' : 'New Login Alert - Shaadi Sutra';

        const loginContent = `
            <h2 style="color: #8b4513; text-align: center;">New Login Detected</h2>
            <p>Hello ${displayName || 'User'},</p>
            <p>We detected a new login to your Shaadi Sutra account.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Time:</strong> ${loginTime}</p>
                <p><strong>Device:</strong> ${deviceInfo}</p>
            </div>

            <p>If this was you, you can ignore this email.</p>
            <p style="color: #d32f2f;"><strong>If you did not sign in, please contact support immediately.</strong></p>
        `;

        const signupContent = `
            <h2 style="color: #8b4513; text-align: center;">Welcome to Shaadi Sutra!</h2>
            <p>Hello ${displayName || 'User'},</p>
            <p>Thank you for creating an account with Shaadi Sutra. We are excited to help you plan your perfect wedding!</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Account created on:</strong> ${loginTime}</p>
                <p><strong>Device:</strong> ${deviceInfo}</p>
            </div>

            <p>Start exploring our features to manage your guests, budget, and vendors.</p>
        `;

        if (!emailUser || !emailPass) {
            console.warn("⚠️  Email credentials not found in env. Email would have been sent to:", to);
            console.log(`[MOCK EMAIL] Subject: ${subject}\nTo: ${to}\nType: ${type}`);
            return NextResponse.json({ message: 'Email simulated (missing credentials)', success: true });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        const mailOptions = {
            from: `"Shaadi Sutra Team" <${emailUser}>`,
            to: to,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5d5c5; border-radius: 8px;">
                    ${isSignup ? signupContent : loginContent}
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666; text-align: center;">Shaadi Sutra Security Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        // If it's a signup, also send a notification to the admin
        if (isSignup) {
            const adminMailOptions = {
                from: `"Shaadi Sutra System" <${emailUser}>`,
                to: emailUser, // Send to self/admin
                subject: `New User Signup: ${displayName || to}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5d5c5; border-radius: 8px;">
                        <h2 style="color: #8b4513; text-align: center;">New User Registration</h2>
                        <p>A new user has just signed up for Shaadi Sutra.</p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Name:</strong> ${displayName || 'N/A'}</p>
                            <p><strong>Email:</strong> ${to}</p>
                            <p><strong>Time:</strong> ${loginTime}</p>
                            <p><strong>Device:</strong> ${deviceInfo}</p>
                        </div>
                    </div>
                `,
            };
            await transporter.sendMail(adminMailOptions);
        }

        return NextResponse.json({ message: 'Email sent successfully', success: true });
    } catch (error: any) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
    }
}
