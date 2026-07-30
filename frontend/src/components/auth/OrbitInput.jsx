import React, { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export const OrbitInput = ({ 
  id, 
  type = 'text', 
  label, 
  error,
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const currentType = isPasswordField && showPassword ? 'text' : type;

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
      <div className="relative flex items-center">
        <input
          id={id}
          type={currentType}
          className={`w-full h-[46px] rounded-lg px-4 ${isPasswordField ? 'pr-12' : ''} bg-[#010204]/40 hover:bg-[#010204]/60 focus-visible:bg-[#010204]/80 text-input text-text-primary border transition-all duration-300 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] ${error ? 'border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/50' : 'border-transparent hover:border-white/10 focus-visible:border-accent focus-visible:shadow-[inset_0_2px_5px_rgba(0,0,0,0.8),0_0_15px_rgba(60,111,219,0.3)]'} outline-none`}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 flex items-center justify-center text-text-tertiary hover:text-text-secondary transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <HiEyeOff className="w-5 h-5" />
            ) : (
              <HiEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <span className="text-label text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
};
