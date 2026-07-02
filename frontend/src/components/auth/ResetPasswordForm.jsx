import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { validatePassword, validateConfirmPassword } from '../../utils/validators';
import { OrbitSurface } from './OrbitSurface';
import { OrbitInput } from './OrbitInput';
import { OrbitButton } from './OrbitButton';
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
    <OrbitSurface className="p-16 sm:p-24 md:p-32">
      <Link
        to="/login"
        className="inline-flex items-center gap-8 text-label text-text-secondary hover:text-text-primary transition-colors duration-fast mb-24 cursor-pointer"
      >
        <HiArrowLeft className="h-16 w-16" />
        Back to login
      </Link>

      <div className="mb-32">
        <h2 className="text-2xl md:text-[32px] font-semibold text-text-primary tracking-tight leading-tight mb-8">
          Set new password
        </h2>
        <p className="text-sm md:text-[17px] text-text-secondary font-medium">
          Choose a strong password for your account.
        </p>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={clearError} className="mb-24" />
      )}
      {message && (
        <Alert
          type="success"
          message={`${message} Redirecting to login...`}
          className="mb-24"
        />
      )}

      {!message && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-24" noValidate>
          <OrbitInput
            id="password"
            name="password"
            type="password"
            label="New Password"
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
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </OrbitButton>
        </form>
      )}
    </OrbitSurface>
  );
};

export default ResetPasswordForm;
