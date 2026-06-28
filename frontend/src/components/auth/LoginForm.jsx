import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { validateLoginForm } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Divider from '../common/Divider';
import OAuthButtons from './OAuthButtons';

/**
 * Login form with email/password, OAuth, and forgot password link.
 */
const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuth();

  const { values, errors, touched, handleChange, handleBlur, validate } =
    useForm(
      { email: '', password: '' },
      validateLoginForm
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
    login(values);
  };

  return (
    <div className="w-full max-w-md animate-fade-in-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Welcome back
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Sign in to your Orbit workspace
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} className="mb-5" />
      )}

      <OAuthButtons />

      <Divider />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          placeholder="Enter your password"
          error={errors.password}
          touched={touched.password}
          icon={HiOutlineLockClosed}
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-500 hover:text-indigo-400 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-semibold text-indigo-500 hover:text-indigo-400 transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
