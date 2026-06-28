import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiArrowLeft } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { validateEmail } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
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
    <div className="w-full max-w-md animate-fade-in-up">
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]
          hover:text-[var(--color-text-primary)] transition-colors mb-8"
      >
        <HiArrowLeft className="h-4 w-4" />
        Back to login
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
          Forgot password?
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} className="mb-5" />
      )}
      {message && (
        <Alert type="success" message={message} onClose={clearMessage} className="mb-5" />
      )}

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

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
