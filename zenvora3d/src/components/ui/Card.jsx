import React from 'react';

export const Card = ({
  children,
  title,
  subtitle,
  actions,
  hoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`glass-panel rounded-lg p-5 shadow-card-glow ${
        hoverable ? 'glass-panel-hover' : ''
      } ${className}`}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-4 flex-wrap gap-2">
          <div>
            {title && (
              <h3 className="font-serif text-lg font-medium text-zinc-100 tracking-wide">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-zinc-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div>
        {children}
      </div>
    </div>
  );
};
