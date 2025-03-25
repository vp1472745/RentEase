import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function PropertyCard({ property = {} }) {
  const images = property.images || []; // Ensure images array exists
  const [currentImage, setCurrentImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  if (images.length === 0) return <p>No Images Available</p>;

  return (
    <div className="border rounded-lg shadow-md overflow-hidden w-full max-w-2xl">
      {/* Image Slider */}
      <div className="relative w-full h-48 bg-gray-200">
        <img
          src={images[currentImage]}
          alt="Property"
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
        <button
          className="absolute top-1/2 left-2 p-2 bg-black text-white rounded-full"
          onClick={prevImage}
        >
          <FaChevronLeft />
        </button>
        <button
          className="absolute top-1/2 right-2 p-2 bg-black text-white rounded-full"
          onClick={nextImage}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h2 className="text-lg font-bold">{property.title}</h2>
        <p className="text-gray-600">₹{property.price} / month</p>
        <p className="text-gray-500">
          {property.size} sq.ft | {property.furnishing}
        </p>
        <p className="text-gray-500">Amenities: {property.amenities}</p>

        {/* Owner Info */}
        <div className="flex items-center mt-4">
          <div className="bg-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold">
            {property.owner ? property.owner[0] : "?"}
          </div>
          <div className="ml-3">
            <p className="font-semibold">{property.owner || "Unknown"}</p>
            <p className="text-gray-500 text-sm">Owner</p>
          </div>
          <button className="ml-auto bg-purple-600 text-white px-4 py-2 rounded-lg">
            Contact
          </button>
        </div>
      </div>

      {/* Full-Screen Image Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <img
              src={images[currentImage]}
              className="max-w-full max-h-screen"
              alt="Full View"
            />
            <button
              className="absolute top-4 right-4 text-white text-xl"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
