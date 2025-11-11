// Allowed email domains whitelist
const ALLOWED_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'protonmail.com',
  'edu', // Allow any .edu domain
];

// Email validation with domain whitelist
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }

  // Basic email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  // Extract domain
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) {
    return 'Please enter a valid email address';
  }

  // Check if domain is in whitelist or ends with .edu
  const isAllowed =
    ALLOWED_EMAIL_DOMAINS.some(
      allowed =>
        domain === allowed || (allowed === 'edu' && domain.endsWith('.edu')),
    ) || false;

  if (!isAllowed) {
    return 'Email domain not allowed. Please use a valid email domain (e.g., gmail.com)';
  }

  return null;
};

// Password validation - minimum 8 characters with complexity requirements
export const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
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

// Name validation
export const validateName = (
  name: string,
  fieldName: string,
): string | null => {
  if (!name || name.trim() === '') {
    return `${fieldName} is required`;
  }

  return null;
};

// Phone validation (optional - basic format check)
export const validatePhone = (phone: string): string | null => {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }

  // Remove common formatting characters for validation
  const digitsOnly = phone.replace(/[\s\-()]/g, '');
  if (digitsOnly.length < 10) {
    return 'Please enter a valid phone number';
  }

  return null;
};
