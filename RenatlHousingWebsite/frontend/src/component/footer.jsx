import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import comming from "../component/commingsonn.jsx"

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
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white pt-10 pb-6 h-[60vh]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-3">About RentEase</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                RentEase serves thousands of users daily with verified listings,
                offering home loans, interiors, and expert property advice.
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold">Download Our App</h2>
              <div className="flex gap-4">
                
                <a href="/comming"className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80" >   Get it on Google Play</a>

                <a href="/comming"className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80" > Download on the App Store</a>
              </div>

              <div className="flex gap-4 mt-5">
                <a
                  href="https://www.instagram.com/v_i_n_e_e_t_9630?igsh=MXR3cTFnMWllMXh0Yg=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-pink-600 px-4 py-2 rounded-lg hover:bg-pink-500 transition "
                >
                  <FaInstagram size={20} /> Instagram
                </a>
                <a
                  href="https://wa.me/6267109834"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500 transition"
                >
                  <FaWhatsapp size={20} /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-4 flex flex-wrap justify-between text-sm text-gray-400">
            <div className="flex flex-wrap gap-4">
              <a href="/comming" className="hover:text-white">Sitemap</a>
              <a href="/comming" className="hover:text-white">Privacy Policy</a>
              <a href="/comming" className="hover:text-white">Terms & Conditions</a>
              <a href="/comming" className="hover:text-white">Careers</a>
            </div>
            <p className="text-gray-500 text-xs mt-4 md:mt-0">
              &copy; {new Date().getFullYear()} RentEase Rentals Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;