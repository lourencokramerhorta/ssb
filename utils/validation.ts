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

/**
 * Parses rate limit errors from Supabase
 * Extracts the wait time from error messages like "For security purposes, you can only request this after X seconds"
 * 
 * @param errorMessage - The error message from Supabase
 * @returns Object with isRateLimit flag and waitTime in seconds, or null if not a rate limit error
 */
export function parseRateLimitError(errorMessage: string): {
  isRateLimit: boolean;
  waitTime: number;
  userFriendlyMessage: string;
} | null {
  if (!errorMessage) {
    return null;
  }
  
  // Patterns with time extraction (ordered by specificity)
  const timeExtractionPatterns = [
    /for security purposes, you can only request this after (\d+) seconds?/i,
    /wait (\d+) seconds?/i,
    /try again in (\d+) seconds?/i,
    /please wait (\d+) seconds?/i,
    /(\d+) seconds?/i, // Generic pattern as fallback
  ];

  // Patterns without time (generic rate limit indicators)
  const genericRateLimitPatterns = [
    /rate limit/i,
    /too many requests/i,
  ];

  // First, try to extract time from specific patterns
  for (const pattern of timeExtractionPatterns) {
    const match = errorMessage.match(pattern);
    if (match && match[1]) {
      const waitTime = parseInt(match[1], 10);
      if (!isNaN(waitTime) && waitTime > 0) {
        return {
          isRateLimit: true,
          waitTime,
          userFriendlyMessage: `Please wait ${waitTime} second${waitTime !== 1 ? 's' : ''} before trying again. This helps us protect your account.`,
        };
      }
    }
  }

  // If no time found, check for generic rate limit patterns
  for (const pattern of genericRateLimitPatterns) {
    if (pattern.test(errorMessage)) {
      // Default to 60 seconds if we detect rate limit but can't extract time
      return {
        isRateLimit: true,
        waitTime: 60,
        userFriendlyMessage: 'Please wait 60 seconds before trying again. This helps us protect your account.',
      };
    }
  }

  return null;
}

