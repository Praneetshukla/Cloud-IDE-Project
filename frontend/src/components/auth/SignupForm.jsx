import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { validateSignupForm } from '../../utils/validators';
import { OrbitSurface } from './OrbitSurface';
import { OrbitInput } from './OrbitInput';
import { OrbitButton } from './OrbitButton';
import { OrbitOAuth } from './OrbitOAuth';
import Alert from '../common/Alert';

/**
 * Signup form with name, email, password, confirm password, OAuth, and validation.
 */
const SignupForm = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, isAuthenticated, clearError } = useAuth();

  const { values, errors, touched, handleChange, handleBlur, validate } =
    useForm(
      { name: '', email: '', password: '', confirmPassword: '' },
      validateSignupForm
    );

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
    signup(values);
  };

  return (
    <OrbitSurface className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-[32px] font-semibold text-text-primary tracking-tight leading-tight mb-2">
          Create account
        </h2>
        <p className="text-sm md:text-[17px] text-text-secondary font-medium">
          Start building in the cloud with Orbit.
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} className="mb-6" />
      )}

      {/* Form */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        <OrbitInput
          id="name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && errors.name}
          autoComplete="name"
          required
        />

        <OrbitInput
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          autoComplete="email"
          required
        />

        <OrbitInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••••••"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password && errors.password}
          autoComplete="new-password"
          required
        />

        <OrbitInput
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••••••"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.confirmPassword && errors.confirmPassword}
          autoComplete="new-password"
          required
        />

        <OrbitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
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
        <p className="text-[13px] text-text-secondary font-medium font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-text-primary hover:text-accent transition-colors duration-fast font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </OrbitSurface>
  );
};

export default SignupForm;
