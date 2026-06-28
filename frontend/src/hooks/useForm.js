import { useState, useCallback } from 'react';

/**
 * Generic form state management hook with per-field validation.
 *
 * @param {object} initialValues - Default form field values.
 * @param {Function} validateFn - Function that receives values and returns errors object.
 * @returns {object} Form state and handlers.
 */
const useForm = (initialValues = {}, validateFn = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate single field on blur
    if (validateFn) {
      const allErrors = validateFn(values);
      if (allErrors[name]) {
        setErrors((prev) => ({ ...prev, [name]: allErrors[name] }));
      }
    }
  }, [values, validateFn]);

  const validate = useCallback(() => {
    if (!validateFn) return true;
    const validationErrors = validateFn(values);
    setErrors(validationErrors);
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    return Object.keys(validationErrors).length === 0;
  }, [values, validateFn]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setFieldValue,
    setFieldError,
    setValues,
    setErrors,
  };
};

export default useForm;
