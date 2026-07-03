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
        className={`h-[46px] rounded-lg px-4 bg-[#010204]/80 hover:bg-[#010204] focus-visible:bg-[#010204] text-input text-text-primary border transition-all duration-fast shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] ${error ? 'border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/50' : 'border-white/10 hover:border-white/20 focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent/50'} outline-none`}
        {...props}
      />
      {error && (
        <span className="text-label text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
};
