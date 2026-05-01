'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, Calendar, CreditCard, Loader2, MessageCircle } from 'lucide-react';
import Script from 'next/script';
import { createClient } from '@/utils/supabase/client';

export default function BookingWidget({ lawyer }: { lawyer: any }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      setUserEmail(session.user.email ?? '');
      const meta = session.user.user_metadata;
      setUserName(meta?.full_name ?? meta?.name ?? '');
    });
  }, []);

  const hasRazorpay = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const hasFee = lawyer.consultationFee && lawyer.consultationFee !== 'undefined';
  const numericFee = hasFee ? parseInt(lawyer.consultationFee.replace(/[^0-9]/g, ''), 10) : 0;

  const makePayment = async () => {
    if (!selectedSlot) return alert('Please select a time slot first');
    setIsProcessing(true);
    try {
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numericFee }),
      });
      const order = await response.json();
      if (order.error) throw new Error(order.error);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Amiquz',
        description: `Consultation with ${lawyer.name}`,
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) setBookingSuccess(true);
          else alert('Payment verification failed');
        },
        prefill: { name: userName, email: userEmail },
        theme: { color: '#1d4ed8' },
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function (response: any) {
        alert('Payment Failed: ' + response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong during payment setup.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="bg-white border border-green-200 rounded-xl p-6 sticky top-24 shadow-sm text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600 mb-4">Your consultation with {lawyer.name} has been scheduled for {selectedSlot}.</p>
        <p className="text-sm text-gray-500">A confirmation email has been sent to you.</p>
      </div>
    );
  }

  return (
    <>
      {hasRazorpay && <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />}
      <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
        
        {/* Fee + Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900">
            {hasFee ? lawyer.consultationFee : 'Fee on request'}
          </span>
          {lawyer.rating > 0 && (
            <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 font-bold text-gray-900 text-sm">{lawyer.rating}</span>
            </div>
          )}
        </div>

        <hr className="my-5 border-gray-200" />

        {/* Payment not set up yet — show contact instead */}
        {!hasRazorpay ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">💬 Request a Consultation</p>
              <p>Online booking is coming soon. For now, contact this lawyer directly to schedule.</p>
            </div>
            <button
              onClick={() => setShowContact(!showContact)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Lawyer
            </button>
            {showContact && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                <p className="font-medium mb-1">Send an enquiry via Amiquz</p>
                <p className="text-gray-500 text-xs">Enquiry form coming soon. For now, sign up and we will connect you manually.</p>
              </div>
            )}
          </div>
        ) : (
          /* Full booking flow when Razorpay is set up */
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Book a Consultation</h3>
            <p className="text-sm text-gray-600 mb-4">Select a time to speak with {lawyer.name} via video call or phone.</p>
            <div className="space-y-3 mb-6">
              {['Tomorrow, 10:00 AM', 'Wed, 2:00 PM', 'Thu, 11:00 AM'].map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full border rounded-lg p-3 text-left transition-all flex items-center justify-between group ${
                    selectedSlot === slot
                      ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                >
                  <p className={`font-medium ${selectedSlot === slot ? 'text-blue-800' : 'text-gray-900'}`}>{slot}</p>
                  <Calendar className={selectedSlot === slot ? 'text-blue-600' : 'text-gray-400'} />
                </button>
              ))}
            </div>
            <button
              onClick={makePayment}
              disabled={!selectedSlot || isProcessing}
              className={`w-full font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                !selectedSlot || isProcessing
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
              {isProcessing ? 'Processing...' : 'Pay & Book Now'}
            </button>
            <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 mr-1" /> Secure payment via Razorpay
            </p>
          </div>
        )}
      </div>
    </>
  );
}
