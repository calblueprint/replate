// Input length limits
export const INPUT_LIMITS = {
  NAME_MIN: 1,
  NAME_MAX: 50,
  EMAIL_MAX: 254, // RFC 5321 standard
  PHONE_MIN: 10,
  PHONE_MAX: 15,
  PASSWORD_MIN: 8,
  PASSWORD_MAX: 128,
};

// Email validation - accepts all valid email formats
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }

  // Check length limit
  if (email.length > INPUT_LIMITS.EMAIL_MAX) {
    return `Email must be less than ${INPUT_LIMITS.EMAIL_MAX} characters`;
  }

  // Comprehensive email format regex (RFC 5322 compliant)
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

// Password validation with strength requirements
export const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }

  // Check length limits
  if (password.length < INPUT_LIMITS.PASSWORD_MIN) {
    return `Password must be at least ${INPUT_LIMITS.PASSWORD_MIN} characters long`;
  }

  if (password.length > INPUT_LIMITS.PASSWORD_MAX) {
    return `Password must be less than ${INPUT_LIMITS.PASSWORD_MAX} characters`;
  }

  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }

  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }

  // Check for number
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }

  // Check for special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Password must contain at least one special character';
  }

  return null;
};

// Get password strength score (0-5)
export const getPasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety checks
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  return Math.min(strength, 5);
};

// Get password strength label
export const getPasswordStrengthLabel = (strength: number): string => {
  switch (strength) {
    case 0:
    case 1:
      return 'Very Weak';
    case 2:
      return 'Weak';
    case 3:
      return 'Fair';
    case 4:
      return 'Good';
    case 5:
      return 'Strong';
    default:
      return 'Unknown';
  }
};

// Password match validation
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};

// Name validation with length limits
export const validateName = (
  name: string,
  fieldName: string,
): string | null => {
  if (!name || name.trim() === '') {
    return `${fieldName} is required`;
  }

  if (name.trim().length < INPUT_LIMITS.NAME_MIN) {
    return `${fieldName} is required`;
  }

  if (name.length > INPUT_LIMITS.NAME_MAX) {
    return `${fieldName} must be less than ${INPUT_LIMITS.NAME_MAX} characters`;
  }

  // Check for invalid characters (only letters, spaces, hyphens, and apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }

  return null;
};

// Phone validation with proper format checking
export const validatePhone = (phone: string): string | null => {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }

  // Remove common formatting characters for validation
  const digitsOnly = phone.replace(/[\s\-().+]/g, '');

  // Check if it contains only digits (and optional leading + for country code)
  if (!/^\d+$/.test(digitsOnly)) {
    return 'Phone number can only contain digits and formatting characters (spaces, hyphens, parentheses)';
  }

  // Check length limits
  if (digitsOnly.length < INPUT_LIMITS.PHONE_MIN) {
    return `Phone number must be at least ${INPUT_LIMITS.PHONE_MIN} digits`;
  }

  if (digitsOnly.length > INPUT_LIMITS.PHONE_MAX) {
    return `Phone number must be less than ${INPUT_LIMITS.PHONE_MAX} digits`;
  }

  return null;
};

// Format phone number for display (US format)
export const formatPhoneNumber = (phone: string): string => {
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }

  if (digitsOnly.length === 11 && digitsOnly[0] === '1') {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }

  return phone;
};
