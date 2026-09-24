import React from 'react';
import { motion } from 'framer-motion';

export const Floating3DShapes = () => {
  // Configured floating shapes representing luxury shards & assets
  const shapes = [
    // Golden Pyramid Shard (Top Right)
    {
      style: { top: '15%', right: '15%', width: '120px', height: '120px' },
      animate: {
        y: [0, -25, 0],
        rotateX: [0, 360],
        rotateY: [0, 180],
        rotateZ: [0, 360],
      },
      transition: { duration: 18, repeat: Infinity, ease: "linear" },
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-[0.06] drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
          <polygon points="50,15 15,80 85,80" fill="url(#goldGrad)" stroke="#d4af37" strokeWidth="0.5" />
          <line x1="50" y1="15" x2="50" y2="80" stroke="#f5e3a5" strokeWidth="0.5" />
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    // Glassmorphic Ring (Bottom Left)
    {
      style: { bottom: '20%', left: '10%', width: '160px', height: '160px' },
      animate: {
        y: [0, 30, 0],
        rotateX: [0, 180],
        rotateY: [0, 360],
        rotateZ: [360, 0],
      },
      transition: { duration: 25, repeat: Infinity, ease: "linear" },
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-[0.05] drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <circle cx="50" cy="50" r="35" fill="none" stroke="url(#glassGrad)" strokeWidth="8" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <defs>
            <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    // Emerald Luxury Prism (Center Right)
    {
      style: { top: '50%', right: '5%', width: '90px', height: '90px' },
      animate: {
        y: [0, -15, 0],
        rotateX: [180, 0],
        rotateY: [0, 360],
        rotateZ: [0, 180],
      },
      transition: { duration: 15, repeat: Infinity, ease: "linear" },
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-[0.04] drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <polygon points="50,10 90,50 50,90 10,50" fill="url(#emeraldGrad)" stroke="rgba(16,185,129,0.5)" strokeWidth="0.5" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
          <defs>
            <linearGradient id="emeraldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    // Golden Diamond Shard (Top Left)
    {
      style: { top: '10%', left: '25%', width: '70px', height: '70px' },
      animate: {
        y: [0, 20, 0],
        rotateX: [0, 360],
        rotateY: [360, 0],
      },
      transition: { duration: 12, repeat: Infinity, ease: "linear" },
      svg: (
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-[0.06] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <polygon points="50,15 80,50 50,85 20,50" fill="none" stroke="#d4af37" strokeWidth="1" />
          <polygon points="50,25 70,50 50,75 30,50" fill="url(#goldGrad)" opacity="0.3" />
        </svg>
      )
    }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 perspective-[1000px] preserve-3d">
      {shapes.map((shape, idx) => (
        <motion.div
          key={idx}
          style={{ position: 'absolute', ...shape.style, transformStyle: 'preserve-3d' }}
          animate={shape.animate}
          transition={shape.transition}
        >
          {shape.svg}
        </motion.div>
      ))}
    </div>
  );
};
