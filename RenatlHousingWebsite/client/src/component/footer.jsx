import { FaInstagram, FaWhatsapp, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";

const bannerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const Footer = () => {
  return (
    <>
      {/* Animated Banner Below Navbar */}
      {/* <motion.div
        className="bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 text-white text-center py-6 px-4 mb-0 ] mt-5"
        initial="hidden"
        whileInView="visible"
        variants={bannerVariants}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <motion.div
            className="text-lg font-semibold"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            🌟 Find Your Perfect Home With Ease! 🌟
          </motion.div>

          <motion.div
            className="text-sm font-medium mt-2 md:mt-0"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            🏡 Explore Thousands of Rental Listings Now!
          </motion.div>

          <motion.a
            href="/comming"
            className="bg-black text-yellow-400 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 hover:text-black transition mt-2 md:mt-0"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Get Started
          </motion.a>
        </div>
      </motion.div> */}

      {/* Footer Section */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700 pb-10">
            {/* Logo & About */}
            <div className="flex flex-col items-start">
              <h2 className="text-2xl justify-self-auto font-bold bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 text-transparent bg-clip-text transition duration-300">RoomMilega</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                RoomMilega is your trusted partner for finding and listing rental properties. Enjoy zero brokerage, verified listings, and a seamless rental experience.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/" className="hover:text-yellow-400 transition">Home</a></li>
                <li><a href="/properties" className="hover:text-yellow-400 transition">Properties</a></li>
                <li><a href="/About-Us" className="hover:text-yellow-400 transition">About Us</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>Email: <a href="mailto:roommilega1611@gmail.com" className="hover:text-yellow-400">roommilega1611@gmail.com</a></li>
                <li>Phone: <a href="tel:+911234567890" className="hover:text-yellow-400">+91 6268923703</a></li>
                <li>Address: Junnardeo, India</li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4 mt-2">
                <a href="https://www.instagram.com/v_i_n_e_e_t_9630?igsh=MXR3cTFnMWllMXh0Yg==" target="_blank" rel="noopener noreferrer" className="bg-pink-600 p-2 rounded-full hover:bg-pink-500 transition"><FaInstagram size={22} /></a>
                <a href="https://wa.me/6268923703" target="_blank" rel="noopener noreferrer" className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition"><FaWhatsapp size={22} /></a>
                {/* <a href="#" className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 transition"><FaFacebook size={22} /></a>
                <a href="#" className="bg-sky-500 p-2 rounded-full hover:bg-sky-400 transition"><FaTwitter size={22} /></a> */}
                <a href="https://www.linkedin.com/in/vineet-pancheshwar-2b152126b/" className="bg-blue-800 p-2 rounded-full hover:bg-blue-700 transition"><FaLinkedin size={22} /></a>
              </div>
            </div>
          </div>
          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-sm text-gray-400">
            <div className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} RoomMilega. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="/Privacy" className="hover:text-white">Privacy Policy</a>
              <a href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;