import React from 'react';

export const Badge = ({
  children,
  variant = 'default', // default, gold, success, warning, danger, info
  className = ''
}) => {
  const styles = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    gold: "bg-luxury-gold/10 text-luxury-gold border-luxury-gold/25",
    success: "bg-emerald-950/30 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-950/30 text-amber-400 border-amber-500/20",
    danger: "bg-rose-950/30 text-rose-400 border-rose-500/20",
    info: "bg-blue-950/30 text-blue-400 border-blue-500/20"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
