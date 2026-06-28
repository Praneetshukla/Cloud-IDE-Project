import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { validateSignupForm } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Divider from '../common/Divider';
import OAuthButtons from './OAuthButtons';

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
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Create your account
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Start building in the cloud with Orbit
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} className="mb-5" />
      )}

      <OAuthButtons />

      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Full Name"
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="John Doe"
          error={errors.name}
          touched={touched.name}
          icon={HiOutlineUser}
          autoComplete="name"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="you@example.com"
          error={errors.email}
          touched={touched.email}
          icon={HiOutlineMail}
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Min. 8 characters"
          error={errors.password}
          touched={touched.password}
          icon={HiOutlineLockClosed}
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Re-enter your password"
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
          icon={HiOutlineLockClosed}
          autoComplete="new-password"
          required
        />

        <div className="pt-1">
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
