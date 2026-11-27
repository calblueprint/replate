import { z } from 'zod';

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

function runSchema(schema: z.ZodType, value: unknown): string | null {
  const result = schema.safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? 'Invalid');
}

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(
    INPUT_LIMITS.EMAIL_MAX,
    `Email must be less than ${INPUT_LIMITS.EMAIL_MAX} characters`,
  )
  .email('Please enter a valid email address');

const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Phone number is required')
  .transform(phone => phone.replace(/[\s\-().+]/g, ''))
  .pipe(
    z
      .string()
      .regex(
        /^\d+$/,
        'Phone number can only contain digits and formatting characters (spaces, hyphens, parentheses)',
      )
      .min(
        INPUT_LIMITS.PHONE_MIN,
        `Phone number must be at least ${INPUT_LIMITS.PHONE_MIN} digits`,
      )
      .max(
        INPUT_LIMITS.PHONE_MAX,
        `Phone number must be less than ${INPUT_LIMITS.PHONE_MAX} digits`,
      ),
  );

// Email validation - accepts all valid email formats
export const validateEmail = (email: string): string | null =>
  runSchema(emailSchema, email);

// Password match validation
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): string | null => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return 'Please confirm your password';
  }

  return password === confirmPassword ? null : 'Passwords do not match';
};

// Name validation with length limits
export const validateName = (name: string, fieldName: string): string | null =>
  runSchema(
    z
      .string()
      .trim()
      .min(INPUT_LIMITS.NAME_MIN, `${fieldName} is required`)
      .max(
        INPUT_LIMITS.NAME_MAX,
        `${fieldName} must be less than ${INPUT_LIMITS.NAME_MAX} characters`,
      )
      .regex(
        /^[a-zA-Z\s'-]+$/,
        `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
      ),
    name,
  );

// Phone validation with proper format checking
export const validatePhone = (phone: string): string | null =>
  runSchema(phoneSchema, phone);

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
