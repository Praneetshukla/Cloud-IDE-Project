import { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { cn } from '../../utils/helpers';

/**
 * Reusable form input with label, error display, icon, and password toggle.
 */
const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  icon: Icon = null,
  disabled = false,
  required = false,
  className = '',
  autoComplete,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;
  const hasError = touched && error;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]">
            <Icon className="h-4.5 w-4.5" />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            'w-full rounded-lg border px-4 py-2.5 text-sm transition-all duration-200',
            'bg-[var(--color-bg-input)] text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-tertiary)]',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && 'pl-10',
            isPasswordField && 'pr-10',
            hasError
              ? 'border-red-500 focus:ring-red-500/40 focus:border-red-500'
              : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
          )}
          {...props}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
            tabIndex={-1}
          >
            {showPassword ? (
              <HiEyeOff className="h-4.5 w-4.5" />
            ) : (
              <HiEye className="h-4.5 w-4.5" />
            )}
          </button>
        )}
      </div>

      {hasError && (
        <p className="mt-1.5 text-xs text-red-500 animate-fade-in-down">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
