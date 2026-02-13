import { NextResponse } from 'next/server';
import { otpStore } from '../send-otp/route';

export async function POST(request: Request) {
    try {
        const { email, otp } = await request.json();

        if (!email || !otp) {
            return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
        }

        const storedData = otpStore.get(email);

        if (!storedData) {
            return NextResponse.json({ message: 'No OTP found for this email', success: false }, { status: 400 });
        }

        // Check if OTP has expired
        if (Date.now() > storedData.expiry) {
            otpStore.delete(email);
            return NextResponse.json({ message: 'OTP has expired', success: false }, { status: 400 });
        }

        // Verify OTP
        if (storedData.otp !== otp) {
            return NextResponse.json({ message: 'Invalid OTP', success: false }, { status: 400 });
        }

        // OTP is valid - clear it from storage
        otpStore.delete(email);

        return NextResponse.json({ message: 'OTP verified successfully', success: true });
    } catch (error: any) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ message: 'Failed to verify OTP', error: error.message }, { status: 500 });
    }
}
