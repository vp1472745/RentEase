import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../component/footer.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../pages/search.jsx";
import housingbanner from "../assets/bn.jpg"
import hotel from "../assets/hotel.jpg"
import Hp from "../component/horizontalproperty.jsx"
import { useLocation } from "react-router-dom";

import {
  CreditCard,
  Diamond,
  Home as HomeIcon,
  Receipt,
  Wrench,
  Award,
  Headphones,
  Lightbulb,
  DollarSign,
  CheckCircle,
  Users,
  Key,
  List,
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import heroBackground from "../assets/hotel.jpg"; // Assuming you have a good hero image
import howItWorks1 from "../assets/hotel.jpg"; // Placeholder images for how it works
import howItWorks2 from "../assets/hotel.jpg";
import howItWorks3 from "../assets/hotel.jpg";

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
    image: howItWorks1,
    title: "1. Find Your Perfect Home with Ease ",
    description: "Use our advanced filters and intelligent search to discover rental properties that fit your lifestyle, budget, and location – all in one place.",
  },
  {
    image: howItWorks2,
    title: "2. Connect with Owners",
    description: "Directly contact property owners without any brokerage fees.",
  },
  {
    image: howItWorks3,
    title: "3. Move In & Settle",
    description: "Finalize your agreement and move into your new home with ease.",
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

  // Removed the problematic window.location.reload() useEffect

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center h-[70vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh] text-center text-white px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${housingbanner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-2xl lg:text-7xl font-extrabold text-white mb-4 drop-shadow-lg"
          >
            <p className="text"> Discover Your Ideal Room or Home for Rent</p>
          </motion.h1>
          {/* <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-2 text-lg sm:text-xl md:text-2xl font-medium text-white mb-8 drop-shadow-md"
          >
            Rent hassle-free homes across major cities. Find the perfect place, effortlessly.
          </motion.p> */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-4xl mx-auto"
          >
            <SearchBar />
          </motion.div>
        </div>
      </div>

      {/* Housing Edge Section (Services) */}
      {/* <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white shadow-lg rounded-lg mt-20 relative ">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-purple-800 text-center mb-4">
          RentEase Edge
        </h2>
        <p className="text-center text-gray-600 mb-10 text-base sm:text-lg md:text-xl">
          Unlock a superior rental experience with our unique offerings.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map(({ title, description, icon, link }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-purple-200 rounded-xl p-6 md:p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:border-purple-400 cursor-pointer"
              onClick={() => navigate(link)}
            >
              <div className="mb-4">{icon}</div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600 mt-2 text-base md:text-lg">{description}</p>
              <Link to={link} className="text-purple-600 hover:text-purple-800 font-semibold mt-4 text-base md:text-lg flex items-center">
                Learn More <span className="ml-1 text-purple-600">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* How It Works Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-purple-800 text-center mb-4">
          How RentEase Works
        </h2>
        <p className="text-center text-gray-600 mb-12 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
          Simple steps to finding your next rental home or listing your property.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto">
          {howItWorksSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-gray-200"
            >
              <img src={step.image} alt={step.title} className="w-32 h-32 object-contain mb-6" />
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-balance  md:text-lg">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Featured Properties Section (using Swiper) */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-purple-800 mb-6 md:mb-8 text-center">
          Featured Properties
        </h2>
        <p className="text-center text-gray-600 mb-12 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
          Explore hand-picked properties in top localities, updated daily.
        </p>
        {properties.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">No featured properties available at the moment. Check back soon!</p>
        ) : (
          <div className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Swiper
              modules={[Pagination, Navigation, Autoplay]}
              slidesPerView={1}
              spaceBetween={20}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 30 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
              }}
              className="w-full pb-12"
            >
              {properties.slice(0, 9).map((property) => ( // Limiting to 9 for featured
                <SwiperSlide key={property._id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100 h-full flex flex-col"
                  >
                    <img
                      src={getMediaUrl(property.images?.[0]) || "https://via.placeholder.com/400x300?text=No+Image"}
                      alt={property.title}
                      className="h-56 sm:h-64 w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
                      }}
                    />
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 line-clamp-1">{property.title}</h3>
                      <p className="text-gray-600 text-base md:text-lg mb-3 line-clamp-2"><HomeIcon size={16} className="inline-block mr-1 text-purple-600" /> {property.city}, {property.state}</p>
                      <p className="text-purple-700 font-extrabold text-2xl mb-3">₹{property.monthlyRent?.toLocaleString()}/month</p>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-4">
                        {property.bhkType && <span className="bg-gray-100 rounded-full px-3 py-1">{Array.isArray(property.bhkType) ? property.bhkType.join(", ") : property.bhkType}</span>}
                        {property.furnishType && <span className="bg-gray-100 rounded-full px-3 py-1">{Array.isArray(property.furnishType) ? property.furnishType.join(", ") : property.furnishType}</span>}
                        {property.propertyType && <span className="bg-gray-100 rounded-full px-3 py-1">{Array.isArray(property.propertyType) ? property.propertyType.join(", ") : property.propertyType}</span>}
                      </div>
                      <button
                        onClick={() => navigate(`/property/${property._id}`)}
                        className="mt-auto w-full bg-purple-700 text-white py-3 rounded-lg hover:bg-purple-800 transition-colors duration-300 text-base font-semibold"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Custom Navigation Buttons (Optional, if default nav isn't enough) */}
            <div className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-md cursor-pointer z-10 hidden md:block"></div>
            <div className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-md cursor-pointer z-10 hidden md:block"></div>
          </div>
        )}
        <div className="text-center mt-12">
          <Link 
            to="/properties" 
            className="inline-block bg-purple-800 text-white font-semibold py-3 px-8 rounded-full hover:bg-purple-900 transition-colors duration-300 text-lg shadow-lg"
          >
            View All Properties
          </Link>
        </div>
      </section>

      {/* Why Use RentEase Section (Features) */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-100">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-purple-800 mb-6 md:mb-8">
          Why Choose RentEase?
        </h2>
        <p className="text-center text-gray-600 mb-12 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
          We are committed to providing the best rental experience for everyone.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto">
          {features.map(({ icon, title, description }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center text-center border border-gray-100 transition-all duration-300 hover:shadow-xl"
            >
              <div className="mb-5">{icon}</div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">{title}</h3>
              <p className="text-gray-600 text-base md:text-lg">{description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action: List Your Property */}
      <section className="py-16 md:py-24 bg-purple-800 text-white text-center px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
        >
          Have a Property to List?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto"
        >
          Join RentEase today and connect with thousands of potential tenants effortlessly. List your property for free!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <Link 
            to="/add-property" 
            className="inline-block bg-white text-purple-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors duration-300 text-lg shadow-lg"
          >
            List Your Property Now
          </Link>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-purple-800 mb-6 md:mb-8">
          What Our Users Say
        </h2>
        <p className="text-center text-gray-600 mb-12 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
          Hear from our satisfied tenants and property owners.
        </p>
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          spaceBetween={30}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 30 },
            768: { slidesPerView: 2, spaceBetween: 40 },
            1024: { slidesPerView: 3, spaceBetween: 50 },
          }}
          className="max-w-7xl mx-auto pb-12"
        >
          {[1, 2, 3, 4, 5].map((item, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center flex flex-col h-full"
              >
                <p className="text-gray-700 text-lg mb-6 flex-grow">
                  "RentEase made finding my dream apartment incredibly easy. The filters are precise, and connecting with owners was a breeze. Highly recommended!"
                </p>
                <div className="mt-auto">
                  <div className="font-bold text-purple-800 text-xl">John Doe {item}</div>
                  <div className="text-gray-500 text-sm">Tenant in Mumbai</div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;