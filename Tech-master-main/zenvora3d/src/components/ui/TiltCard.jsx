import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

export const TiltCard = ({
  children,
  className = '',
  maxTilt = 10, // Max rotation angle in degrees
  glowColor = 'rgba(212, 175, 55, 0.12)', // Gold glow color
  ...props
}) => {
  const cardRef = useRef(null);

  // Motion values for tracking angles
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Smooth springs to avoid jittering
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  // Glow position indicators
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Mouse coords relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize coordinates from -0.5 to 0.5
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;

    // Apply tilt values (rotateX is based on vertical, rotateY on horizontal)
    rotateX.set(-normalizedY * maxTilt);
    rotateY.set(normalizedX * maxTilt);

    // Track glow overlay position
    setGlowPos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: smoothRotateX,
        rotateY: smoothRotateY,
      }}
      animate={{
        scale: isHovered ? 1.015 : 1,
        z: isHovered ? 30 : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`glass-panel rounded-lg p-5 shadow-card-glow border border-zinc-800/80 relative overflow-hidden transition-all duration-300 ${className}`}
      {...props}
    >
      {/* 3D Reflection/Glow Effect */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle 120px at ${glowPos.x}px ${glowPos.y}px, ${glowColor}, transparent 80%)`,
            mixBlendMode: 'screen',
            zIndex: 1
          }}
        />
      )}

      {/* Content wrapper with perspective translation */}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
