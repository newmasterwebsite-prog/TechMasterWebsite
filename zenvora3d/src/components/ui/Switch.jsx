import React from 'react';
import { motion } from 'framer-motion';

export const Switch = ({
  checked,
  onChange,
  disabled = false,
  label = '',
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onChange(!checked);
        }}
        className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-all duration-300 flex items-center ${
          checked 
            ? 'bg-luxury-gold/25 border border-luxury-gold/40' 
            : 'bg-zinc-950/40 border border-zinc-850'
        } ${disabled ? 'opacity-45 cursor-not-allowed' : ''}`}
      >
        <motion.div
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="w-4.5 h-4.5 rounded-full shadow-md bg-white"
          style={{ x: checked ? '18px' : '2px' }}
        />
      </div>
      {label && (
        <span className={`text-xs font-semibold uppercase tracking-wider ${checked ? 'text-luxury-gold' : 'text-zinc-500'}`}>
          {label}
        </span>
      )}
    </div>
  );
};
