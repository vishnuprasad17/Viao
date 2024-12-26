import React, { useState, useEffect } from 'react';
import { SlArrowUp } from "react-icons/sl";

const ScrollToTopBtn: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-2 rounded-full bg-yellow-500 text-deep-purple-400 shadow-md z-50 transition-all duration-300 transform ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
      } hover:scale-105 hover:shadow-pink-500/50`}
      aria-label="Scroll to top"
    >
      <span className="text-lg animate-bounce">
        <SlArrowUp />
      </span>
    </button>
  );
};

export default ScrollToTopBtn;