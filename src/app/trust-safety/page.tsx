export default function TrustSafetyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Trust & Safety</h1>
        <p className="text-lg text-gray-600 mb-8">
          At LexConnect, your security and trust are our top priorities. Here is how we ensure a safe platform for both clients and attorneys.
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Verified Attorneys Only</h2>
            <p className="text-gray-600 leading-relaxed">
              Every lawyer on our platform undergoes a rigorous background check. We verify their state bar license, disciplinary history, and professional standing before they can interact with clients.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">2. 256-bit Secure Payments</h2>
            <p className="text-gray-600 leading-relaxed">
              All financial transactions, including consultation bookings and retainers, are processed through Razorpay using bank-level 256-bit encryption. We never store your raw credit card data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Data Privacy & Confidentiality</h2>
            <p className="text-gray-600 leading-relaxed">
              Legal matters require strict confidentiality. Our messaging systems and AI Intake chats are securely encrypted and designed to protect your personally identifiable information (PII).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Authentic Reviews</h2>
            <p className="text-gray-600 leading-relaxed">
              We operate a closed-loop review system. Only clients who have actually booked and completed a consultation through LexConnect can leave a review, ensuring absolute authenticity.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
