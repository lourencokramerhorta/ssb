/**
 * Validation Utilities
 * 
 * Common validation functions for forms and user input
 */

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * Returns an object with validation result and message
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters',
    };
  }

  if (password.length > 72) {
    return {
      isValid: false,
      message: 'Password must be less than 72 characters',
    };
  }

  return {
    isValid: true,
    message: '',
  };
}

/**
 * Validates email and returns error message if invalid
 */
export function validateEmail(email: string): {
  isValid: boolean;
  message: string;
} {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      message: 'Email is required',
    };
  }

  if (!isValidEmail(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address',
    };
  }

  return {
    isValid: true,
    message: '',
  };
}

