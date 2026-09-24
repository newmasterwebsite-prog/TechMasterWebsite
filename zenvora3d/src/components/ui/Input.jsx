import React from 'react';

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  className = '',
  textarea = false,
  rows = 4,
  ...props
}) => {
  const inputClass = `w-full bg-zinc-950/60 border border-zinc-800 rounded-md px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/30 transition-all duration-300 ${error ? 'border-rose-500/50 focus:ring-rose-500/20' : ''} ${className}`;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase flex items-center gap-0.5">
          {label}
          {required && <span className="text-luxury-gold">*</span>}
        </label>
      )}
      
      {textarea ? (
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClass}
          required={required}
          {...props}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClass}
          required={required}
          {...props}
        />
      )}

      {error && <span className="text-xs text-rose-400 mt-1">{error}</span>}
    </div>
  );
};
