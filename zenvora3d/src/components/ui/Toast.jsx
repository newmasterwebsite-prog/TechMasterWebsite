import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const { message, type = 'success', id } = toast;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-zinc-950/90 text-emerald-200',
    error: 'border-rose-500/30 bg-zinc-950/90 text-rose-200',
    info: 'border-amber-500/30 bg-zinc-950/90 text-amber-200'
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ${borders[type]}`}>
      {icons[type]}
      <span className="text-xs font-medium tracking-wide">{message}</span>
      <button 
        onClick={() => onClose(id)} 
        className="ml-2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
