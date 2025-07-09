import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Jab bhi route change ho, page top pe chala jayega
  }, [pathname]);

  return null;
};

export default ScrollToTop;
