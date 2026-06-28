import AuthLayout from '../../layouts/AuthLayout';
import SignupForm from '../../components/auth/SignupForm';

/**
 * Signup page — wraps SignupForm in AuthLayout.
 */
const SignupPage = () => {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
};

export default SignupPage;
