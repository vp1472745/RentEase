import { useState, useEffect } from "react";
import { Check, X, ChevronLeft, ChevronRight, Link } from "lucide-react";
import { RiCloseFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { CiCircleAlert } from "react-icons/ci";
import hkey from "../assets/hkey.png";
import done from "../assets/done.png";
import { TbBulb } from "react-icons/tb";
import contactl from "../assets/contact.png";
import discountoffer from "../assets/discountoffer.png";
import ReactDOM from "react-dom";
import Discount from "../pages/discounttiming";
import righta from "../assets/righta.png";
import m1 from "../assets/m1.png";
import { MdOutlineUpdate } from "react-icons/md";
import ww from "../assets/ww.png";
import m2 from "../assets/m2.png";
import { IoIosArrowUp } from "react-icons/io";
import m3 from "../assets/m3.png";
import s from "../assets/s.png";
import ss from "../assets/ss.png";
import { FaTimes } from "react-icons/fa";
import p from "../assets/p.png";
import "../css/premium.css";
import d from "../assets/dd.png";
import dd from "../assets/dd.png";
import w from "../assets/w.png";
import faq from "../assets/faq.png";
import right from "../assets/rihgt.png";
import discount from "../assets/discount.png";
import hotel from "../assets/hotel.jpg";
import feedback from "../assets/fb.png";
import check from "../assets/checkq.png";
import i1 from "../assets/i1.png";
import ddd from "../assets/DDD.png";
import su from "../assets/support.png";
import { MdOutlineSmartToy } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import c from "../assets/circle.png";
import diamond from "../assets/diamond.png";
// import discountoffer from "../pages/discountiming"
const basePlans = [
  {
    pop: <div> Instant Trial Plan</div>,
    image: <img src={check} alt="" className="w-5 h-5 border-white " />,
    image1: <img src={i1} alt="" className="w-12 h-12 border-white mb-3" />,
    name: "Sachet",
    brokerage: 5,
    iconone: <RiCloseFill size={30} className="ml-10 " />,
    icontwo: <RiCloseFill size={30} className="ml-10 " />,
    iconthree: <RiCloseFill size={30} className="ml-10  mb-5" />,
    price: { 45: 599, 90: 1099 }, // Prices for different validity
    oldPrice: { 45: 1199, 90: 2199 },
    contacts: 5,
    gst: "+18% GST",
  },
  {
    image: <img src={check} alt="" className="w-5 h-5 border-white" />,
    image1: (
      <img src={feedback} alt="" className="w-10 h-10 border-white mb-5" />
    ),
    name: "Connect",
    brokerage: 15,
    iconone: <FaCheck size={22} className="ml-10 mb-4" />,
    icontwo: <FaCheck size={22} className="ml-10  mb-5" />,
    iconthree: <RiCloseFill size={30} className="ml-10 mb-5" />,
    price: { 45: 899, 90: 1599 },
    oldPrice: { 45: 1799, 90: 3199 },
    contacts: 15,
    gst: "+18% GST",
  },
  {
    image: <img src={check} alt="" className="w-5 h-5 border-white" />,
    image1: (
      <img src={feedback} alt="" className="w-10 h-10 border-white mb-5" />
    ),

    name: "Connect+",
    brokerage: 25,
    iconone: <FaCheck size={22} className="ml-10 mb-4" />,
    icontwo: <FaCheck size={22} className="ml-10 mb-5" />,
    iconthree: <RiCloseFill size={30} className="ml-10  mb-5" />,
    price: { 45: 1199, 90: 2099 },
    oldPrice: { 45: 2599, 90: 4199 },
    contacts: 25,
    popular: true,
    gst: "+18% GST",
  },
  {
    image: <img src={check} alt="" className="w-5 h-5 border-white" />,
    image1: <img src={su} alt="" className="w-10 h-10 border-white mb-5 " />,

    name: "Relax",
    brokerage: 50,
    iconone: <FaCheck size={22} className="ml-10 mt-4" />,
    icontwo: <FaCheck size={22} className="ml-10 mb-5 " />,
    iconthree: <FaCheck size={22} className="ml-10  mb-5" />,
    price: { 45: 1749, 90: 2999 },
    oldPrice: { 45: 3499, 90: 5999 },
    contacts: 50,
    gst: "+18% GST",
  },
];

const statusImages = [m1, m2, m3];

const extraSliderItems = [
  {
    text: "RentEase launches owner connect services for home seekers; Branded as ‘Housing Premium’, the service recorded 25,000 subscribers in the pre-launch phase16 August 2022 launches owner connect services Housing Premium",
    name: "Special Deal",
  },
  {
    text: "Housing.com launches owner connect services, ‘Housing Premium’",
    name: "Limited Time",
  },
  { text: "More features, less price!", name: "Value Pack" },
  { text: "Join the premium club!", name: "Elite Access" },
];
const testimonials = [
  {
    text: "Sahibha, my Relationship Manager, has been very helpful in my flat search...",
    name: "Arjit",
    location: "New Delhi",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 5,
    rm: "Sahibha",
    plan: "😃 Relax",
  },
  {
    text: "Sahibha, my Relationship Manager, has been very helpful in my flat search...",
    name: "Arjit",
    location: "New Delhi",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 5,
    rm: "Sahibha",
    plan: "😃 Relax",
  },
  {
    text: "Amazing platform with great UI. Found my perfect rental in minutes!",
    name: "Arjit",
    location: "New Delhi",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 5,
    rm: "Sahibha",
    plan: "😃 Relax",
  },
  {
    text: "This website made my property search so easy! Highly recommended",
    name: "Arjit",
    location: "New Delhi",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 5,
    rm: "Sahibha",
    plan: "😃 Relax",
  },
  // Add more testimonials here
];
export default function PremiumSubscription() {
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [index, setIndex] = useState(0);
  const [validity, setValidity] = useState("45");
  const [selectedPlan, setSelectedPlan] = useState(basePlans[0].name);
  const [selected, setSelected] = useState(false);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState([0, 0, 0]);
  const [showPopup, setShowPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes countdown
  new Array(statusImages.length).fill(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuyClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCheckbox = () => {
    setSelected(!selected);
    setTotal(selected ? total - 199 : total + 199);

    const handleSubscribe = () => {
      if (!selectedPlan) {
        toast.error("Please select a plan first.");
        return;
      }
      setSubscribed(true);
      toast.success(`Subscribed to ${selectedPlan.name} plan successfully!`);
    };
  };

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = [...prev];
        newProgress[currentIndex] += 5;

        if (newProgress[currentIndex] >= 100) {
          newProgress[currentIndex] = 100;
          if (currentIndex < statusImages.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
          } else {
            setIsOpen(false);
          }
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen, currentIndex]);

  useEffect(() => {
    let interval;
    if (isPremiumOpen) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = [...prev];
          if (newProgress[currentIndex] < 100) {
            newProgress[currentIndex] += 5; // Progress speed
          } else {
            setCurrentIndex((prevIndex) =>
              prevIndex < statusImages.length - 1 ? prevIndex + 1 : prevIndex
            );
          }
          return newProgress;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPremiumOpen, currentIndex]);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % testimonials.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);
  const [extraIndex, setExtraIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setExtraIndex((prev) => (prev + 1) % extraSliderItems.length),
      4000
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isPremiumOpen) return;

    let interval;
    const progressSpeed = 30; // Adjust speed (lower = faster progress)
    const totalTime = 3000; // 3 seconds per image
    const steps = totalTime / progressSpeed;

    const startProgress = () => {
      let step = 0;
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = [...prev];
          newProgress[currentIndex] = (step / steps) * 100;

          if (step >= steps) {
            clearInterval(interval);
            goToNextImage();
          }

          return newProgress;
        });
        step++;
      }, progressSpeed);
    };

    startProgress();

    return () => clearInterval(interval);
  }, [currentIndex, isPremiumOpen]);

  const goToNextImage = () => {
    setCurrentIndex((prev) =>
      prev === statusImages.length - 1 ? 0 : prev + 1
    );
    resetProgress();
  };

  const goToPrevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? statusImages.length - 1 : prev - 1
    );
    resetProgress();
  };

  const resetProgress = () => {
    setProgress(new Array(statusImages.length).fill(0));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center h-15 bg-[#2a1035] rounded-br-3xl rounded-bl-3xl"
        // style={{
        //   backgroundImage: `url(${hotel})`,
        //   filter: "brightness(50%)", // Adjust opacity (alternative method)
        // }}
      ></div>

      {/* second main div */}
      <div>
        <div className="bg-[#8F87F1] h-80%  border w-100%">
            <div className="bg-[#8F87F1]  p-6 text-white flex flex-col items-center  ml-150 w-260 h-30 mt-5  ">
              <div className="flex  justify-between items-center mt-7">
                {/* Left Side - Logo */}
                <div className="flex items-center   ">
                  <img
                    src={ddd}
                    alt=""
                    className="w-10 items-center  mb-2 ml-70 text-white"
                  />
                  <div className=" text-center">
                    <h2 className="text-[12px] text-white font-bold mr-70">
                      RenatEase
                    </h2>
                    <span className="text-[19px] text-white font-bold mr-70">
                      Premium
                    </span>
                  </div>
                  <div>
                    {/* "What's Premium" Button */}
                    <div className="">
                    <div
                      className="text-white px-2 py-2 rounded-full cursor-pointer   h-8 w-37 flex items-center bg-[#2a1035] ml-10 mt-5 "
                      onClick={() => {
                        setIsPremiumOpen(true);
                        setCurrentIndex(0);
                        resetProgress();
                      }}
                    >
                      <TbBulb className="text-white" />
                      <span className="text-[13px] font-bold text-white">
                        What's Premium
                      </span>
                    </div>
                    </div>
                    {/* Status Viewer */}
                    {isPremiumOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 ">
                        {/* Progress Bars */}
                        <div className="absolute top-5 flex items-center justify-center w-full px-4">
                          <div className="flex gap-2 flex-grow justify-center ml-5 mt-20">
                            {statusImages.map((_, i) => (
                              <div
                                key={i}
                                className="w-20 h-1 bg-gray-500 rounded-md overflow-hidden mt-13 z-60"
                              >
                                <div
                                  className="h-full bg-white"
                                  style={{
                                    width: `${progress[i]}%`,
                                    transition: "width 0.1s linear",
                                  }}
                                ></div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Image Viewer Container */}
                        <div className="relative w-90 h-[500px] flex items-center justify-center bg-[#2a1035] rounded-lg shadow-lg">
                          {/* Close Button (X) - Positioned outside the top-right of the box */}
                          <button
                            className="absolute top-0 right-0 transform translate-x-full -translate-y-1/2 text-white text-3xl bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center"
                            onClick={() => setIsPremiumOpen(false)}
                          >
                            &times;
                          </button>

                          {/* Left Button - Previous */}
                          <button
                            className="absolute left-2 bg-gray-700 text-white px-4 py-2 rounded-full text-xl"
                            onClick={goToPrevImage}
                          >
                            &#10094;
                          </button>

                          {/* Image */}
                          <img
                            src={statusImages[currentIndex]}
                            alt="Status"
                            className="w-full h-full object-cover rounded-lg"
                          />

                          {/* Right Button - Next */}
                          <button
                            className="absolute right-2 bg-gray-700 text-white px-4 py-2 rounded-full text-xl"
                            onClick={goToNextImage}
                          >
                            &#10095;
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <img src={faq} alt="" className="w-5 ml-3 mt-4" />
                  <span className="text-[19px] font-bold text-white ml-2 mt-4 ">
                    FAQ's
                  </span>
                </div>

                {/* Right Side - What's Premium Button */}
              </div>
            </div>

            {/* first main div */}
            <div className="bg-[#2a1035] border border-black  w-[1350px] rounded-2xl h-[1700px] ml-70 ">
             <div className="   ">
                <div className="bg-[#2a1035] text-white p-4 rounded-2xl ml-9 ">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Image Section */}
                    <div className="h-15 w-15 mt-2">
                      <img
                        src={hkey}
                        alt="Key Icon"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    {/* Text Section */}
                    <div className="mt-2 text-center md:text-left flex-1 min-w-[250px]">
                      <h3 className="text-lg font-semibold">Hey there,</h3>
                      <p className="text-sm leading-5">
                        Subscribe to Premium today to save ₹50,000 on brokerage,
                        along with <br className="hidden md:block" />
                        other benefits
                      </p>
                    </div>
                    {/* Button Section */}
                    <div className="flex items-center md:items-start space-y-2">
                      <h2 className="text-md font-medium mr-3 mt-2">
                        Change plan validity
                      </h2>

                      <div className="flex bg-[#8F87F1] gap-2 rounded-md h-10 p-1 mr-10">
                        <button
                          className={`cursor-pointer rounded-md px-4 py-1 ${
                            validity === "45"
                              ? "bg-[#2a1035] text-white font-bold text-[14px]"
                              : "bg-[#8F87F1] text-white font-bold text-[14px]"
                          }`}
                          onClick={() => setValidity("45")}
                        >
                          45 days
                        </button>
                        <button
                          className={`cursor-pointer rounded-md px-4 py-1 ${
                            validity === "90"
                              ? "bg-[#2a1035] text-white font-bold text-[14px]"
                              : "bg-[#8F87F1] text-white font-bold text-[14px]"
                          }`}
                          onClick={() => setValidity("90")}
                        >
                          90 days
                        </button>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>

              <div className="border-t  border-white w-[1250px] ml-10"></div>
              <div className="bg-[#2a1035]   w-100">
                {/* left side */}
                <div className="flex w-[200px] ">
                  <div className=" mt-8">
                    <div className="bg-[#2a1035] text-white  rounded-lg text-center ">
                      <div>
                        <Discount />
                      </div>
                    </div>
                    <div className="main div">
                      <div className="flex mt-12 ml-10 ">
                        <img src={contactl} alt="" className="w-5 h-5 mt-1" />
                        <p className="text-[15px] ml-2 text-white">
                          Zero Brokerage owners contacts
                        </p>
                      </div>
                      <div
                        className="flex mt-5 ml-10
      "
                      >
                        <img src={s} alt="" className="w-5 h-5 mt-1 " />
                        <p className="text-[15px] ml-2 text-white">
                          Priority Customer suppor
                        </p>
                      </div>
                      <div className="flex mt-5 ml-10 text-white">
                        <img src={w} alt="" className="w-5 h-5 mt-1" />
                        <p className="text-[15px] ml-2">
                          Instant alerts on new properties
                        </p>
                      </div>
                      <div className="flex mt-6 ml-10">
                        <img src={ss} alt="" className="w-5 h-5 mt-1" />
                        <p className="text-[15px] ml-2 text-white">
                          Dedicated relationship manager

                        </p>
                        <CiCircleAlert className="mt-1 ml-1 cursor-pointer text-white" size={22} />

                      </div>
                    </div>

                    <div className="pop mt-8 ml-10  w-60 rounded-md  " id="pop">
                      <div className="flex">
                        <div
                          className="see border-t- border-b-pink-400"
                          id="see"
                        >
                          <div className="text-pink-400">
                            {" "}
                            See additional benefits
                          </div>
                        </div>
                        <img
                          src={righta}
                          alt="kjnkj"
                          className="w-4 h-3 mt-3 ml-3"
                        />
                      </div>
                      <div
                        className="details ml-10 rounded-3xl bg-[#8F87F1] py-2"
                        id="details"
                      >
                        <span className="ml-6 text-[20px] text-white">
                          {" "}
                          Additional Benefits
                        </span>

                        <div className="grid ml-9 py-3 w-60  ">
                          <div className="flex  ">
                            <img src={s} alt="" className="w-7 h-7 mt-1  " />
                            <span className="ml-5 text-white text-[20px]"> Customer Support</span>
                          </div>
                          <div className="flex  bg-[#2a1035] rounded-full h-7 ml-10 mt-3 w-52 items-center">
                            <img
                              src={feedback}
                              alt=""
                              className="w-5 h-5 ml-2 "
                            />
                            <img
                              src={s}
                              alt=""
                              className="w-[18px] h-[18px] mt-1 ml-2 "
                            />

                            <span className="ml-2 text-[14px] text-white">
                              All Plan expcet Sachet
                            </span>
                          </div>
                        </div>

                        <div className="grid ml-9 py-3">
                          <div className="grid ">
                            <div className="flex">
                              <img src={c} alt="" className="w-7 h-7 mt-1 " />

                              <span className="ml-5  text-[20px] mt-1 text-white ">
                                {" "}
                                Zero Brokerage Porperties
                              </span>
                            </div>
                            <div className="flex  bg-[#2a1035] rounded-full h-7 ml-11 mt-3 w-30 items-center">
                              <img
                                src={feedback}
                                alt=""
                                className="w-5 h-5 ml-2 border-white"
                              />
                              <img
                                src={s}
                                alt=""
                                className="w-[18px] h-[18px] mt-1 ml-2 "
                              />

                              <span className="ml-2 text-[14px] text-white">All Plan</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      {/* Apply Coupon Button */}
                      <div className="mt-20 bg-[#8F87F1] w-90   rounded-md p-2 ml-10">
                        <div className="flex ">
                          <button
                            className="flex text-[15px] cursor-pointer items-center h-7 w-full text-white "
                            onClick={() => setIsOpen(true)}
                          >
                            <img
                              src={discount}
                              alt="discount"
                              className="w-6 h-6  mr-4"
                            />
                            Apply Coupon
                          </button>
                          <img
                            src={right}
                            alt="arrow"
                            className="w-4 h-3 ml-30 mt-1"
                          />
                        </div>
                      </div>

                      {/* Popup Modal */}
                      {isOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 ">
                          <div className="bg-[#8F87F1] p-6 rounded-lg shadow-lg w-80 relative">
                            {/* Close Button (X) */}
                            <button
                              className="absolute top-2 right-2 text-xl text-gray-300 hover:text- cursor-pointer "
                              onClick={() => setIsOpen(false)}
                            >
                              &times;
                            </button>

                            <h2 className="text-lg font-semibold text-white  mb-4">
                              Apply Coupon
                            </h2>

                            {/* Coupon Input Box */}
                            <div className="flex items-center border border-gray-600 bg-gray-900 rounded-md overflow-hidden">
                              <input
                                type="text"
                                placeholder="Enter Coupon Code"
                                className="flex-1 p-2 outline-none bg-transparent text-white placeholder-gray-400"
                              />
                              <button className="bg-purple-800 text-white px-4 py-2 hover:text-black cursor-pointer hover:bg-purple-400 font-bold">
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      {/* Pay via MobiKwik Button */}
                      <div className="mt-6 bg-[#8F87F1] w-90 rounded-md ml-10   ">
                        <button
                          className="flex text-[15px] cursor-pointer items-center h-11 w-full text-white ml-2"
                          onClick={() => setIsOpen("mobikwik")}
                        >
                          <img
                            src={discount}
                            alt=""
                            className="w-6 h-6  mr-3"
                          />
                          <span className="text-[16px]">
                            Pay via MobiKwik to get ₹500 Cashback
                          </span>
                          <img
                            src={right}
                            alt="arrow"
                            className="w-4 h-3 ml-auto mr-3"
                          />
                        </button>
                      </div>

                      {/* Apply Coupon Popup */}
                      {isOpen === "coupon" && (
                        <div className="fixed inset-0 flex items-center justify-center  ">
                          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative">
                            {/* Close Button (X) */}
                            <button
                              className="absolute top-2 right-2 text-xl text-gray-600 hover:text-gray-900"
                              onClick={() => setIsOpen(null)}
                            >
                              &times;
                            </button>

                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                              Apply Coupon
                            </h2>

                            {/* Coupon Input Box */}
                            <div className="flex items-center border border-purple-300 rounded-md overflow-hidden">
                              <input
                                type="text"
                                placeholder="Enter Coupon Code"
                                className="flex-1 p-2 outline-none"
                              />
                              <button className="bg-purple-800 text-white px-4 py-2">
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Pay via MobiKwik Popup */}
                      {isOpen === "mobikwik" && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 ">
                          <div className="bg-[#8F87F1] text-white p-6 rounded-lg shadow-lg w-140 relative z-auto mb-30">
                            {/* Close Button (X) */}
                            <button
                              className="absolute top-2 right-2 text-xl cursor-pointer text-white"
                              onClick={() => setIsOpen(null)}
                            >
                              &times;
                            </button>

                            <h2 className="text-lg font-semibold text-white mb-4">
                            Upto ₹500 Cashback on payments via MobiKwik
                            </h2>
                            <div className="flex">  Offer Details  <div className="w-70 mt-3 ml-2"><hr /></div></div>
                            <p className="text-white text-[16px] py-5">
                             
                              <li className="">
                                {" "}
                                Get up to ₹500/- cashback on payments via
                                MobiKwik{" "}
                              </li>
                              <li>
                                {" "}
                                Users can get any cashback amount between ₹25 -
                                ₹500
                              </li>
                              <li>
                                Offer can be availed once per user during the
                                offer period{" "}
                              </li>
                              <li>
                                {" "}
                                Valid for all users on a minimum transaction
                                value of ₹899 and above{" "}
                              </li>
                              <li>
                                {" "}
                                No code is required to avail the offer
                              </li>{" "}
                              <li>
                                {" "}
                                Valid from 7th February '23 to 31st March '25{" "}
                              </li>
                              <li> Terms and Conditions Apply* </li>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* close left */}

                  {/* right */}
                  <div>
                    <div>
                      <div className="w-170 bg-[#2a1035] p-6 m-auto h-117 ml-21 relative mt-5">
                       
                        <div>
                          <div className="w-27 text-center ml-5 absolute rounded-md text-[15px] h-12 -mt-5 bg-[#DD88CF] border border-black text-white font-semibold">
                            Instant Trial Plan
                          </div>

                          <div className="w-27 text-center ml-85 absolute rounded-md text-[15px] h-8 -mt-4 bg-[#DD88CF] border border-black text-white  font-semibold">
                            Most Popular
                          </div>
                          <div className="grid grid-cols-4">
      {basePlans.map((plan) => {
        const price = plan.price[validity]; // Plan price
        const gstAmount = Math.round(price * 0.18); // 18% GST calculation
        const totalAmount = price + gstAmount; // Total cost including GST

        return (
          <div
            key={plan.name}
            className={`p-4 text-center cursor-pointer w-38 h-110 ${
              selectedPlan === plan.name ? "bg-[#8F87F1]" : "bg-[#2a1035]"
            }`}
            onClick={() => {
              setSelectedPlan(plan.name);
              setPlanSelected(true);
            }}
          >
            {/* Selection Indicator */}
            <div className="border-white rounded-full border w-5 h-5 ml-15 mt-6 flex justify-center items-center">
              {selectedPlan === plan.name && (
                <img src={done} alt="" className="w-5 h-5" />
              )}
            </div>

            <div className="rounded-full w-12 mt-5 ml-12">{plan.image1}</div>
            <h3 className="text-lg font-bold mt-2 text-white">{plan.name}</h3>
            <p className="text-white mt-2 text-2xl">{plan.brokerage}</p>
            <p className="text-white mt-3 ml-1">{plan.iconone}</p>
            <p className="text-white mt-3 ml-1">{plan.icontwo}</p>
            <p className="text-white mt-3 ml-1">{plan.iconthree}</p>
            <p className="text-xl font-bold text-white">₹{price}</p>
            <p className="text-gray-300 line-through">₹{plan.oldPrice[validity]}</p>

            {/* GST Tooltip */}
            <div
              className="relative flex justify-center items-center"
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <p className="text-gray-300 mt-2">{plan.gst}</p>
              <CiCircleAlert className="mt-3 ml-1 cursor-pointer text-white" size={22} />

              {/* Tooltip - Show only if hovered */}
              {hoveredPlan === plan.name && (
                <div className="absolute bottom-5 left-0 bg-[#8F87F1] text-black p-2 rounded-lg shadow-lg w-35 ml-3">
                  <div className="flex">
                    <p className="font-semibold text-[12px] mr-7 ml-2 text-white">Price</p>
                    <p className="font-semibold text-[12px] text-white mr-5">₹ {price}</p>
                  </div>
                  <div className="flex">
                  <p className="font-semibold text-[12px] text-white ml-2" >GST</p>
                  <p className="font-semibold text-[12px] text-white ml-8" >₹ {gstAmount}</p>
                  </div>
                 
                  <hr className="my-1 text-white" />
                  <div className="flex">
                  <p className="font-bold text-white text-[12px] ml-2">Total</p>
                  <p className="font-bold text-white text-[12px] ml-7">₹ {totalAmount}</p>
                  </div>
                 
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
                        </div>
                      </div>
                    </div>

                    <div id="pai">
                      {" "}
                      <div className="pop    w-20 ml-26   rounded-md h-10  ">
                        <div className="flex" id="pai">
                          <div className="see" id="sai">
                            <div className="">
                              {" "}
                              <div className="  bg-[#2a1035] p-4  flex items-center justify-between   w-160">
                                <div className="flex items-center space-x-2 w-150">
                                  <MdOutlineSmartToy className="text-pink-400 text-2xl" />
                                  <span className="text-white">
                                    Get 'AI Recommended Properties' at just ₹199
                                  </span>
                                  <CiCircleAlert className="text-gray-400" />
                                </div>

                                <button
                                  className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${
                                    selected ? "bg-orange-500" : "bg-gray-500"
                                  }`}
                                  onClick={handleCheckbox}
                                >
                                  {selected && (
                                    <FaCheck className="text-white" />
                                  )}
                                </button>

                                <div className="mt-4">
                                  {/* <p className="text-white">Total: ₹{total}</p> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="details ml-10 rounded-3xl bg-[#8F87F1] py-2 "
                          id="dai"
                        >
                          <span className="ml-6 text-[20px]"> Benefits</span>

                          <div className="grid ml-10 py-3 w-70  ">
                            <div className="flex  ">
                              <img src={ww} alt="" className="w-6 h-6 mt-1 " />
                              <span className="ml-6 text-[15px] text-white ">
                                Whatsapp share Authentic and available
                                properties shared directly on whatsapp
                                periodically
                              </span>
                            </div>

                           
                          </div>
                          <div className="flex   rounded-full h-7 ml-5 mt-3 w-80 items-center">
                              <MdOutlineSmartToy className="text-white  w-22 ml-2 " size={30} />

                              <span className="  text-[15px] ml-3 mt-8">
                                Curated Properties AI driven curated set of
                                properties on your App dashboard
                              </span>
                            </div>
                          <div className="grid ml-9   mt-12  py-3">
                            <div className="grid ">
                              <div className="flex">
                                <MdOutlineUpdate className="text-white text-[50px] w-20 " />

                                <span className="ml-5 text-[15px] ">
                                  {" "}
                                  Real time Update Properties recommendations
                                  will update real time basis requirements
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <div className="relative">
                      
                      {/* Buy Button */}
                      <div>
      {/* Buy Button */}
      <button
        className="bg-[#8F87F1] py-3 rounded-md cursor-pointer hover:text-black text-white font-bold w-160 border mt-2 ml-26"
        onClick={handleBuyClick}
      >
        Buy {selectedPlan} <br />
        ₹ 
        {selectedPlan
          ? basePlans.find((plan) => plan.name === selectedPlan)?.price[validity] +
            Math.round(
              basePlans.find((plan) => plan.name === selectedPlan)?.price[validity] * 0.18
            ) +
            total
          : 0}
        + 18% GST
      </button>

      Modal Popup - Show only when isModalOpen is true
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#8F87F1] bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold text-center text-white">Please update your details</h2>
            <input type="text" placeholder="Name" className=" w-full p-2 my-2" />
            <input type="email" placeholder="Email" className="w-full p-2 my-2" />
            <div>
              <label className="font-bold">Phone</label>
              <p className="text-lg">6268923703</p>
            </div>

            <button
              className="bg-gray-400 text-white py-2 px-4 w-full mt-4 cursor-not-allowed"
              disabled
            >
              Continue
            </button>

            {/* Close Button */}
            <button
              className="mt-3 text-red-500 w-full text-center"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>


                      {/* Popup Modal */}
                      {showPopup && (
                        <div className="fixed inset-0  flex justify-center items-center z-50">
                          <div className="bg-[#8F87F1] p-6 rounded-lg w-150 h-100  relative shadow-lg">
                            {/* Close Button */}
                            <button
                              className="absolute top-3 right-3 text-black cursor-pointer"
                              onClick={handleClosePopup}
                            >
                              <FaTimes size={20} />
                            </button>

                            {/* Form Content */}
                            <IoIosArrowUp className="text-black text-[50px] ml-60 " />

                            <h2 className="text-xl font-bold mb-4 text-center text-black">
                              Please update your details
                            </h2>
                            <input
                              type="text"
                              placeholder="Name"
                              className="w-full  p-2 rounded mb-3 text-black font-bold mt-2 outline-none"
                            />
                            <input
                              type="email"
                              placeholder="Email"
                              className="w-full  p-2 rounded mb-3 text-black font-bold mt-2 outline-none"
                            />
                            <input
                              type="tel"
                              placeholder="Phone"
                              className="w-full  p-2 rounded mb-3 text-black font-bold  border-b-black outline-none text-[15px] mt-2"
                            />
                            <button className="bg-[#2a1035] cursor-pointer      text-white font-bold w-full py-2 rounded hover:bg-purple-900 mt-2">
                              Continue
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Testimonials Section */}

              <div className="">
                <div className="mt-10 w-400 ml-10 text-white">
                  {" "}
                             --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                              </div>
                <div className="w-330 mx-auto p-6 bg-[#2a1035]  mt-3 relative  ">
                  <h2 className="text-xl text-pink-400 mb-4 mt-4 ">
                    Testimonial
                  </h2>

                  {/* Slider Container */}
                  <div className="flex items-center justify-center w-full overflow-hidden relative ">
                    {/* Left Button */}
                    <button
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full z-20 "
                      onClick={() =>
                        setIndex(
                          (prev) =>
                            (prev - 1 + testimonials.length) %
                            testimonials.length
                        )
                      }
                    >
                      <ChevronLeft size={30} />
                    </button>

                    {/* Sliding Cards */}
                    <div
                      className="flex transition-transform duration-1000 ease-in-out gap-6 h-80"
                      style={{ transform: `translateX(-${index * 30}%)` }}
                    >
                      {testimonials.map((testimonial, i) => (
                        <div
                          key={i}
                          className="w-[500px] p-6 bg-[#341544] rounded-lg shadow-md flex-shrink-0"
                        >
                          {/* Star Ratings */}
                          <div className="flex text-yellow-400 mb-2">
                            {"★".repeat(testimonial.rating)}
                          </div>

                          {/* Testimonial Text */}
                          <p className="text-lg text-white">
                            "{testimonial.text}"
                          </p>

                          {/* User Info */}
                          <div className="flex items-center mt-4 gap-4">
                            <img
                              src={testimonial.image}
                              alt="User"
                              className="w-12 h-12 rounded-full border-2 border-white"
                            />
                            <div className="text-left">
                              <p className="text-white font-semibold">
                                {testimonial.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {testimonial.location}
                              </p>
                            </div>
                          </div>

                          {/* RM & Plan Details */}
                          <div className="mt-4 flex justify-between text-gray-300 text-sm">
                            <span className="bg-[#45234e] px-3 py-1 rounded-lg">
                              Assisted RM:{" "}
                              <span className="text-white">
                                {testimonial.rm}
                              </span>
                            </span>
                            <span className="bg-[#45234e] px-3 py-1 rounded-lg">
                              Plan:{" "}
                              <span className="text-white">
                                {testimonial.plan}
                              </span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Button */}
                    <button
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full z-20"
                      onClick={() =>
                        setIndex((prev) => (prev + 1) % testimonials.length)
                      }
                    >
                      <ChevronRight size={30} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Extra Slider */}
              <div className=" ">
                <div className="bg-[#2a1035] w-284 h-[400px]  mb-20 mt-1 relative">
                  <h2 className="text-xl text-pink-400 mb-4 ml-9 py-10 ">
                    Featured In
                  </h2>

                  <div className="flex items-center justify-center w-310 mx-auto overflow-hidden relative ml-10">
                    {/* Left Button */}
                    <button
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full z-20 "
                      onClick={() =>
                        setExtraIndex(
                          (prev) =>
                            (prev - 1 + extraSliderItems.length) %
                            extraSliderItems.length
                        )
                      }
                    >
                      <ChevronLeft size={30} />
                    </button>

                    {/* Slider Content */}
                    <div
                      className="flex transition-transform duration-500 ease-in-out gap-6 "
                      style={{ transform: `translateX(-${extraIndex * 20}%)` }}
                    >
                      {extraSliderItems.map((item, i) => (
                        <div
                          key={i}
                          className="w-[500px] p-10 bg-[#341544] rounded-lg h-70 flex-shrink-0 "
                        >
                          <p className="text-lg text-white">"{item.text}"</p>
                          <p className="mt-2 text-pink-400">- {item.name}</p>
                        </div>
                      ))}
                    </div>

                    {/* Right Button */}
                    <button
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full z-20"
                      onClick={() =>
                        setExtraIndex(
                          (prev) => (prev + 1) % extraSliderItems.length
                        )
                      }
                    >
                      <ChevronRight size={30} />
                    </button>
                  </div>
                </div>
              </div>
              {/* right close */}
            </div>
       
        </div>
        {/* second main div closed */}
      </div>
      {/* first main div closed */}
    </>
  );
}
