import React from 'react';

const TermAndCondition = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center">
      {/* Sticky Purple Header Bar */}
      <div className="w-full h-19 bg-purple-800 flex items-center justify-center shadow-md sticky top-0 z-20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide">Terms & Conditions</h1>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-10 mb-16">
        <p className="text-purple-800 font-bold mb-8 text-center text-lg">Last Updated: 1 June 2024</p>

        {/* Section: Introduction */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            Welcome to 'Room Milega'! By accessing or using our website and services, you agree to be bound by these Terms & Conditions ("Terms") and our Privacy Policy. If you do not agree to these Terms, please do not use our services.
          </p>
        </section>

        {/* Section: User Responsibilities */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">2. User Accounts & Responsibilities</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>You must be at least 18 years old to create an account and use our services.</li>
            <li>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</li>
            <li>You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate.</li>
          </ul>
        </section>

        {/* Section: Property Listings */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">3. Property Listings & Content</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Property owners are solely responsible for the accuracy of their listings, including descriptions, pricing, and availability.</li>
            <li>'Room Milega' does not endorse any user, property, or listing. We are not a party to any rental agreement between users.</li>
            <li>You grant 'Room Milega' a non-exclusive, worldwide, royalty-free license to use, host, store, reproduce, and display content you submit (e.g., property photos).</li>
          </ul>
        </section>

        {/* Section: Booking and Financial Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">4. Booking & Financial Terms</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Renters agree to pay all fees and charges associated with a booking, as specified at the time of the transaction.</li>
            <li>Payments are processed through a third-party payment gateway. 'Room Milega' is not responsible for any issues arising from the payment process.</li>
            <li>Cancellation and refund policies are determined by the property owner and will be clearly stated in the listing.</li>
          </ul>
        </section>

        {/* Section: Prohibited Activities */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">5. Prohibited Activities</h2>
          <p className="text-gray-600 leading-relaxed mb-2">You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Violating any applicable laws or regulations.</li>
            <li>Posting false, misleading, or fraudulent information.</li>
            <li>Infringing on the intellectual property rights of others.</li>
            <li>Distributing spam, chain letters, or other unsolicited communications.</li>
            <li>Using our platform to harass, abuse, or harm another person.</li>
          </ul>
        </section>

        {/* Section: Disclaimers */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">6. Disclaimers & Limitation of Liability</h2>
          <p className="text-gray-600 leading-relaxed">
            Our services are provided "as is" and "as available" without any warranties. 'Room Milega' is not liable for any direct, indirect, incidental, or consequential damages arising from your use of our platform or any transaction between users.
          </p>
        </section>

        {/* Section: Changes to Terms */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">7. Changes to These Terms</h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to modify these Terms at any time. We will provide notice of any significant changes. Your continued use of the services after such changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        {/* Section: Contact Us */}
        <section>
          <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">8. Contact Us</h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions about these Terms, please contact us at <a href="mailto:roommilega1611@gmail.com" className="hover:text-yellow-400">roommilega1611@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermAndCondition;
