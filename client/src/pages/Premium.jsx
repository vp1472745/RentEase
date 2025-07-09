import { useState, useEffect } from "react";
import { Check, X, ChevronLeft, ChevronRight, Link } from "lucide-react";
import { RiCloseFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { CiCircleAlert } from "react-icons/ci";
import { motion } from "framer-motion"; // Framer Motion Import
import hkey from "../assets/hkey.png";
import heading from "../assets/whiteoneo.png"
import logo2 from "../assets/logorr.png";
import arrow from "../assets/arrow.png";
import { RiExternalLinkFill } from "react-icons/ri";
import fe from "../assets/fea.png";
import D from "../assets/yellow.png";
import { RxCross1 } from "react-icons/rx";
import done from "../assets/done.png";
import { TbBulb } from "react-icons/tb";
import contactl from "../assets/contact.png";
import discountoffer from "../assets/discountoffer.png";
import ReactDOM from "react-dom";
import Discount from "../pages/discounttiming";
import righta from "../assets/righta.png";
import m1 from "../assets/m1.png";
import logo1 from "../assets/ys.png";
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
import logo4 from "../assets/lastlogo.png";
import su from "../assets/supportDD.png";
import A from "../assets/yellowthree.jpg";
import B from "../assets/picsecond.png";
import C from "../assets/picfourth.png";
import logo3 from "../assets/lgfour.png";
import { MdOutlineSmartToy } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import c from "../assets/circle.png";
import diamond from "../assets/diamond.png";
import TM_quotes from "../assets/dialog.png";
import M from "../assets/M.png";

const basePlans = [
  {
    pop: <div> Instant Trial Plan</div>,
    image: <img src={check} alt="" className="w-5 h-5 border-white " />,
    image1: <img src={i1} alt="" className="w-12 h-12 border-white " />,
    name: "Sachet",
    brokerage: 5,
    iconone: <RiCloseFill size={30} className="text-[#625468]  " />,
    icontwo: <RiCloseFill size={30} className="text-[#625468]" />,
    iconthree: <RiCloseFill size={30} className=" text-[#625468] " />,
    price: { 45: 599, 90: 1099 }, // Prices for different validity
    oldPrice: { 45: 1199, 90: 2199 },

    contacts: 5,
    gst: "+18% GST",
  },
  {
    image: <img src={check} alt="" className="w-5 h-5  border-white" />,
    image1: (
      <img src={feedback} alt="" className="w-10 h-10 ml-1 border-white " />
    ),
    name: "Connect",
    brokerage: 15,
    iconone: <FaCheck size={22} className="text-white " />,
    icontwo: <FaCheck size={22} className="text-white" />,
    iconthree: <RiCloseFill size={30} className="text-[#625468]" />,
    price: { 45: 899, 90: 1599 },
    oldPrice: { 45: 1799, 90: 3199 },
    contacts: 15,
    gst: "+18% GST",
  },
  {
    image: <img src={check} alt="" className="w-5 h-5 border-white" />,
    image1: (
      <img src={feedback} alt="" className="w-10 h-10 ml-1 border-white " />
    ),

    name: "Connect+",
    brokerage: 25,
    iconone: <FaCheck size={22} className="text-white " />,
    icontwo: <FaCheck size={22} className="text-white" />,
    iconthree: <RiCloseFill size={30} className="text-[#625468]" />,
    price: { 45: 1199, 90: 2099 },
    oldPrice: { 45: 2599, 90: 4199 },
    contacts: 25,
    popular: true,
    gst: "+18% GST",
  },
  {
    image: <img src={check} alt="" className="w-5 h-5 border-white" />,
    image1: <img src={su} alt="" className="w-10 h-10 border-white  ml-1" />,

    name: "Relax",
    brokerage: 50,
    iconone: <FaCheck size={22} className="text-white" />,
    icontwo: <FaCheck size={22} className="text-white" />,
    iconthree: <FaCheck size={22} className="text-white" />,
    price: { 45: 1749, 90: 2999 },
    oldPrice: { 45: 3499, 90: 5999 },
    contacts: 50,
    gst: "+18% GST",
  },
];

const statusImages = [m1, m2, m3];

const extraSliderItems = [
  {
    text: "roommilega.in launches connect service for home seekers",
    date: "16 August 2022",
    img: <img src={logo1} className="w-20 h-18"></img>,
    link: "https://yourstory.com/2022/08/startup-news-updates-daily-roundup-august-16-paytm",
  },
  {
    text: `roommilega.in launches 'Room Milega Premium',owner connect services for home seekers `,
    img: <img src={logo2} className="w-20 h-14 "></img>,

    date: "17 August 2022",
    link: "https://www.rprealtyplus.com/allied/housingcom-launches-housing-premium-owner-connect-services-for-home-seekers-107347.html",
  },
  {
    text: `roommilega.in launches owner connect services,''Room Milega' Premium'`,
    img: <img src={logo3} className="w-30 h-10 mt-2 "></img>,

    date: "16 August 2022",
    link: "https://www.realtynmore.com/housing-com-launches-owner-connect-services-housing-premium/",
  },
  {
    text: `roommilega.in launches owner connect services for home seekers; Branded as 'Room Milega Premium', the service recorded 25,00 subscribers in the pre-launch phase`,
    img: <img src={logo4} className="w-30 h-10 mt-1"></img>,

    date: "16 August 2022",
    link: "https://thepropertytimes.in/housing-com-launches-owner-connect-services-for-home-seekers-branded-as-housing-premium-the-service-recorded-25000-subscribers-in-the-pre-launch-phase/",
  },
];
const testimonials = [
  {
    text: "Sahibha,my Relationship Manager , has been very helpful in my flat search. She has been in touch with me and sending me the properties according to my requirement and she has also been giving her suggestion to help with my search",
    name: "Arjit",
    location: "New Delhi",
    image: A,
    rating: 5,
    rm: "Sahibha",
    smily: "😃",
    plan: "Relax",
  },
  {
    text: "Amol helped me locate properties that suited my requirement and helped me connect with the respective owner. He has good communication abilities and has been very understanding and polite with his behaviour",
    name: "Jayanta",
    location: "Mumbai",
    image: B,
    rating: 5,
    rm: "Amol",
    // smily: "😃",
    smily: "🤑",
    plan: "MoneyBack",
  },
  {
    text: "Ramadevi has been constantly posting houses for rent. She was in continuous interaction with me and was posting rental houses based on the discussions. I am very happy with her efforts. In the end, I was able to save brokerage due to owner properties shared by her.",
    name: "SivaKumar",
    location: "Cheenai",
    image: C,
    rating: 5,
    rm: "Ramadevi",
    smily: "😃",
    plan: "Relax",
  },
  {
    text: "Ramadevi is very helpful and understoord my requirements very well throughout the process. I'm satisfied with the help provided",
    name: "Sudheer",
    location: "Hyderabad",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 5,
    rm: "Rama",
    smily: "😃",
    plan: "Relax",
  },
  {
    text: "Jennifer is very professional and dedicated.She right away started working on my requirements and provided me with results meeting my requirements",
    name: "Abin",
    location: "Bengaluru",
    image: M,
    rating: 5,
    rm: "Jennifer",
    smily: "🤑",
    plan: "MoneyBack",
  },
];

export default function PremiumSubscription() {
  const [hoveredPlan, setHoveredPlan] = useState();
  const [index, setIndex] = useState(0);
  const [validity, setValidity] = useState("45");
  const [planSelected, setPlanSelected] = useState(false); // Define setPlanSelected
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
  const cardWidth = 400; // Width of each card including margins

  const visibleCards = 2; // Number of cards moving inside
  const restartAfter = 2; // Restart the slider after 3 cards
  const handleBuyClick = () => {
    setShowPopup(true);
  };

  const handleNext = () => {
    setExtraIndex((prevIndex) => {
      // If we're at the end (showing last 3 cards), reset to show first 3 cards
      if (prevIndex >= extraSliderItems.length - 3) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const handlePrev = () => {
    setExtraIndex((prevIndex) => {
      // If we're at the start, go to the end
      if (prevIndex === 0) {
        return extraSliderItems.length - 3;
      }
      return prevIndex - 1;
    });
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
    console.log(index);
    return () => clearInterval(interval);
  }, []);

  const [extraIndex, setExtraIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setExtraIndex((prev) => (prev + 1) % (extraSliderItems.length - 1)),
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
      <div className="relative min-h-screen bg-[#2a1035] ">
        <div className="  top-0 left-0 right-0 z-[1000] bg-[#2a1035]">
          <div className="bg-[#2a1035] p-6 text-white flex flex-col items-center h-16"></div>
        </div>
        {/* second main div */}
        <div className="flex justify-between items-center w-full ">
          <div className="bg-[#8F87F1] border  w-[100%]">
            <div className="bg-[#8F87F1]   p-2 text-white flex flex-col items-center w-260  m h-[100%] ml-78 ">
              <div className="ml-70 justify-between items-center h- ">
                {/* Left Side - Logo */}
                <div className="flex items-center   ">
                  {/* <img
                    src={ddd}
                    alt=""
                    className="w-12 items-center  h-13  mt-3 ml-70 text-white"
                  /> */}
                  <div className=" text-center ">
                    {/* <span className="text-[10px] text-white font-bold mr-70  ">
                      RenatEase
                    </span>
                    <div className="text-[15px] text-white font-bold mr-70 h-4  ">
                      Premium
                    </div> */}
                    <img src={heading}  className="w-50  h-15 object-cover  mr-60" alt="" />
                  </div>
                  <div>
                    {/* "What's Premium" Button */}
                    <div className="">
                      <div
                        className="text-white px-2 py-2 rounded-full cursor-pointer   h-8 w-37 flex items-center bg-[#2a1035]  mt-5 "
                        onClick={() => {
                          setIsPremiumOpen(true);
                          setCurrentIndex(0);
                          resetProgress();
                        }}
                      >
                        <TbBulb className="text-white " />
                        <span className="text-[14px] font-bold text-white">
                          What's Premium
                        </span>
                      </div>
                    </div>
                    {/* Status Viewer */}
                    {isPremiumOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 ">
                        {/* Progress Bars */}
                        <div className="absolute top-5 flex items-center justify-center w-full px-4">
                          <div className="flex gap-2 flex-grow justify-center ml-5 mt-10">
                            {statusImages.map((_, i) => (
                              <div
                                key={i}
                                className="w-20 h-1 bg-gray-500 rounded-md overflow-hidden  z-60"
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
                        <div className="relative w-90 h-[90%] flex items-center justify-center bg-[#2a1035] rounded-lg shadow-lg">
                          {/* Close Button (X) - Positioned outside the top-right of the box */}
                          <button
                            className="absolute -top-4 cursor-pointer right-0 transform translate-x-full -translate-y-1/2 text-white text-3xl bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center "
                            onClick={() => setIsPremiumOpen(false)}
                          >
                            &times;
                          </button>

                          {/* Left Button - Previous */}
                          <button
                            className="absolute left-2 bg-gray-700 text-white px-4 py-2 rounded-full text-xl "
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
                            className="absolute right-2 bg-gray-700 text-white px-4 py-2 rounded-full text-xl "
                            onClick={goToNextImage}
                          >
                            &#10095;
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <img src={faq} alt="" className="w-4 ml-3 mt-4" />
                  <span className="text-[19px] font-bold text-white ml-1 mt-4 ">
                    FAQ's
                  </span>
                </div>

                {/* Right Side - What's Premium Button */}
              </div>
            </div>
            <div></div>
            {/* first main div */}
            <div className="bg-[#2a1035] border border-black  w-[1135px] rounded-2xl h-[1650px]  ml-50 ">
              <div className="   ">
                <div className="bg-[#2a1035] text-white p-4 rounded-2xl ml-9 mt-2 ">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Image Section */}
                    <div className="h-15 w-15 ">
                      <img
                        src={hkey}
                        alt="Key Icon"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Text Section */}
                    <div className=" text-center md:text-left flex-1 w-[500px] ">
                      <h3 className="text-[17px] font-bold">Hey there,</h3>
                      <p className="text-[17px] leading-5 ">
                        Subscribe to Premium today to save ₹50,000 on brokerage,
                        along with other benefits
                      </p>
                    </div>

                    {/* Button Section */}
                    {selectedPlan !== "Sachet" ? (
                      <div className="flex items-center md:items-start space-y-2 relative mt-10 -z-0">
                        <h2 className="text-md font-medium mr-3 mt-2">
                          Change plan validity
                        </h2>

                        {/* Animated Save 40% text */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 2, ease: "easeInOut" }}
                          className="absolute text-green-400 font-bold -right-1 -top-10"
                        >
                          <div className="flex">
                            <img src={arrow} alt="" className="w-7 h-7 mt-2" />{" "}
                            Save 40%
                          </div>
                        </motion.div>

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
                    ) : (
                      <p className="text-white font-semibold mt-9 mr-10 text-[14px]">
                        <span className="text-gray-400">
                          Sachet plan is valid for{" "}
                        </span>{" "}
                        7 days.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t  border-white w-[1057px] ml-10"></div>
              <div className="bg-[#2a1035] w-100">
                {/* left side */}
                <div className="flex w-[200px]  ml-4">
                  <div className=" mt-8">
                    <div className="bg-[#2a1035] text-white  rounded-lg text-center ">
                      <div>
                        <Discount />
                      </div>
                    </div>
                    <div className="main div ml-10">
                      <div className="flex mt-9">
                        <div className="relative w-[500px] bg-[#381d44]  h-9 flex items-center mt-[0.5px] px-3 ">
                          {/* Background Overlay */}
                          <div className="absolute inset-0 opacity-50 z-0"></div>

                          {/* Content on top of Background */}
                          <img
                            src={contactl}
                            alt=""
                            className="w-5 h-5 relative z-10 ml-2"
                          />
                          <p className="relative text-[17px] ml-2 text-white font-semibold z-10">
                            Zero Brokerage owners contacts
                          </p>
                        </div>
                      </div>

                      <div className="relative w-[500px]  h-9 flex items-center mt-[0.5px] px-3">
                        {/* Background Overlay */}
                        <div className="absolute inset-0  opacity-50 z-0"></div>

                        {/* Content on top of Background */}
                        <img
                          src={s}
                          alt=""
                          className="w-5 h-5 relative z-10 ml-2"
                        />
                        <p className="relative text-[17px] ml-2 text-white font-semibold z-10">
                          Priority Customer support
                        </p>
                      </div>

                      <div className="relative w-[500px] bg-[#381d44]  h-9 flex items-center mt-[0.5px] px-3 ">
                        <div className="absolute inset-0 opacity-50 z-0"></div>

                        <img
                          src={w}
                          alt=""
                          className="w-5 h-5 relative z-10 ml-2"
                        />
                        <p className="relative text-[17px] ml-2 text-white font-semibold z-10">
                          Instant alerts on new properties
                        </p>
                      </div>

                      <div className="relative w-[500px]  h-9 flex items-center mt-[0.5px] px-3 ">
                        <div className="absolute inset-0  opacity-50 z-0"></div>

                        <img
                          src={su}
                          alt=""
                          className="w-5 h-5 relative z-10 ml-2"
                        />
                        <p className="relative text-[17px] ml-2 text-white font-semibold z-10">
                          Dedicated relationship manager
                        </p>
                        <CiCircleAlert
                          className="mt-1 ml-1 cursor-pointer text-white"
                          size={19}
                        />
                      </div>
                    </div>

                    <div className="pop mt-9 ml-5  w-60 rounded-md  " id="pop">
                      <div className="flex">
                        <div
                          className="see border-t- border-b-pink-400"
                          id="see"
                        >
                          <div className="text-pink-400 text-[15px] border border-b-pink-400   border-b-1 border-t-[#2a1035]  border-r border-r-[#2a1035]   border-l border-l-[#2a1035] ">
                            {" "}
                            See additional benefits
                          </div>
                        </div>
                        <img
                          src={righta}
                          alt="kjnkj"
                          className="w-4 h-3 mt-[6px] "
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

                        <div className="grid ml-5 py-3 w-60  ">
                          <div className="flex  ">
                            <img src={s} alt="" className="w-6 h-6 mt-1  " />
                            <span className="ml-5 text-white text-[18px] font-semibold ">
                              {" "}
                              Customer Support
                            </span>
                          </div>
                          <div className="flex  bg-[#2a1035] rounded-full h-7 ml-10 mt-1 w-52 items-center">
                            <img
                              src={feedback}
                              alt=""
                              className="w-4 h-4 ml-2 "
                            />
                            <img src={s} alt="" className="w-4 h-4 mt-1 ml-1" />

                            <span className="ml-2 text-[12px] text-white">
                              All Plan expcet Sachet
                            </span>
                          </div>
                        </div>

                        <div className="grid ml-5 py-3">
                          <div className="grid ">
                            <div className="flex">
                              <img src={c} alt="" className="w-6 h-6 mt-1 " />

                              <span className="ml-5 text-white text-[18px] font-semibold   ">
                                {" "}
                                Zero Brokerage Porperties
                              </span>
                            </div>
                            <div className="flex  bg-[#2a1035] rounded-full h-7 ml-11 mt-1 w-30 items-center">
                              <img
                                src={feedback}
                                alt=""
                                className="w-4 h-4 ml-2 border-white"
                              />
                              <img
                                src={s}
                                alt=""
                                className="w-4 h-4 mt-1 ml-1 "
                              />

                              <span className="ml-2 text-[12px] text-white">
                                All Plan
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      {/* Apply Coupon Button */}
                      <div className="mt-10 bg-[#8F87F1] w-90   rounded-md p-2 ml-5">
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
                        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black   ">
                          <div className="bg-[#8F87F1] p-6 rounded-lg shadow-lg w-90 relative">
                            {/* Close Button (X) */}
                            <button
                              className="absolute top-2 right-5 text-60 text-black font-bold hover:text- cursor-pointer w-10 "
                              onClick={() => setIsOpen(false)}
                            >
                              <RxCross1
                                size={24}
                                className="font-bold ml-5 text-white"
                              />
                            </button>

                            <h2 className="text-lg font-semibold text-white  mb-4">
                              Apply Coupon
                            </h2>

                            {/* Coupon Input Box */}
                            <div className="flex items-center border border-gray-600 bg-gray-900 rounded-md overflow-hidden w-80">
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
                      <div className="mt-6 bg-[#8F87F1] w-90 rounded-md ml-5   ">
                        <button
                          className="flex text-[15px] cursor-pointer items-center h-11 w-full text-white ml-2  "
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
                          <div className="bg-white p-6 rounded-lg shadow-lg w-80 relative ">
                            {/* Close Button (X) */}
                            <button
                              className="absolute top-3 right-2 text-xl  hover:text-gray-900 text-50 text-black font-bold"
                              onClick={() => setIsOpen(null)}
                            >
                              <RxCross1
                                size={24}
                                className="font-bold ml-5 text-white"
                              />
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
                        <div>
                          <div className="fixed inset-0 flex items-center justify-center opacity-100 bg-black  z-60">
                            <div className="bg-[#8F87F1] text-white  p-6 rounded-lg shadow-lg w-140 relative z-auto mb-30">
                              <img
                                src={D}
                                alt=""
                                className="absolute -top-10 right-65 text-xl z-60 cursor-pointer w-15 border-red-800 text-black font-bold"
                              />
                              {/* Close Button (X) */}
                              <button
                                className="absolute -top-1 -right-10 text-xl cursor-pointer text-60 text-black font-bold"
                                onClick={() => setIsOpen(null)}
                              >
                                <RxCross1
                                  size={30}
                                  className="font-bold ml-5 text-white"
                                />
                              </button>

                              <h2 className="text-lg font-semibold text-white mb-4">
                                Upto ₹500 Cashback on payments via MobiKwik
                              </h2>
                              <div className="flex">
                                {" "}
                                Offer Details{" "}
                                <div className="w-70 mt-3 ml-2">
                                  <hr />
                                </div>
                              </div>
                              <p className="text-white text-[16px] py-2">
                                <li className="">
                                  {" "}
                                  Get up to ₹500/- cashback on payments via
                                  MobiKwik{" "}
                                </li>
                                <li>
                                  {" "}
                                  Users can get any cashback amount between ₹25
                                  - ₹500
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
                        </div>
                      )}
                    </div>
                  </div>
                  {/* close left */}

                  {/* right */}
                  <div className="mt-6">
                    {" "}
                    <div>
                      <div className="w-[500px] bg-[#2a1035]  h-103  relative mt-6 ">
                        <div>
                          <div className="w-26 text-center ml-[36px] absolute rounded-md text-[13px] h-[45px] -mt-7 bg-yellow-200 border border-black text-blackn font-bold z-30">
                            Instant Trial Plan
                          </div>

                          <div className="w-25 text-center ml-72 absolute rounded-md text-[13px] h-[26px] -mt-4 bg-[#DD88CF] border border-black text-white  font-semibold z-30">
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
                                  className="relative w-[150px] text-center  "
                                  onClick={() => {
                                    setSelectedPlan(plan.name);
                                    setPlanSelected(true);
                                  }}
                                >
                                  {/* Background Layer (Peeche) */}
                                  {selectedPlan === plan.name && (
                                    <>
                                      {" "}
                                      <div className="absolute inset-0 bg-[#381d44] opacity-35 h-113 w-32 top-0 ml-6 z-12"></div>
                                      <div
                                        className="absolute h-7 w-28 top-93 left-10 z-12"
                                        onMouseEnter={() =>
                                          setHoveredPlan(plan.name)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredPlan(null)
                                        }
                                      ></div>
                                    </>
                                  )}

                                  {/* Content Layer (Upar) */}
                                  <div className="relative z-10">
                                    {/* Selection Indicator */}
                                    <div
                                      className={`rounded-full w-5 h-5 ml-18 mt-6 flex justify-center items-center relative  ${
                                        selectedPlan === plan.name
                                          ? "border-0 cursor-pointer"
                                          : "border border-white "
                                      }`}
                                    >
                                      {selectedPlan === plan.name && (
                                        <img
                                          src={done}
                                          alt=""
                                          className="w-5 h-5 z-30 absolute  "
                                        />
                                      )}
                                    </div>
                                    {/* Plan Image */}
                                    <div className="relative ml-2">
                                      <div className="bg-[#8F87F1] opacity-20 rounded-full w-[53px] h-[50px] ml-12 z-1000 mt-5"></div>
                                      <div className="rounded-full w-[53px] h-[53px] mt-5 ml-[50px] items-center absolute -top-4">
                                        {plan.image1}
                                      </div>
                                    </div>

                                    {/* Plan Name */}
                                    <h3 className="text-[20px] font-semibold mt-[13px] text-white mb-2 ml-5">
                                      {plan.name}
                                    </h3>

                                    {/* Brokerage */}
                                    <div className="w-38  bg-[#381d44] h-9 flex justify-center">
                                      <p className="z-2 text-white text-[22px] font-bold bg-[#381e43] ">
                                        {plan.brokerage}
                                      </p>
                                      {/* <div className="absolute inset-0 bg-[#42215080] h-10 mt-35   z-2"></div> */}

                                    </div>


                                    {/* Plan Icons */}
                                    <div className="relative w-40  h-9 flex items-center justify-center">
                                      <p className="relative z-1 text-[22px] font-bold">
                                        {plan.iconone}
                                      </p>
                                    </div>

                                    <div className="relative w-38   bg-[#381d44] h-9 flex items-center justify-center mt-[0.5px]">
                                      <p className="relative z-10 text-[22px] font-bold ml-3 bg-[#381d44]">
                                        {plan.icontwo}
                                      </p>
                                      <div className="absolute inset-0  z-2"></div>
                                    </div>
                                    <div className="relative w-40  h-9 flex items-center justify-center">
                                      <p className="relative z-10 text-[22px] font-bold">
                                        {plan.iconthree}
                                      </p>
                                    </div>

                                    {/* Price Display */}
                                    {plan.name === "Sachet" ? (
                                      <>
                                        <p className="text-white ml-5">
                                          ₹
                                          <span className="text-[22px] font-bold text-white">
                                            {price}
                                          </span>
                                        </p>
                                        <p className="text-gray-300 line-through text-[17px] ml-5">
                                          ₹{plan.oldPrice[validity]}
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        <p className="text-white ml-5">
                                          ₹
                                          <span className="text-white text-[22px] font-bold">
                                            {price}
                                          </span>
                                        </p>
                                        <p className="text-gray-300 line-through text-[17px] ml-5">
                                          ₹{plan.oldPrice[validity]}
                                        </p>
                                      </>
                                    )}

                                    {/* GST Tooltip - Positioned above with proper z-index hierarchy */}
                                    {/* GST Tooltip - Positioned above with proper z-index hierarchy */}
                                    {/* GST Tooltip - Positioned above with proper z-index hierarchy */}
                                    {/* GST Tooltip - Positioned properly above */}
                                    <div className="relative z-[1500] pointer-events-auto">
                                      <div
                                        className="flex justify-center items-center "
                                        onMouseEnter={() =>
                                          setHoveredPlan(plan.name)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredPlan(null)
                                        }
                                      >
                                        <div className="absolute inset-0    z-2 flex mt-1 ml-8">
                                          <p className="relative z-10 text-[17px] text-white ml-3 ">
                                            +18% GST
                                          </p>

                                          <CiCircleAlert
                                            className="  text-white z-[1100] mt-1 ml-2 "
                                            size={18}
                                          />
                                        </div>
                                        {/* <p className="text-white text-[17px] cursor-pointer relative z-[1500] mt-2">
                                          +18% GST
                                        </p> */}
                                        {/* <CiCircleAlert
                                          className="ml-1 cursor-pointer text-white z-[1100] mt-2"
                                          size={15}
                                        /> */}

                                        {hoveredPlan === plan.name && (
                                          <div className="absolute left-12 bg-[#8F87F1] text-white p-2 rounded-lg shadow-lg w-30  mt-2 z-[1100] -top-21">
                                            {/* Tooltip content remains the same */}
                                            <div className="flex justify-between">
                                              <p className="font-semibold text-[12px] ml-2">
                                                Price
                                              </p>
                                              <p className="font-semibold text-[12px]">
                                                ₹ {price}
                                              </p>
                                            </div>
                                            <div className="flex justify-between">
                                              <p className="font-semibold text-[12px] ml-2">
                                                GST
                                              </p>
                                              <p className="font-semibold text-[12px]">
                                                ₹ {gstAmount}
                                              </p>
                                            </div>
                                            <hr className="my-1" />
                                            <div className="flex justify-between">
                                              <p className="font-bold text-[12px] ml-2">
                                                Total
                                              </p>
                                              <p className="font-bold text-[12px]">
                                                ₹ {totalAmount}
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
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
                      <div className="pop    w-20 ml-6    h-5  ">
                        <div className="flex  " id="pai ">
                          <div className="see outline-none " id="sai">
                            <div className="">
                              {" "}
                              <div className="       flex items-center justify-between   w-145 h-10  border-white   ">
                                <div className="flex items-center  w-150 ">
                                  <MdOutlineSmartToy
                                    className="text-pink-400 text-2xl mr-3"
                                    size={27}
                                  />
                                  <span className="text-white text-[14px]">
                                    Get 'AI Recommended Properties' at just ₹199
                                  </span>
                                  <CiCircleAlert
                                    className="text-white ml-2 "
                                    size={20}
                                  />
                                </div>

                                <button
                                  className={`w-5 h-4 flex items-center justify-center  transition-colors   mr-23 mb-2 cursor-pointer ${
                                    selected ? "bg-[#8F87F1]" : "bg-gray-500"
                                  }`}
                                  onClick={handleCheckbox}
                                >
                                  {selected && (
                                    <FaCheck className="text-white " />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="details ml-10 rounded-3xl bg-[#8F87F1] py-2 "
                          id="dai"
                        >
                          <span className="ml-6 text-[20px]"> Benefits</span>

                          <div className="grid ml-6 py-3 w-70  ">
                            <div className="flex  ">
                              <img src={ww} alt="" className="w-6 h-6 mt-1 " />
                              <span className="ml-6 text-[15px] text-white ">
                                <span className="font-bold">
                                  Whatsapp share
                                </span>{" "}
                                <br />
                                Authentic and available properties shared
                                directly on whatsapp periodically
                              </span>
                            </div>
                          </div>
                          <div className="flex   rounded-full h-7 ml-2 mt-2 w-80 items-center">
                            <MdOutlineSmartToy
                              className="text-white  w-22  "
                              size={30}
                            />

                            <span className="  text-[15px] ml-3 mt-8">
                              <span className="font-bold">
                                Curated Properties
                              </span>{" "}
                              <br /> AI driven curated set of properties on your
                              App dashboard
                            </span>
                          </div>
                          <div className="grid ml-5   mt-12  py-3">
                            <div className="grid ">
                              <div className="flex">
                                <MdOutlineUpdate className="text-white text-[50px] w-15 " />

                                <span className="ml-5 text-[15px] ">
                                  {" "}
                                  <span className="font-bold">
                                    Real time Update
                                  </span>{" "}
                                  <br /> Properties recommendations will update
                                  real time basis requirements
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
                          className="bg-[#8F87F1] py-3 rounded-md cursor-pointer hover:text-black text-white font-bold w-126 ml-6   "
                          onClick={handleBuyClick}
                        >
                          Buy {selectedPlan} <br />₹
                          {selectedPlan
                            ? basePlans.find(
                                (plan) => plan.name === selectedPlan
                              )?.price[validity] +
                              Math.round(
                                basePlans.find(
                                  (plan) => plan.name === selectedPlan
                                )?.price[validity] * 0.18
                              ) +
                              total
                            : 0}
                          + 18% GST
                        </button>
                        {isModalOpen && (
                          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#8F87F1] bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg w-96">
                              <h2 className="text-lg font-bold text-center text-white">
                                Please update your details
                              </h2>
                              <input
                                type="text"
                                placeholder="Name"
                                className=" w-full p-2 my-2"
                              />
                              <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 my-2"
                              />
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
                        <div className="fixed inset-0  flex justify-center items-center z-50 bg-black ">
                          <div className="bg-[#8F87F1] p-6 rounded-lg w-150 h-100  relative shadow-lg">
                            {/* Close Button */}
                            <button
                              className="absolute -top-5 -right-10 text-white cursor-pointer"
                              onClick={handleClosePopup}
                            >
                              <RxCross1
                                size={30}
                                className="font-bold ml-5 text-white"
                              />
                            </button>

                            {/* Form Content */}
                            <IoIosArrowUp className="text-white text-[65px] ml-60 " />

                            <h2 className="text-xl font-bold mb-4 text-center text-white">
                              Please update your details
                            </h2>
                            <input
                              type="text"
                              placeholder="Name"
                              className="w-full  p-2 rounded mb-3 text-white border-b-2 border-b-white font-bold mt-2 outline-none"
                            />
                            <input
                              type="email"
                              placeholder="Email"
                              className="w-full  p-2 rounded mb-3 text-white border-b-2 border-b-white font-bold mt-2 outline-none"
                            />
                            <input
                              type="tel"
                              placeholder="Phone"
                              className="w-full  p-2 rounded mb-3 text-white border-b-2 border-b-white font-bold  border-b-black outline-none text-[15px] mt-2"
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
                <div className="mt-5 w-300 ml-10 text-white">
                  {" "}
                  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
                </div>
                <div className=" p-6 bg-[#2a1035]  relative  ">
                  <h2 className="text-[30px] text-pink-400 mb-4  font-bold ml-8 ">
                    Testimonial
                  </h2>

                  {/* Slider Container */}
                  <div className="flex items-center justify-center  overflow-hidden relative  h-110">
                    {/* Left Button */}
                    <button
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#533562] text-white p-2 rounded-full z-20 "
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
                      className="flex transition-transform duration-1000 ease-in-out h-90 absolute left-0"
                      style={{ transform: `translateX(-${index * 41.5}rem)` }}
                    >
                      {testimonials.map((testimonial, i) => (
                        <div
                          key={i}
                          className="w-[38rem] bg-[#341544] border rounded-4xl shadow-md flex-shrink-0 py-6 px-10 mx-7 relative"
                        >
                          <img
                            src={TM_quotes}
                            alt=""
                            className="w-35 absolute top-[-18%] left-[76%]"
                          />
                          {/* Star Ratings */}
                          <div className="flex text-yellow-400 mb-2 text-2xl">
                            {"★".repeat(testimonial.rating)}
                          </div>

                          {/* Testimonial Text */}
                          <p className="text-[16px] text-white">
                            {testimonial.text}
                          </p>

                          {/* User Info */}
                          <div className="flex items-center mt-4 gap-4">
                            <img
                              src={testimonial.image}
                              alt="User"
                              className="w-[50px] h-[50px] rounded-full object-cover border-2 border-white mt-3"
                            />
                            <div className="text-left">
                              <p className="text-white font-semibold text-[22px]">
                                {testimonial.name}
                              </p>
                              <p className="text-white text-sm">
                                From: {testimonial.location}
                              </p>
                            </div>
                          </div>

                          <hr className="text-white mt-5" />

                          {/* RM & Plan Details */}
                          <div className="mt-5 flex text-gray-400 text-sm gap-2 items-center">
                            <span className="bg-[#45234e] p-3 rounded-full text-sm ">
                              Assisted RM:{" "}
                              <span className="text-white">
                                {testimonial.rm}
                              </span>
                            </span>
                            <span className="bg-[#45234e] px-3 py-1.5 rounded-full text-sm flex items-center gap-1">
                              Plan:{" "}
                              <span className="text-2xl">
                                {testimonial.smily}
                              </span>
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
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#533562] text-white p-2 rounded-full"
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
              <div className="flex justify-center items-center">
                <div className="bg-[#2a1035] w-[1300px] h-[320px] relative rounded-lg p-6 shadow-lg overflow-hidden">
                  <h2 className="text-[30px] text-pink-400 font-bold ml-8">
                    Featured In
                  </h2>
                  <div className="flex items-center justify-center w-[1090px] overflow-hidden relative mt-4">
                    {/* Left Button */}
                    <button
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#533562] text-white p-3 rounded-full z-50"
                      onClick={() =>
                        setExtraIndex((prev) =>
                          prev === 0 ? extraSliderItems.length - 3 : prev - 1
                        )
                      }
                    >
                      <ChevronLeft size={25} className="cursor-pointer" />
                    </button>

                    {/* Slider Wrapper */}
                    <div className="w-[1050px] h-[250px] overflow-hidden mx-auto">
                      {/* Slider Content */}
                      <div
                        className="flex transition-transform duration-500 ease-in-out gap-6 h-[250px]"
                        style={{
                          transform: `translateX(-${
                            extraIndex * (400 + 24)
                          }px)`, // 400px card width + 24px gap (6*4)
                        }}
                      >
                        {extraSliderItems.map((item, i) => (
                          <div
                            key={i}
                            className="w-[400px] p-4 px-8 bg-[#341544] rounded-2xl shadow-md flex-shrink-0 h-[200px] mt-5"
                          >
                            <span className="flex justify-between h-15">
                              {item.img}
                              <p className="text-[14px] text-white mt-3 mr-5">
                                {item.date}
                              </p>
                            </span>
                            <p className="text-[14px] text-white font-bold">
                              {item.text}
                            </p>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-200 underline block px-1 mt-2"
                            >
                              <span className="flex items-center">
                                Read now
                                <RiExternalLinkFill className="ml-1 cursor-pointer" />
                              </span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Button */}
                    <button
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#533562] text-white p-3 rounded-full z-50 cursor-pointer"
                      onClick={() =>
                        setExtraIndex((prev) =>
                          prev >= extraSliderItems.length - 2 ? 0 : prev + 1
                        )
                      }
                    >
                      <ChevronRight size={25} />
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
      </div>
    </>
  );
}
