import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300 || window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility(); // Check initial scroll position

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if ((window as any).lenis) {
      try {
        (window as any).lenis.scrollTo(0, { duration: 1.2 });
      } catch (e) {}
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={handleScrollToTop}
          aria-label="Scroll to top"
          title="Scroll to Top"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9990] w-12 h-12 rounded-full bg-black/80 hover:bg-gold border border-gold/40 hover:border-gold text-gold hover:text-black backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all duration-300 flex items-center justify-center cursor-pointer group hover:scale-110 active:scale-95"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
