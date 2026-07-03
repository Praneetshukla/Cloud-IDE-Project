import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { validateEmail } from '../../utils/validators';
import { OrbitSurface } from './OrbitSurface';
import { OrbitInput } from './OrbitInput';
import { OrbitButton } from './OrbitButton';
import Alert from '../common/Alert';

/**
 * Forgot password form — sends password reset email.
 */
const ForgotPasswordForm = () => {
  const { forgotPassword, isLoading, error, message, clearError, clearMessage } = useAuth();

  const { values, errors, touched, handleChange, handleBlur, validate } =
    useForm({ email: '' }, (vals) => {
      const errs = {};
      const emailErr = validateEmail(vals.email);
      if (emailErr) errs.email = emailErr;
      return errs;
    });

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    forgotPassword(values.email);
  };

  return (
    <OrbitSurface className="p-4 sm:p-6 md:p-8">
      <Link
        to="/login"
        className="inline-flex items-center gap-2 text-label text-text-secondary hover:text-text-primary transition-colors duration-fast mb-6 cursor-pointer"
      >
        <HiArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <div className="mb-8">
        <h2 className="text-2xl md:text-[32px] font-semibold text-text-primary tracking-tight leading-tight mb-2">
          Forgot password?
        </h2>
        <p className="text-sm md:text-[17px] text-text-secondary font-medium">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} className="mb-6" />
      )}
      {message && (
        <Alert type="success" message={message} onClose={clearMessage} className="mb-6" />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
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

        <OrbitButton type="submit" disabled={isLoading}>
          {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
        </OrbitButton>
      </form>
    </OrbitSurface>
  );
};

export default ForgotPasswordForm;
