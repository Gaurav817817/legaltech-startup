'use client';

import { useState } from 'react';
import { Star, CheckCircle, Calendar, CreditCard, Loader2 } from 'lucide-react';
import Script from 'next/script';

export default function BookingWidget({ lawyer }: { lawyer: any }) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Extract number from "$200 / hr" string
  const numericFee = parseInt(lawyer.consultationFee.replace(/[^0-9]/g, ''), 10);

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
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock', // Fallback to mock if env not set for demo
        amount: order.amount,
        currency: order.currency,
        name: 'LegalLink',
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
          if (verifyData.success) {
            setBookingSuccess(true);
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'Client User',
          email: 'client@example.com',
        },
        theme: {
          color: '#1d4ed8',
        },
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
        <p className="text-gray-600 mb-4">Your consultation with {lawyer.name} has been successfully scheduled for {selectedSlot}.</p>
        <p className="text-sm text-gray-500">A confirmation email has been sent to you.</p>
      </div>
    );
  }

  return (
    <>
      <Script id="razorpay-checkout-js" src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-gray-900">{lawyer.consultationFee}</span>
          <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 font-bold text-gray-900 text-sm">{lawyer.rating}</span>
          </div>
        </div>
        
        <hr className="my-6 border-gray-200" />
        
        <h3 className="font-bold text-gray-900 mb-4">Book a Consultation</h3>
        <p className="text-sm text-gray-600 mb-6">Select a time to speak with {lawyer.name} via video call or phone.</p>
        
        <div className="space-y-3 mb-6">
          {['Tomorrow, 10:00 AM', 'Wed, Oct 12, 2:00 PM'].map((slot) => (
            <button 
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`w-full border rounded-lg p-3 text-left transition-all flex items-center justify-between group ${
                selectedSlot === slot ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50' : 'border-gray-300 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
              }`}
            >
              <div>
                <p className={`font-medium group-hover:text-blue-700 ${selectedSlot === slot ? 'text-blue-800' : 'text-gray-900'}`}>{slot}</p>
              </div>
              <Calendar className={selectedSlot === slot ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'} />
            </button>
          ))}
        </div>

        <button 
          onClick={makePayment}
          disabled={!selectedSlot || isProcessing}
          className={`w-full font-bold py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 ${
            !selectedSlot || isProcessing 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
          {isProcessing ? 'Processing...' : 'Pay & Book Now'}
        </button>
        <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center">
          <CheckCircle className="w-3 h-3 mr-1" /> Secure payment via Razorpay
        </p>
      </div>
    </>
  );
}
