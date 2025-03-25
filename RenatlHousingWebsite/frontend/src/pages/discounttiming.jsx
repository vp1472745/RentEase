import React, { useEffect, useState } from "react";
import discount from "../assets/discount.png";
const CountdownTimer = () => {
  const totalTime = 30 * 60; // 1 hour (in seconds)
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [offerExpired, setOfferExpired] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setOfferExpired(true);
      setTimeout(() => {
        setTimeLeft(totalTime);
        setOfferExpired(false);
      }, 3000);
    }
  }, [timeLeft]);

  const percentageLeft = (timeLeft / totalTime) * 100;
  const percentageFilled = 100 - percentageLeft;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const buttons = [
    { discount: "10%", width: "70px", height: "28px", range: [66.66, 100] },
    {
      discount: "30% OFF",
      width: "140px",
      height: "28px",
      range: [33.33, 66.66],
    },
    { discount: "50% OFF", width: "190px", height: "28px", range: [0, 33.33] },
  ];

  const getButtonFill = (range) => {
    if (percentageFilled >= range[1]) return 0;
    if (percentageFilled <= range[0]) return 100;
    return ((range[1] - percentageFilled) / (range[1] - range[0])) * 100;
  };

  const getProgressColor = () => {
    if (percentageFilled >= 66.66) return "red";
    if (percentageFilled >= 33.33) return "#FFD700";
    return "#16a34a";
  };

  return (
    <div className="p-4 text-white text-center rounded-lg w-[460px] mx-auto ml-6">
      <div className="relative p-2 h-20">
        <p className="flex items-center justify-center space-x-2">
          {offerExpired ? (
            <div className="text-[15px] font-semibold py-2 flex items-center">
              Oops. You missed our 50% discount offer!
            </div>
          ) : (
            <>
              <div className="text-[15px] font-semibold py-2  flex">
                <img src={discount} alt="" className="w-6 h-6  mt-1" />
                <span className="ml-2 text-[15px] ">
                  {" "}
                  Hurry! Purchase a plan before your exclusive discount
                </span>
              </div>
              <div className="mt-15 mr-72 absolute text-[15px] font-semibold ">
                expires!
              </div>
              <div
                className="px-2 rounded-lg text-sm mt-15 mr-40 absolute"
                style={{
                  background: "#16a34a",
                  color: "black",
                  transition: "background 0.5s ease-in-out",
                }}
              >
                {formatTime(timeLeft)}
              </div>
            </>
          )}
        </p>
      </div>

      <div className="relative  w-full ">
        <div className="relative h-8 flex items-center justify-center">
          <div className="absolute left-0 h-2 w-full bg-gray-300 rounded-lg"></div>
          <div
            className="absolute left-0 h-2 rounded-lg"
            style={{
              width: `${percentageLeft}%`,
              background: getProgressColor(),
              transition: "width 0.5s ease-in-out, background 0.5s ease-in-out",
            }}
          ></div>
          <div className="absolute flex w-full justify-between items-center">
            {buttons.map(({ discount, width, height, range }, index) => {
              const fill = getButtonFill(range);
              let buttonBg = "gray";

              if (index === 0) {
                if (percentageFilled < 33.33) {
                  buttonBg = "#16a34a";
                } else if (
                  percentageFilled >= 33.33 &&
                  percentageFilled < 66.66
                ) {
                  buttonBg = "#FFD700";
                } else if (percentageFilled >= 66.66) {
                  const redToGrayFill =
                    ((percentageFilled - 66.66) / (100 - 66.66)) * 100;
                  buttonBg = `linear-gradient(to right, red ${
                    100 - redToGrayFill
                  }%, gray ${100 - redToGrayFill}%)`;
                }
              } else if (index === 1) {
                if (percentageFilled < 33.33) {
                  buttonBg = "#16a34a";
                } else if (
                  percentageFilled >= 33.33 &&
                  percentageFilled < 66.66
                ) {
                  buttonBg = `linear-gradient(to right, #FFD700 ${fill}%, gray ${fill}%)`;
                } else if (percentageFilled >= 66.66) {
                  buttonBg = "gray";
                }
              }

              const isThirdButton = index === 2;

              return (
                <div
                  key={discount}
                  className="text-white font-bold rounded-md border-2 border-white relative overflow-hidden flex items-center justify-center"
                  style={{
                    width: width,
                    height: height,
                    background: isThirdButton
                      ? `linear-gradient(to right, #16a34a ${fill}%, gray ${fill}%)`
                      : buttonBg,
                    cursor: fill < 100 ? "not-allowed" : "pointer",
                    transition:
                      "background 0.5s ease-in-out, opacity 0.5s ease-in-out",
                  }}
                >
                  <span className="relative z-10">{discount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
