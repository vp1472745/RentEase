import React, { useState } from "react";
import { motion } from "framer-motion";
import Footer from "../component/footer.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import Receipted from "../pages/Receiptedgenator.jsx";
import ComingSoon from "../component/commingsonn.jsx";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import {
  CreditCard,
  Diamond,
  Home as HomeIcon,
  Receipt,
  Wrench,
  Award,
  Headphones,
} from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import banner from "../assets/banner.gif";
import one from "../assets/homebanner.jpg";
import second from "../assets/second.jpg";

// Dummy Testimonials Data
const testimonials = [
  {
    id: 1,
    name: "Rajiv Dhawan",
    location: "Hyderabad",
    rating: 5.0,
    img: "/image.png",
    feedback:
      "Housing’s online rent agreement service acts as a one-stop-shop for tenants like me. Really appreciate the facility. Housing is a highly recommendable platform for tenants and landlords.",
  },
  {
    id: 2,
    name: "Victor Suri",
    location: "Bangalore",
    rating: 5.0,
    img: "/imagetwo.png",
    feedback:
      "Really appreciate the ease Housing’s online rent agreement facility provides. They know what a tenant generally goes through and have tried to address the very same issues.",
  },
];

// Services Data
const services = [
  {
    title: "Pay on Credit",
    description: "Pay your rent using Credit Card",
    icon: <CreditCard size={40} color="#6b46c1" />,
    link: "/comming",
  },
  {
    title: "Housing Premium",
    description: "Instant access to zero brokerage properties",
    icon: <Diamond size={40} color="#6b46c1" />,
    link: "/comming",
  },
  {
    title: "Home Loans",
    description: "Lowest Interest rate offers",
    icon: <HomeIcon size={40} color="#6b46c1" />,
    link: "/comming",
  },
  {
    title: "Rent Receipt Generator",
    description: "Protection against cyber frauds",
    icon: <Receipt size={40} color="#6b46c1" />,
    link: "/receipted",
  },
];

// Features Data
const features = [
  {
    icon: <Wrench size={50} color="#6b46c1" />,
    title: "Best-in-class products and services",
    description: "We provide top-quality rental services with zero brokerage.",
  },
  {
    icon: <Award size={50} color="#6b46c1" />,
    title: "The most rewarding way to get anything done",
    description: "Find your dream home quickly with our AI-powered search.",
  },
  {
    icon: <Headphones size={50} color="#6b46c1" />,
    title: "Hassle-free experience and great customer support",
    description: "Enjoy a seamless renting process with our 24/7 support.",
  },
];

function Home() {
  return (
    <div className="w-full h-auto">
      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center bg-cover bg-center text-center text-white h-[90vh]"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <h1 className="text-3xl md:text-5xl font-bold">Find Your Perfect Home</h1>
        <p className="mt-4 text-base md:text-lg">Rent hassle-free homes across the city.</p>
          {/* Search Bar */}
  <div className="mt-6 bg-white text-black px-4 py-2 rounded-full shadow-md flex items-center w-full max-w-md">
    <Search size={20} className="mr-2 text-gray-500" />
    <input
      type="text"
      placeholder="Search for properties..."
      className="outline-none bg-transparent w-full"
    />
  </div>
      </div>

      

      {/* Services Section */}
      <section className="py-12 px-4 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-6">Housing Edge</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {services.map(({ title, description, icon, link }, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center shadow-blue-500"
            >
              <div className="mb-4">{icon}</div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-gray-600 mt-2">{description}</p>
              <Link to={link} className="text-blue-500 hover:underline mt-2">
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Housing Edge */}
      <motion.section className="py-12 px-4 sm:px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Why Choose Housing Edge
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map(({ icon, title, description }, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center shadow-blue-700"
            >
              <div className="mb-4">{icon}</div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-gray-600 mt-2">{description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Image Slider */}
      <div className="w-full h-auto rounded-lg overflow-hidden shadow-lg">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          effect="fade"
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full h-auto"
        >
          {[one, second].map((image, index) => (
            <SwiperSlide key={index}>
              <motion.img
                src={image}
                alt="Home Banner"
                className="w-full h-full object-contain rounded-lg"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Footer />
    </div>
  );
}

export default Home;