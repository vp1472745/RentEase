import React from "react";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center">
    {/* Sticky Purple Header Bar */}
    <div className="w-full h-16 bg-purple-800 flex items-center justify-center shadow-md sticky top-0 z-20">
    </div>
    {/* Main Card Container */}
    <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-10 mb-16">
      <p className="text-purple-800  font-bold mb-8 text-center text-lg">Effective Date: 1 June 2024</p>

      {/* Section: Introduction */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">Introduction</h2>
        <p className="text-gray-600 leading-relaxed">RentEase ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>
      </section>

      {/* Section: Information We Collect */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li><b>Personal Information:</b> Name, email address, phone number, address, and other information you provide when registering or using our services.</li>
          <li><b>Property Information:</b> Details you provide about properties you list or search for.</li>
          <li><b>Usage Data:</b> Pages visited, features used, IP address, device information, browser type, and cookies.</li>
          <li><b>Payment Information:</b> When you make payments, we collect payment details via secure third-party processors.</li>
        </ul>
      </section>

      {/* Section: How We Use Your Information */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>To provide, operate, and maintain our services.</li>
          <li>To process transactions and send confirmations.</li>
          <li>To communicate with you about your account, listings, or inquiries.</li>
          <li>To personalize your experience and improve our platform.</li>
          <li>To detect, prevent, and address technical issues or fraud.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>

      {/* Section: Sharing & Disclosure */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">Sharing & Disclosure</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>We do <b>not</b> sell your personal information.</li>
          <li>We may share information with service providers (e.g., payment processors, hosting) who help us operate our business.</li>
          <li>We may disclose information if required by law, regulation, or legal process.</li>
          <li>We may share information to protect the rights, property, or safety of RentEase, our users, or others.</li>
        </ul>
      </section>

      {/* Section: Data Security */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">Data Security</h2>
        <p className="text-gray-600 leading-relaxed">We use industry-standard security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure. We encourage you to use strong passwords and keep your account information confidential.</p>
      </section>

      {/* Section: Cookies & Tracking Technologies */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">Cookies & Tracking Technologies</h2>
        <p className="text-gray-600 leading-relaxed">We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings.</p>
      </section>

      {/* Section: Your Rights & Choices */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">Your Rights & Choices</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>You may access, update, or delete your personal information by logging into your account or contacting us.</li>
          <li>You may opt out of marketing communications at any time.</li>
          <li>You may request a copy of your data or ask us to delete your account.</li>
        </ul>
      </section>

      {/* Section: Children's Privacy */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">Children's Privacy</h2>
        <p className="text-gray-600 leading-relaxed">Our services are not intended for children under 18. We do not knowingly collect personal information from children under 18. If you believe a child has provided us with personal information, please contact us.</p>
      </section>

      {/* Section: Changes to This Policy */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">Changes to This Policy</h2>
        <p className="text-gray-600 leading-relaxed">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page. Please review this policy periodically for updates.</p>
      </section>

      {/* Section: Contact Us */}
      <section>
        <h2 className="text-2xl font-bold text-purple-800 mb-2 border-b border-gray-200 pb-2">Contact Us</h2>
        <p className="text-gray-600 leading-relaxed">If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at <a href="mailto:" className="text-purple-800 underline">support@rentease.com</a>.</p>
      </section>
    </div>
  </div>
);

export default PrivacyPolicy;
