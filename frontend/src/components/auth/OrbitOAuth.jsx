import React from 'react';
import { OrbitButton } from './OrbitButton';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { API_BASE_URL } from '../../utils/constants';

export const OrbitOAuth = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <div className="flex gap-4 w-full">
      <OrbitButton 
        type="button"
        variant="secondary" 
        onClick={handleGoogleLogin}
        className="flex-1 gap-2 group hover:border-[#4285F4]/30 hover:shadow-[0_0_12px_rgba(66,133,244,0.12)] cursor-pointer" 
        aria-label="Continue with Google"
      >
        <FcGoogle className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all duration-normal" aria-hidden="true" />
        Google
      </OrbitButton>
      <OrbitButton 
        type="button"
        variant="secondary" 
        onClick={handleGithubLogin}
        className="flex-1 gap-2 group hover:border-white/20 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] cursor-pointer" 
        aria-label="Continue with GitHub"
      >
        <FaGithub className="w-5 h-5 text-text-secondary group-hover:text-white transition-all duration-normal" aria-hidden="true" />
        GitHub
      </OrbitButton>
    </div>
  );
};

