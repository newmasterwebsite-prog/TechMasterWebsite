import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface LuxuryCardProps {
  children: React.ReactNode;
  accentColor?: string;
  className?: string;
  onClick?: () => void;
  index?: number;
}

export const LuxuryCard: React.FC<LuxuryCardProps> = ({
  children,
  accentColor = "#D4AF37",
  className = "",
  onClick,
  index = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinate motion values for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth movement
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    damping: 20,
    stiffness: 150,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    damping: 20,
    stiffness: 150,
  });

  // Spotlight position state for radial hover glow
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates (-0.5 to 0.5)
    const relX = (e.clientX - rect.left) / width - 0.5;
    const relY = (e.clientY - rect.top) / height - 0.5;

    x.set(relX);
    y.set(relY);

    // Spotlight coordinates (px)
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      style={{
        perspective: 1000,
      }}
      className={`relative w-full ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className="glass-panel p-8 md:p-10 rounded-3xl text-left relative group transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-between h-full hover:border-white/20 select-none"
        // Add box shadow glow using filter/boxShadow properties dynamically
        animate={{
          boxShadow: isHovered
            ? `0 20px 40px rgba(0,0,0,0.6), 0 0 25px ${accentColor}15`
            : "0 10px 30px rgba(0,0,0,0.4), 0 0 0px rgba(0,0,0,0)",
          scale: isHovered ? 1.02 : 1.0,
        }}
        transition={{ duration: 0.4 }}
      >
        {/* Spotlight dynamic hover glow background */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(400px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${accentColor}0e, transparent 70%)`,
          }}
        />

        {/* Shimmer light sweep line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div
            className="absolute top-0 left-[-200%] w-[50%] h-full transition-transform duration-[1.2s] ease-in-out skew-x-[-25deg]"
            style={{
              background: `linear-gradient(to right, transparent, rgba(255,255,255,0.05) 50%, transparent)`,
              transform: isHovered ? "translateX(600%)" : "none",
            }}
          />
        </div>

        {/* 3D floating layered content */}
        <div style={{ transform: "translateZ(30px)" }} className="relative z-10 flex flex-col h-full justify-between">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};
