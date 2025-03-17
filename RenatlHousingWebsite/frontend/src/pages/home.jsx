import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../component/footer.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../pages/search.jsx";

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
import "swiper/css/navigation";

import banner from "../assets/banner.gif";
import one from "../assets/homebanner.jpg";
import second from "../assets/second.jpg";

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
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="w-full h-auto">
      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center bg-cover bg-center text-center text-white h-[90vh]"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <h1 className="text-3xl md:text-5xl font-bold">Find Your Perfect Home</h1>
        <p className="mt-4 text-base md:text-lg">Rent hassle-free homes across the city.</p>
        <SearchBar />
      </div>

      {/* House Edge Section (Services) */}
      <section className="py-12 px-4 md:px-12">
        <h2 className="text-3xl font-bold">Housing Edge</h2>
        <h3 className="mb-10 text-xl font-bold text-blue-600">
          Explore property-related services
        </h3>
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

      {/* Explore Properties as a Slider */}
      <section className="py-12 px-4 md:px-12 bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore Properties</h2>
        {properties.length === 0 ? (
          <p className="text-center text-gray-500">No properties found!</p>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Pagination, Navigation]}
              slidesPerView={3}
              spaceBetween={20}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full"
            >
              {properties.map((property) => (
                <SwiperSlide key={property._id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold">{property.title}</h3>
                      <p className="text-gray-600">{property.city}, {property.state}</p>
                      <p className="text-indigo-600 font-bold mt-2">₹{property.monthlyRent}/month</p>
                      <p className="text-sm text-gray-500 mt-1">{property.bhkType.join(", ")}, {property.furnishType.join(", ")}</p>
                      <button
                        onClick={() => navigate(`/property/${property._id}`)}
                        className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </section>

      {/* Why Use Our Website */}
      <motion.div className="py-12 px-4 sm:px-6 lg:px-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Why Use Our Website?
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
      </motion.div>

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
              <motion.img src={image} alt="Home Banner" className="w-full h-full object-contain rounded-lg" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
