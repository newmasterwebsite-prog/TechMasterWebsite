import React from 'react';

export const Select = ({
  label,
  options = [], // [{ value, label }] or strings
  value,
  onChange,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase flex items-center gap-0.5">
          {label}
          {required && <span className="text-luxury-gold">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        className={`w-full bg-zinc-950/60 border border-zinc-800 rounded-md px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/30 transition-all duration-300 ${error ? 'border-rose-500/50' : ''} ${className}`}
        required={required}
        {...props}
      >
        {options.map((opt, i) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={i} value={val} className="bg-zinc-950 text-zinc-100">
              {lbl}
            </option>
          );
        })}
      </select>

      {error && <span className="text-xs text-rose-400 mt-1">{error}</span>}
    </div>
  );
};
