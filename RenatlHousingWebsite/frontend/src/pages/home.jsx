import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../component/footer.jsx";
import SearchBar from "../pages/search.jsx";
import housingbanner from "../assets/bn.jpg";
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
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

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

// Services Data
const services = [
  {
    title: "Pay on Credit",
    description: "Pay your rent using Credit Card",
    icon: <CreditCard size={40} className="text-purple-600" />,
    link: "/comming",
  },
  {
    title: "Housing Premium",
    description: "Instant access to zero brokerage properties",
    icon: <Diamond size={40} className="text-purple-600" />,
    link: "/comming",
  },
  {
    title: "Rent Receipt Generator",
    description: "Generate legal rent receipts effortlessly",
    icon: <Receipt size={40} className="text-purple-600" />,
    link: "/receipted",
  },
];

// Features Data
const features = [
  {
    icon: <Wrench size={50} className="text-purple-600" />,
    title: "Best-in-class Products & Services",
    description: "We offer top-quality rental services with zero brokerage for a seamless experience.",
  },
  {
    icon: <Award size={50} className="text-purple-600" />,
    title: "Rewarding Way to Find Home",
    description: "Discover your ideal rental property swiftly with our intuitive and powerful search tools.",
  },
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
    quote: "RentEase made finding my dream apartment incredibly easy. The filters are precise, and connecting with owners was a breeze. Highly recommended!",
    name: "John Doe",
    role: "Tenant in Mumbai",
  },
  {
    quote: "As a property owner, I've never had such an easy time finding quality tenants. The platform is intuitive and saves me so much time.",
    name: "Sarah Johnson",
    role: "Property Owner in Delhi",
  },
  {
    quote: "The zero brokerage model is a game changer. I saved over ₹50,000 in fees compared to traditional brokers. Will never go back!",
    name: "Rahul Sharma",
    role: "Tenant in Bangalore",
  },
  {
    quote: "The rent receipt generator alone is worth using the platform. It's saved me hours of paperwork every year.",
    name: "Priya Patel",
    role: "Tenant in Hyderabad",
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
        const res = await axios.get("http://localhost:5000/api/properties");
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

  return (
    <div className="w-full min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] lg:min-h-[95vh] text-center text-white px-4 sm:px-6 lg:px-8 overflow-hidden py-20 sm:py-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${housingbanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              Discover Your Ideal <span className="text-purple-300">Home</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white/90 max-w-3xl mx-auto px-2">
              Find the perfect rental property with zero brokerage fees
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
            className="w-full max-w-4xl mx-auto"
          >
            <SearchBar />
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="animate-bounce w-6 h-6 sm:w-8 sm:h-8 border-4 border-white rounded-full"></div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-3xl mx-auto">
              Simple steps to finding your next rental home or listing your property.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          >
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xl mr-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                </div>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">
              Featured Properties
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore hand-picked properties in top localities, updated daily.
            </motion.p>
          </motion.div>

          {properties.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 text-xl"
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
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-full flex flex-col"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={getMediaUrl(property.images?.[0]) || "https://via.placeholder.com/400x300?text=No+Image"}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h3 className="text-xl font-bold text-white line-clamp-1">{property.title}</h3>
                          <p className="text-white/90 text-sm"><HomeIcon size={14} className="inline mr-1" /> {property.city}, {property.state}</p>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-purple-700 font-bold text-2xl">₹{property.monthlyRent?.toLocaleString()}/mo</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-4">
                          {property.bhkType && <span className="bg-gray-100 rounded-full px-3 py-1">{property.bhkType}</span>}
                          {property.furnishType && <span className="bg-gray-100 rounded-full px-3 py-1">{property.furnishType}</span>}
                          {property.propertyType && <span className="bg-gray-100 rounded-full px-3 py-1">{property.propertyType}</span>}
                        </div>
                        <button
                          onClick={() => navigate(`/property/${property._id}`)}
                          className="mt-auto w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-all duration-300 font-medium flex items-center justify-center"
                        >
                          View Details
                          <ChevronRight size={18} className="ml-1" />
                        </button>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="flex justify-between items-center mt-8">
                <div className="property-pagination flex justify-center gap-2"></div>
                <div className="flex gap-4">
                  <button className="property-swiper-prev w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors">
                    <ChevronLeft size={24} />
                  </button>
                  <button className="property-swiper-next w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors">
                    <ChevronRight size={24} />
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
              className="inline-flex items-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse All Properties
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">
              Why Choose RentEase?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are committed to providing the best rental experience for everyone.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gray-50 p-8 rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-lg mr-6">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-purple-800 text-white">
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
            <motion.p variants={itemVariants} className="text-lg text-purple-200 max-w-3xl mx-auto">
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
                    <div className="text-purple-300">{testimonial.role}</div>
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
          <motion.p variants={itemVariants} className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied renters who found their ideal home with RentEase.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link
              to="/properties"
              className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
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