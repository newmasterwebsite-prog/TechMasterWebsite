import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, ghost
  size = 'md', // sm, md, lg
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-luxury-gold/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed glow-btn";
  
  const variants = {
    primary: "bg-luxury-gold/10 hover:bg-luxury-gold/20 border border-luxury-gold/30 hover:border-luxury-gold/60 text-white shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] backdrop-blur-md",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-luxury-gold/30 backdrop-blur-md",
    danger: "bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/30 hover:border-rose-500/60 text-white backdrop-blur-md",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800/30"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3.5 text-base"
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};
