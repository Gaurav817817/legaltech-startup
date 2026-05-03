import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendBookingConfirmation } from '@/lib/resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_email,
      user_name,
      lawyer_name,
      slot,
      amount,
    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const bodyString = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyString)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }

    // Send confirmation email to the user
    if (user_email) {
      try {
        await sendBookingConfirmation({
          userEmail: user_email,
          userName: user_name || 'there',
          lawyerName: lawyer_name,
          slot,
          amount,
        });
      } catch (err) {
        console.error('Booking confirmation email failed (non-blocking):', err);
      }
    }

    return NextResponse.json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
