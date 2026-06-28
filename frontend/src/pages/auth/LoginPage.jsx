import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';

/**
 * Login page — wraps LoginForm in AuthLayout.
 */
const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
