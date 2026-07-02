import React from 'react';

export const OrbitInput = ({ 
  id, 
  type = 'text', 
  label, 
  error,
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-2 group">
      {label && (
        <label 
          htmlFor={id} 
          className="text-label font-medium text-text-secondary group-focus-within:text-text-primary transition-colors duration-fast"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`h-[46px] rounded-lg px-4 bg-background/50 hover:bg-white/[0.01] focus-visible:bg-white/[0.02] text-input text-text-primary border transition-all duration-fast shadow-neon-input ${error ? 'border-red-500 focus-visible:ring-red-500/20' : 'border-border focus-visible:border-accent/80 focus-visible:ring-4 focus-visible:ring-accent/15'} outline-none`}
        {...props}
      />
      {error && (
        <span className="text-label text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
};
