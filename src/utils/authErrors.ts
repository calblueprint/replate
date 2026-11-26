import Toast from 'react-native-toast-message';
import { ApiError } from '../../api/apiUtils';

export interface AuthToastError {
  text1: string;
  text2: string;
}

export type SignupFieldErrors = Partial<
  Record<'firstName' | 'lastName' | 'email' | 'phone' | 'password', string>
>;

export type LoginFieldErrors = Partial<Record<'email' | 'password', string>>;

export type ResetPasswordFieldErrors = Partial<
  Record<'password' | 'confirmPassword' | 'token', string>
>;

export function extractApiErrorDetails(error: unknown): {
  message: string;
  errors: string[];
  status?: number;
} {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      errors: error.errors,
      status: error.status,
    };
  }

  const record =
    typeof error === 'object' && error !== null
      ? (error as Record<string, unknown>)
      : {};
  const message =
    typeof record.message === 'string'
      ? record.message
      : error instanceof Error
        ? error.message
        : '';
  const errors = Array.isArray(record.errors)
    ? record.errors.filter((e): e is string => typeof e === 'string')
    : [];
  const status = typeof record.status === 'number' ? record.status : undefined;

  return { message, errors, status };
}

export function getNetworkOrServerToast(error: unknown): AuthToastError | null {
  const { message, status } = extractApiErrorDetails(error);

  if (status === 0 || message.toLowerCase().includes('network')) {
    return {
      text1: 'Connection Error',
      text2: 'Please check your internet connection and try again.',
    };
  }

  if (status !== undefined && status >= 500) {
    return {
      text1: 'Server Error',
      text2: 'Server is temporarily unavailable. Please try again later.',
    };
  }

  return null;
}

export function showAuthErrorToast(text1: string, text2: string): void {
  Toast.show({
    type: 'error',
    text1,
    text2,
    position: 'top',
    visibilityTime: 3000,
  });
}

export function parseLoginApiErrors(error: unknown): {
  fieldErrors: LoginFieldErrors;
  toast?: AuthToastError;
} {
  const networkOrServer = getNetworkOrServerToast(error);
  if (networkOrServer) {
    return { fieldErrors: {}, toast: networkOrServer };
  }

  const { message } = extractApiErrorDetails(error);
  const lower = message.toLowerCase();

  if (lower.includes('email') && !lower.includes('password')) {
    return { fieldErrors: { email: message } };
  }

  if (
    lower.includes('invalid') ||
    lower.includes('credentials') ||
    lower.includes('password') ||
    lower.includes('incorrect')
  ) {
    return {
      fieldErrors: {
        email: 'Invalid email or password. Please try again.',
        password: 'Invalid email or password. Please try again.',
      },
    };
  }

  return {
    fieldErrors: {},
    toast: {
      text1: 'Login Failed',
      text2: message || 'Invalid email or password. Please try again.',
    },
  };
}

export function parseSignupApiErrors(error: unknown): {
  fieldErrors: SignupFieldErrors;
  toast?: AuthToastError;
} {
  const networkOrServer = getNetworkOrServerToast(error);
  if (networkOrServer) {
    return { fieldErrors: {}, toast: networkOrServer };
  }

  const { message, errors } = extractApiErrorDetails(error);
  const allErrors = errors.length > 0 ? errors : message ? [message] : [];
  const fieldErrors: SignupFieldErrors = {};

  for (const err of allErrors) {
    if (!err) continue;
    const lower = err.toLowerCase();

    if (lower.includes('email')) {
      fieldErrors.email =
        lower.includes('taken') || lower.includes('already')
          ? 'This email is already registered. Please use a different email.'
          : lower.includes('invalid')
            ? 'Please enter a valid email address.'
            : err;
    } else if (lower.includes('password')) {
      fieldErrors.password = err;
    } else if (lower.includes('phone')) {
      fieldErrors.phone = lower.includes('invalid')
        ? 'Please enter a valid phone number.'
        : err;
    } else if (lower.includes('first name') || lower.includes('first_name')) {
      fieldErrors.firstName = err;
    } else if (lower.includes('last name') || lower.includes('last_name')) {
      fieldErrors.lastName = err;
    }
  }

  if (Object.keys(fieldErrors).length === 0) {
    return {
      fieldErrors,
      toast: {
        text1: 'Signup Failed',
        text2: message || 'Failed to create account. Please try again.',
      },
    };
  }

  return { fieldErrors };
}

export function parseResetPasswordApiErrors(error: unknown): {
  fieldErrors: ResetPasswordFieldErrors;
  toast: AuthToastError;
} {
  const networkOrServer = getNetworkOrServerToast(error);
  if (networkOrServer) {
    return { fieldErrors: {}, toast: networkOrServer };
  }

  const { message, errors } = extractApiErrorDetails(error);
  const errorMessage = message || 'Failed to reset password. Please try again.';
  const lower = errorMessage.toLowerCase();
  const fieldErrors: ResetPasswordFieldErrors = {};

  if (
    lower.includes('token') ||
    lower.includes('expired') ||
    (lower.includes('invalid') && !lower.includes('password'))
  ) {
    fieldErrors.token = errorMessage;
  } else if (errors.length > 0) {
    for (const err of errors) {
      if (!err.toLowerCase().includes('password')) continue;
      if (err.toLowerCase().includes('confirmation')) {
        fieldErrors.confirmPassword = err;
      } else {
        fieldErrors.password = err;
      }
    }
  } else {
    fieldErrors.password = errorMessage;
  }

  return {
    fieldErrors,
    toast: { text1: 'Error', text2: errorMessage },
  };
}
