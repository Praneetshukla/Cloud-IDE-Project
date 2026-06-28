/**
 * "Or continue with" divider for auth forms.
 */
const Divider = ({ text = 'Or continue with' }) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-[var(--color-border)]" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-[var(--color-bg-card)] text-[var(--color-text-tertiary)]">
          {text}
        </span>
      </div>
    </div>
  );
};

export default Divider;
