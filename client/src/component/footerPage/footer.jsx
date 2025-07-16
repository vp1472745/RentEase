import { FaInstagram, FaWhatsapp, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8 border-t border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12">
          {/* Brand Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-start space-y-4"
          >
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                RoomMilega
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your premium destination for hassle-free rentals. Experience verified listings, zero brokerage, and exceptional service.
            </p>
            <div className="flex space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-xs font-bold">100%</span>
              </div>
              <div>
                <p className="text-xs text-gray-400">Verified</p>
                <p className="text-sm font-medium">Properties</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r from-indigo-400 to-purple-500">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Properties", href: "/properties" },
                { name: "About Us", href: "/About-Us" },
                // { name: "Contact", href: "/contact" }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.href} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r from-indigo-400 to-purple-500">
              Contact Us
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start">
                <div className="bg-indigo-500/10 p-1.5 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <a href="mailto:roommilega1611@gmail.com" className="hover:text-white transition-colors">
                  roommilega1611@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-500/10 p-1.5 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <a href="tel:+916268923703" className="hover:text-white transition-colors">
                  +91 6268923703
                </a>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-500/10 p-1.5 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <span>Junnardeo, Madhya Pradesh, India</span>
              </li>
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 text-white relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-gradient-to-r from-indigo-400 to-purple-500">
              Connect With Us
            </h3>
            <div className="grid grid-cols-4 gap-3 max-w-xs">
              <a 
                href="https://www.instagram.com/v_i_n_e_e_t_9630?igsh=MXR3cTFnMWllMXh0Yg==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-pink-600 to-purple-600 p-3 rounded-lg flex items-center justify-center hover:from-pink-500 hover:to-purple-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="https://wa.me/6268923703" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-lg flex items-center justify-center hover:from-green-500 hover:to-emerald-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/vineet-pancheshwar-2b152126b/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-blue-700 to-blue-800 p-3 rounded-lg flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-gray-700 to-gray-800 p-3 rounded-lg flex items-center justify-center hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
            </div>
            
            {/* <div className="mt-8 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
              <h4 className="text-sm font-medium text-white mb-2">Subscribe to Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-700 text-white text-sm px-3 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-purple-500 w-full"
                />
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all">
                  Join
                </button>
              </div>
            </div> */}
          </motion.div>
        </div>

        {/* Copyright */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800 text-sm"
        >
          <div className="text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} RoomMilega. All rights reserved.
          </div>
          <div className="flex space-x-6 mb-10">
            <a 
              href="/Privacy" 
              className="text-gray-400 hover:text-white transition-colors hover:underline"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms-and-conditions" 
              className="text-gray-400 hover:text-white transition-colors hover:underline"
            >
              Terms & Conditions
            </a>
            <a 
              href="/sitemap" 
              className="text-gray-400 hover:text-white transition-colors hover:underline"
            >
              Sitemap
            </a>
          </div>
        </motion.div> */}
      </div>
    </motion.footer>
  );
};

export default Footer;