import AuthLayout from '../../layouts/AuthLayout';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

/**
 * Reset password page — accessed via email link with token.
 */
const ResetPasswordPage = () => {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
