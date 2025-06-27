import { useState } from "react";
import { 
  FiChevronLeft, FiChevronRight, FiMapPin, FiX, FiShare2, FiHeart 
} from "react-icons/fi";
import { FaBed, FaBath, FaRulerCombined, FaCouch } from "react-icons/fa";

export default function PropertyCard({ property = {} }) {
  const {
    images = [],
    propertyType = "N/A",
    bhkType = "N/A",
    monthlyRent = 0,
    address = "N/A",
    city = "N/A",
    area = "N/A",
    furnishType = "N/A",
    ownerName = "Owner",
    ownerphone
  } = property;

  const [currentImage, setCurrentImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const openGallery = (e) => {
    e.stopPropagation();
    setIsGalleryOpen(true);
  };

  const closeGallery = (e) => {
    e.stopPropagation();
    setIsGalleryOpen(false);
  };

  if (images.length === 0) return null; // Don't render if no images

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden w-full max-w-4xl mx-auto my-8 flex flex-col md:flex-row">
        {/* Image Slider */}
        <div className="relative w-full md:w-2/5 cursor-pointer" onClick={openGallery}>
          <img
            src={images[currentImage]}
            alt={`${bhkType} ${propertyType}`}
            className="w-full h-64 md:h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          {images.length > 1 && (
            <>
              <button
                className="absolute top-1/2 left-3 transform -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition"
                onClick={prevImage}
              >
                <FiChevronLeft size={20}/>
              </button>
              <button
                className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2 bg-black/40 text-white rounded-full hover:bg-black/60 transition"
                onClick={nextImage}
              >
                <FiChevronRight size={20}/>
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="font-bold text-2xl">₹{monthlyRent.toLocaleString()}<span className="text-base font-normal">/month</span></h3>
            <p className="text-sm opacity-90">{bhkType} {propertyType}</p>
          </div>

          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-white/90 rounded-full text-gray-700 hover:scale-110 transition-transform"><FiShare2 /></button>
            <button className="p-2 bg-white/90 rounded-full text-red-500 hover:scale-110 transition-transform"><FiHeart /></button>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6 flex flex-col justify-between w-full md:w-3/5">
          <div>
            <div className="flex items-center text-gray-500 text-sm mb-4">
              <FiMapPin className="mr-2 text-purple-600" />
              {address}, {city}
            </div>
            
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-gray-700 mb-6">
              <div className="flex items-center"><FaBed className="mr-3 text-purple-500" /><span>{bhkType} Bedrooms</span></div>
              <div className="flex items-center"><FaBath className="mr-3 text-purple-500" /><span>2 Bathrooms</span></div>
              <div className="flex items-center"><FaRulerCombined className="mr-3 text-purple-500" /><span>{area} sq.ft</span></div>
              <div className="flex items-center"><FaCouch className="mr-3 text-purple-500" /><span>{furnishType}</span></div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              A beautifully designed {bhkType} {propertyType} available for rent in a prime location. Comes with modern amenities and is perfect for families or professionals seeking comfort and convenience.
            </p>
          </div>

          {/* Owner Info & CTA */}
          <div className="flex items-center border-t pt-4">
             <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${ownerName}`} alt="Owner" className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="ml-4">
              <p className="font-bold text-gray-800">{ownerName}</p>
              <p className="text-gray-500 text-sm">Property Owner</p>
            </div>
            <a 
              href={`tel:${ownerphone}`}
              className="ml-auto bg-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Full-Screen Image Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50" onClick={closeGallery}>
          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentImage]}
              className="max-w-full max-h-full object-contain rounded-lg"
              alt="Full screen property view"
            />
            <button
              className="absolute top-5 right-5 text-white text-3xl hover:opacity-80 transition"
              onClick={closeGallery}
            >
              <FiX />
            </button>
             {images.length > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-3 md:left-5 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                  onClick={prevImage}
                >
                  <FiChevronLeft size={24}/>
                </button>
                <button
                  className="absolute top-1/2 right-3 md:right-5 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
                  onClick={nextImage}
                >
                  <FiChevronRight size={24}/>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
