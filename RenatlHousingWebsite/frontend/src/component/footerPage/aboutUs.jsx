import React from "react";
import { FaHandshake, FaLightbulb, FaShieldAlt, FaUsers, FaCheckCircle, FaHeadset } from "react-icons/fa";

const AboutUs = () => (
  <>
    <div className="w-auto h-15 bg-purple-800"></div>
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center py-0 px-0">
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center py-16 px-4 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-5xl font-extrabold text-[#4338ca] mb-4 text-center tracking-tight">About RentEase</h1>
        <p className="text-xl text-gray-700 text-center max-w-2xl font-medium mb-2">
          India's most trusted rental housing platform, making renting easy, transparent, and accessible for all.
        </p>
        <p className="text-base text-gray-500 text-center max-w-2xl">
          We connect tenants and property owners directly, offering verified listings, zero brokerage, and a seamless digital experience.
        </p>
      </div>

      {/* Mission, Vision, Values */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-5 z-10 px-4">
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center border-t-4 border-[#8F87F1]">
          <FaHandshake className="text-4xl text-[#8F87F1] mb-3" />
          <h2 className="text-2xl font-bold text-[#4338ca] mb-2">Our Mission</h2>
          <p className="text-gray-600 text-center">Empower people to find their perfect home with trust, ease, and zero hassle—making rental housing simple and secure for all.</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center border-t-4 border-[#8F87F1]">
          <FaLightbulb className="text-4xl text-[#8F87F1] mb-3" />
          <h2 className="text-2xl font-bold text-[#4338ca] mb-2">Our Vision</h2>
          <p className="text-gray-600 text-center">To set new standards for transparency, technology, and customer satisfaction in the real estate industry.</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-8 flex flex-col items-center border-t-4 border-[#8F87F1]">
          <FaShieldAlt className="text-4xl text-[#8F87F1] mb-3" />
          <h2 className="text-2xl font-bold text-[#4338ca] mb-2">Our Values</h2>
          <ul className="text-gray-600 text-center list-disc list-inside">
            <li>Trust & Transparency</li>
            <li>Customer First</li>
            <li>Innovation</li>
            <li>Integrity</li>
            <li>Excellence</li>
          </ul>
        </div>
      </div>

      {/* Company Highlights */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-center items-center gap-8 mt-16 mb-10 px-4">
        <div className="flex-1 bg-white rounded-xl shadow p-8 flex flex-col items-center border border-gray-100">
          <FaUsers className="text-3xl text-[#8F87F1] mb-2" />
          <span className="block text-3xl font-extrabold text-[#4338ca]">10,000+</span>
          <span className="block text-gray-700 font-medium">Happy Users</span>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-8 flex flex-col items-center border border-gray-100">
          <FaCheckCircle className="text-3xl text-[#8F87F1] mb-2" />
          <span className="block text-3xl font-extrabold text-[#4338ca]">100%</span>
          <span className="block text-gray-700 font-medium">Verified Listings</span>
        </div>
        <div className="flex-1 bg-white rounded-xl shadow p-8 flex flex-col items-center border border-gray-100">
          <FaHeadset className="text-3xl text-[#8F87F1] mb-2" />
          <span className="block text-gray-700 font-medium">Customer Support</span>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow p-10 flex flex-col items-center mb-12 border-t-4 border-[#8F87F1]">
        <h2 className="text-3xl font-bold text-[#4338ca] mb-6 text-center">Why Choose RentEase?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="flex items-start gap-4">
            <FaShieldAlt className="text-2xl text-[#8F87F1] mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Verified & Secure</h3>
              <p className="text-gray-600">All listings are thoroughly verified for your safety and peace of mind.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaUsers className="text-2xl text-[#8F87F1] mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Direct Owner Connect</h3>
              <p className="text-gray-600">No brokers, no middlemen—connect directly with property owners.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaLightbulb className="text-2xl text-[#8F87F1] mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Smart Search</h3>
              <p className="text-gray-600">Advanced filters and AI-driven recommendations for the perfect match.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FaHeadset className="text-2xl text-[#8F87F1] mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">24/7 Support</h3>
              <p className="text-gray-600">Our team is always here to help you, day or night.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow p-10 flex flex-col items-center mb-16 border border-gray-100">
        <h2 className="text-2xl md:text-3xl font-bold text-[#4338ca] mb-4 text-center">Ready to Experience the RentEase Advantage?</h2>
        <p className="text-gray-600 text-center mb-6">Join thousands of happy users and discover a smarter, safer way to rent or list your property.</p>
        <a href="/" className="bg-[#8F87F1] text-white font-bold px-8 py-3 rounded-full shadow hover:bg-[#4338ca] transition text-lg">Get Started</a>
      </div>
    </div>
  </>
);

export default AboutUs;
