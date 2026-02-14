import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with 5-minute expiry in Firestore
        const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

        await setDoc(doc(db, 'otps', email.toLowerCase()), {
            otp,
            expiry
        });

        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;

        if (!emailUser || !emailPass) {
            console.warn("⚠️  Email credentials not found. OTP would have been sent to:", email);
            console.log(`[MOCK OTP] Email: ${email}, OTP: ${otp}`);
            return NextResponse.json({ message: 'OTP simulated (missing credentials)', success: true });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });

        const mailOptions = {
            from: `"Shaadi Sutra Verification" <${emailUser}>`,
            to: email,
            subject: 'Your Verification Code - Shaadi Sutra',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5d5c5; border-radius: 8px;">
                    <h2 style="color: #8b4513; text-align: center;">Email Verification</h2>
                    <p>Hello,</p>
                    <p>Your verification code for Shaadi Sutra is:</p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; text-align: center;">
                        <h1 style="color: #d4af37; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
                    </div>

                    <p>This code will expire in <strong>5 minutes</strong>.</p>
                    <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666; text-align: center;">Shaadi Sutra Security Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'OTP sent successfully', success: true });
    } catch (error: any) {
        console.error('Error sending OTP:', error);
        return NextResponse.json({ message: `Error: ${error.message}`, success: false }, { status: 500 });
    }
}

