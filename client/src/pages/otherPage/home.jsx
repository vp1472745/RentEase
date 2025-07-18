import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../lib/axios.js";
import Footer from "../../component/footerPage/footer.jsx";
import SearchBar from "../../pages/search/search.jsx";
import housingbanner from "../../assets/hero.jpg";
import { useLocation } from "react-router-dom";
import {
  CreditCard,
  Diamond,
  Home as HomeIcon,
  Receipt,
  Wrench,
  Award,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  Search,
  MessageCircle,
  CheckCircle,
  ListPlus,
  Users,
  Edit3,
  MapPin,
  BedDouble,
  Square,
  Star,
  Calendar,
  ShieldCheck
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

// Color constants for consistent theming
const COLORS = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.18,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

// Services Data
const services = [
  {
    title: "Pay on Credit",
    description: "Pay your rent using Credit Card",
    icon: <CreditCard size={40} className="text-indigo-600" />,
    link: "/comming",
  },
  {
    title: "Housing Premium",
    description: "Instant access to zero brokerage properties",
    icon: <Diamond size={40} className="text-indigo-600" />,
    link: "/comming",
  },
  {
    title: "Rent Receipt Generator",
    description: "Generate legal rent receipts effortlessly",
    icon: <Receipt size={40} className="text-indigo-600" />,
    link: "/receipted",
  },
];

// Features Data
const features = [
  {
    icon: <ShieldCheck size={50} className="text-indigo-600" />,
    title: "Verified Listings",
    description: "Every property is personally verified by our team to ensure authenticity and quality.",
  },
  {
    icon: <Wrench size={50} className="text-indigo-600" />,
    title: "Maintenance Support",
    description: "24/7 maintenance support for all your rental needs after you move in.",
  },
  {
    icon: <Calendar size={50} className="text-indigo-600" />,
    title: "Direct Owner Connect",
    description: "No brokers, no middlemen—connect directly with property owners..",
  },
  // {
  //   icon: <Star size={50} className="text-indigo-600" />,
  //   title: "Premium Properties",
  //   description: "Exclusive access to high-end properties with premium amenities.",
  // },
];

// How It Works Data
const howItWorksSteps = [
  {
    title: "1. Find Your Perfect Home with Ease",
    description: "Use our advanced filters and intelligent search to discover rental properties that fit your lifestyle, budget, and location – all in one place.",
  },
  {
    title: "2. Connect with Owners",
    description: "Directly contact property owners without any brokerage fees.",
  },
  {
    title: "3. Move In & Settle",
    description: "Finalize your agreement and move into your new home with ease.",
  },
];

// Testimonials Data
const testimonials = [
  {
    quote: "Roommilega made finding my dream apartment incredibly easy. The filters are precise, and connecting with owners was a breeze. Highly recommended!",
    name: "Yugant NATH",
    role: "Tenant in Mumbai",
    rating: 5
  },
  {
    quote: "As a property owner, I've never had such an easy time finding quality tenants. The platform is intuitive and saves me so much time.",
    name: "Sneha",
    role: "Property Owner in Delhi",
    rating: 4
  },
  {
    quote: "The zero brokerage model is a game changer. I saved over ₹50,000 in fees compared to traditional brokers. Will never go back!",
    name: "Vicky Sharma",
    role: "Tenant in Bangalore",
    rating: 5
  },
  {
    quote: "The rent receipt generator alone is worth using the platform. It's saved me hours of paperwork every year.",
    name: "Priya Patel",
    role: "Tenant in Hyderabad",
    rating: 5
  },
];

// Helper function to get media URL
const getMediaUrl = (mediaItem) => {
  if (!mediaItem) return null;
  if (typeof mediaItem === 'string') return mediaItem;
  if (mediaItem.url) return mediaItem.url;
  return null;
};

function Home() {
  const [properties, setProperties] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("/api/properties");
        setProperties(res.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Render star ratings
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] lg:min-h-[95vh] text-center text-white px-4 sm:px-6 lg:px-8 overflow-hidden py-20 sm:py-0"
        style={{
          backgroundImage: `linear-gradient(rgba(2, 132, 199, 0.85), rgba(7, 89, 133, 0.9)), url(${housingbanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 mt-25 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white text-center leading-tight">
              Discover Your <span className="text-indigo-200">Perfect</span> Rental
            </h1>
          </motion.div>
          
          <div className="flex justify-center w-full">
            <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-indigo-100 text-center font-medium max-w-2xl">
              Find your dream home with zero brokerage fees and premium services
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="w-full max-w-4xl mx-auto mt-8"
          >
            <SearchBar />
          </motion.div>
          
          {/* Main CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-8 flex flex-col sm:flex-row gap-15 mb-5"
          >
            <Link
              to="/properties"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
            >
              Browse Properties
              <ChevronRight size={22} className="ml-2" />
            </Link>
            <Link
              to="/add-property"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-700 font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg border-2 border-white hover:border-indigo-200"
            >
              List Your Property
              <ChevronRight size={22} className="ml-2" />
            </Link>
          </motion.div>
        </div>
        
        {/* Animated scroll indicator */}
        <motion.div 
          className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-sm text-indigo-100 mb-1">Explore More</span>
            <div className="w-6 h-10 border-4 border-indigo-200 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 bg-indigo-200 rounded-full mt-1"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      {/* <section className="py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={itemVariants}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <div className="text-4xl font-bold text-indigo-600 mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Properties Listed</div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={itemVariants}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <div className="text-4xl font-bold text-indigo-600 mb-2">25K+</div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={itemVariants}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Cities Covered</div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={itemVariants}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50"
            >
              <div className="text-4xl font-bold text-indigo-600 mb-2">₹5Cr+</div>
              <div className="text-gray-600 font-medium">Saved in Brokerage</div>
            </motion.div>
          </div>
        </div>
      </section>  */}

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-blue-800 mb-3">
              How It Works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-blue-600 max-w-3xl mx-auto">
              Whether you're searching for your next rental home or looking to list your property, 
              Roommilega makes the process simple and seamless for both tenants and owners.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Tenant Steps */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full transition-all duration-300 group hover:shadow-xl hover:-translate-y-2"
            >
              <motion.h3
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-2xl font-bold text-blue-800 mb-8 text-center flex items-center justify-center gap-3 tracking-tight"
              >
                <span className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 shadow-sm">
                  <Users size={28} />
                </span>
                For Tenants
              </motion.h3>
              <motion.ol
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-7"
              >
                {[{
                  icon: <UserPlus size={22} />, 
                  label: 'Sign Up or Log In', 
                  desc: 'Create your free tenant account on Roommilega, or log in to your existing one to begin your rental journey.'
                }, {
                  icon: <Search size={22} />, 
                  label: 'Search for Properties', 
                  desc: 'Search for properties based on your preferences—filter by location, budget, property type, amenities and more.'
                }, {
                  icon: <MessageCircle size={22} />, 
                  label: 'Contact Owners', 
                  desc: 'Get in touch with property owners directly, without any middlemen. Schedule property visits, ask questions & clarify rental terms—all directly.'
                }, {
                  icon: <CheckCircle size={22} />, 
                  label: 'Secure Your Home', 
                  desc: "Once you've found your ideal home, finalize the deal securely and move in with peace of mind."
                }].map((step, i) => (
                  <motion.li
                    key={i}
                    custom={i}
                    variants={stepVariants}
                    className="flex items-start gap-4"
                  >
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 font-bold text-xl shadow-sm border-2 border-white">
                      {step.icon}
                    </span>
                    <div>
                      <span className="block font-semibold text-lg text-blue-800 mb-1">{step.label}</span>
                      <span className="text-gray-600 text-base">{step.desc}</span>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </motion.div>

            {/* Owner Steps */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full transition-all duration-300 group hover:shadow-xl hover:-translate-y-2"
            >
              <motion.h3
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-2xl font-bold text-blue-800 mb-8 text-center flex items-center justify-center gap-3 tracking-tight"
              >
                <span className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 shadow-sm">
                  <HomeIcon size={28} />
                </span>
                For Owners
              </motion.h3>
              <motion.ol
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="space-y-7"
              >
                {[{
                  icon: <UserPlus size={22} />, 
                  label: 'Sign Up or Log In', 
                  desc: 'Register as a property owner through the "List My Property" option or log in to your existing account to manage your listings.'
                }, {
                  icon: <ListPlus size={22} />, 
                  label: 'List Your Property', 
                  desc: 'Fill out a simple form with property details, photos, rent and availability to make your listing live.'
                }, {
                  icon: <Users size={22} />, 
                  label: 'Connect with Tenants', 
                  desc: 'Get direct inquiries from verified tenants. Chat, schedule visits and finalize deals—all without any middlemen.'
                }, {
                  icon: <Edit3 size={22} />, 
                  label: 'Manage Your Listing', 
                  desc: 'Easily update, edit and remove your property anytime from your personalized owner dashboard.'
                }].map((step, i) => (
                  <motion.li
                    key={i}
                    custom={i}
                    variants={stepVariants}
                    className="flex items-start gap-4"
                  >
                    <span className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 font-bold text-xl shadow-sm border-2 border-white">
                      {step.icon}
                    </span>
                    <div>
                      <span className="block font-semibold text-lg text-blue-800 mb-1">{step.label}</span>
                      <span className="text-gray-600 text-base">{step.desc}</span>
                    </div>
                  </motion.li>
                ))}
              </motion.ol>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-blue-800 mb-3">
              Featured Properties
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-blue-600 max-w-3xl mx-auto">
              Explore & hand-picked properties in top localities, updated daily.
            </motion.p>
          </motion.div>

          {properties.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-blue-500 text-xl py-12"
            >
              No featured properties available at the moment. Check back soon!
            </motion.p>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                slidesPerView={1}
                spaceBetween={30}
                navigation={{
                  nextEl: '.property-swiper-next',
                  prevEl: '.property-swiper-prev',
                }}
                pagination={{ 
                  clickable: true,
                  el: '.property-pagination',
                  type: 'bullets',
                }}
                autoplay={{ 
                  delay: 5000, 
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="relative"
              >
                {properties.slice(0, 9).map((property) => (
                  <SwiperSlide key={property._id}>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -8 }}
                      className="relative bg-white rounded-xl shadow-md border border-gray-100 h-full flex flex-col transition-all duration-300 group overflow-hidden"
                    >
                      {/* Featured Badge */}
                      {property.isFeatured && (
                        <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md uppercase tracking-wide">
                          Featured
                        </span>
                      )}
                      
                      <div className="relative h-60 overflow-hidden rounded-t-xl">
                        <img
                          src={getMediaUrl(property.images?.[0]) || "https://via.placeholder.com/400x300?text=No+Image"}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h3 className="text-lg font-bold text-white truncate mb-1">{property.title}</h3>
                          <p className="text-white/90 text-sm flex items-center gap-1">
                            <MapPin size={14} className="inline" /> 
                            {property.locality}, {property.city}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-blue-700 font-extrabold text-xl">
                            ₹{property.monthlyRent?.toLocaleString()}/mo
                          </span>
                          <div className="flex items-center gap-1">
                            {renderStars(property.rating || 4)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          {property.bedrooms && (
                            <span className="flex items-center gap-1">
                              <BedDouble size={16} className="text-blue-600" />
                              {property.bedrooms} Beds
                            </span>
                          )}
                          {property.area && (
                            <span className="flex items-center gap-1">
                              <Square size={16} className="text-blue-600" />
                              {property.area} sq.ft
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 text-xs mb-4">
                          {property.bhkType && (
                            <span className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 font-medium">
                              {property.bhkType}
                            </span>
                          )}
                          {property.furnishType && (
                            <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 font-medium">
                              {property.furnishType}
                            </span>
                          )}
                          {property.propertyType && (
                            <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 font-medium">
                              {property.propertyType}
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={() => navigate(`/property/${property._id}`)}
                          className="mt-auto w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-sm transition-all duration-300 flex items-center justify-center hover:shadow-md group-hover:scale-[1.02]"
                        >
                          View Details
                          <ChevronRight size={18} className="ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="flex justify-between items-center mt-10">
                <div className="property-pagination flex justify-center gap-2"></div>
                <div className="flex gap-3">
                  <button className="property-swiper-prev w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors border border-gray-200">
                    <ChevronLeft size={20} />
                  </button>
                  <button className="property-swiper-next w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors border border-gray-200">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-16"
          >
            <Link 
              to="/properties" 
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
            >
              Browse All Properties
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-blue-800 mb-3">
              Why Choose Roommilega?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-blue-600 max-w-3xl mx-auto">
              We are committed to providing the best rental experience for everyone.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md flex flex-col items-center text-center"
              >
                <div className="mb-5 p-4 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600">
                  {React.cloneElement(feature.icon, { size: 40 })}
                </div>
                <h3 className="text-xl font-semibold text-blue-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4">
              What Our Users Say
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-blue-200 max-w-3xl mx-auto">
              Hear from our satisfied tenants and property owners.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative h-64"
          >
            <AnimatePresence mode="wait">
              {testimonials.map((testimonial, index) => (
                activeTestimonial === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16"
                  >
                    <div className="text-2xl md:text-3xl font-light italic mb-8">
                      "{testimonial.quote}"
                    </div>
                    <div className="font-bold text-xl">{testimonial.name}</div>
                    <div className="text-blue-300">{testimonial.role}</div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all ${activeTestimonial === index ? 'bg-white w-6' : 'bg-white/30'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Home?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-blue-300 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied renters who found their ideal home with Roommilega.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              to="/properties"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-lg group"
            >
              Browse Properties Now
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;