import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiOutlineLockClosed, HiArrowLeft } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { validatePassword, validateConfirmPassword } from '../../utils/validators';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';

/**
 * Reset password form — sets a new password using the token from the email link.
 */
const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, message, clearError, clearMessage } = useAuth();

  const { values, errors, touched, handleChange, handleBlur, validate } =
    useForm({ password: '', confirmPassword: '' }, (vals) => {
      const errs = {};
      const pwErr = validatePassword(vals.password);
      if (pwErr) errs.password = pwErr;
      const confirmErr = validateConfirmPassword(vals.password, vals.confirmPassword);
      if (confirmErr) errs.confirmPassword = confirmErr;
      return errs;
    });

  useEffect(() => {
    return () => {
      clearError();
      clearMessage();
    };
  }, [clearError, clearMessage]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    resetPassword({
      token,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
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
          Set new password
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Choose a strong password for your account.
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} className="mb-5" />
      )}
      {message && (
        <Alert
          type="success"
          message={`${message} Redirecting to login...`}
          className="mb-5"
        />
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="New Password"
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

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Reset Password
          </Button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordForm;
