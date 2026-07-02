import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { validateLoginForm } from '../../utils/validators';
import { OrbitSurface } from './OrbitSurface';
import { OrbitInput } from './OrbitInput';
import { OrbitButton } from './OrbitButton';
import { OrbitOAuth } from './OrbitOAuth';
import Alert from '../common/Alert';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();
  const [rememberMe, setRememberMe] = useState(true);

  const { values, errors, touched, handleChange, handleBlur, validate } =
    useForm({ email: '', password: '' }, validateLoginForm);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    login(values);
  };

  return (
    <OrbitSurface className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-[32px] font-semibold text-text-primary tracking-tight leading-tight mb-2">
          Welcome back
        </h2>
        <p className="text-sm md:text-[17px] text-text-secondary font-medium">
          Sign in to your Orbit workspace.
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} className="mb-6" />
      )}

      {/* Form */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <OrbitInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="name@company.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          autoComplete="email"
          required
        />
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-label font-medium text-text-secondary">
              Password
            </label>
            <Link to="/forgot-password" className="text-label text-text-secondary hover:text-text-primary transition-colors duration-fast">
              Forgot password?
            </Link>
          </div>
          <OrbitInput
            id="password"
            name="password"
            type="password"
            placeholder="••••••••••••"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="flex items-center gap-3 group py-2">
          <div className="relative flex items-center justify-center">
            <input 
              id="remember-me"
              type="checkbox" 
              className="peer appearance-none w-4 h-4 rounded-[4px] bg-background border border-border checked:bg-accent checked:border-accent transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface cursor-pointer"
              checked={rememberMe}
              onChange={(e) => setRememberMe(!rememberMe)}
            />
            <svg className="absolute pointer-events-none text-white w-3 h-3 opacity-0 peer-checked:opacity-100 transition-opacity duration-fast" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <label htmlFor="remember-me" className="text-label font-medium text-text-secondary group-hover:text-text-primary transition-colors duration-fast cursor-pointer select-none">
            Remember me
          </label>
        </div>

        <OrbitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </OrbitButton>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-border"></div>
        <span className="text-label text-text-secondary font-medium select-none whitespace-nowrap">or continue with</span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-border to-transparent"></div>
      </div>

      <OrbitOAuth />

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-border/50 text-center">
        <p className="text-[13px] text-text-secondary font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-text-primary hover:text-accent transition-colors duration-fast">
            Create account
          </Link>
        </p>
      </div>
    </OrbitSurface>
  );
};

export default LoginForm;