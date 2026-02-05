# Security Guidelines

This document outlines the security measures implemented in the Replate React Native application and best practices for maintaining security.

## Security Measures Implemented

### 1. Environment Variable Management

- **Environment Validation**: All environment variables are validated on app startup via `api/envConfig.ts`
- **No Hardcoded URLs**: The API base URL is loaded from environment variables only
- **Example File**: `.env.example` provides a template for required environment variables
- **Git Ignore**: `.env` files are excluded from version control to prevent credential leaks

### 2. Input Sanitization

All user input and external data is sanitized using utilities in `src/utils/sanitization.ts`:

- **JSON Parsing**: Use `safeJsonParse()` instead of `JSON.parse()` to handle errors gracefully
- **Prototype Pollution Protection**: `sanitizeObject()` removes dangerous keys like `__proto__`, `constructor`, `prototype`
- **String Sanitization**: `sanitizeString()`, `sanitizeEmail()`, `sanitizePhone()` validate and clean user input
- **URL Validation**: `sanitizeUrl()` ensures only http/https URLs are accepted
- **HTML Stripping**: `stripHtmlTags()` removes potentially dangerous HTML/script content

### 3. API Security

The API layer (`api/apiUtils.ts` and `api/config.ts`) implements:

- **Request Timeouts**: Prevent hanging requests (default: 30 seconds)
- **Retry Logic**: Automatic retry with exponential backoff for network errors
- **Error Handling**: Structured error handling without exposing sensitive details
- **Response Validation**: Optional response structure validation
- **Response Sanitization**: Automatic sanitization of API responses to prevent prototype pollution
- **No Console Logging**: Removed all console.log/error statements that could expose sensitive data

### 4. Data Storage Security

- **AsyncStorage**: User session data is stored locally but sanitized on read
- **No Sensitive Data in Logs**: Removed all console statements that could leak API URLs, tokens, or user data
- **JSON Parse Safety**: All JSON parsing operations use safe parsing with error handling

### 5. Authentication Security

- **Password Validation**: Strong password requirements (min 8 chars, uppercase, lowercase, number, special char)
- **Email Validation**: RFC 5322 compliant email validation
- **No Credential Logging**: Authentication errors don't expose whether email exists or password is wrong
- **Session Management**: Optional "stay signed in" with secure local storage

## Best Practices for Developers

### Environment Variables

1. **Never commit `.env` files** - They are gitignored for a reason
2. **Use `.env.example`** as a template for setting up your environment
3. **Validate all environment variables** through `envConfig.ts` before use
4. **Use EXPO*PUBLIC* prefix** for variables that need to be available in the app

### Input Handling

1. **Always sanitize user input** using utilities from `src/utils/sanitization.ts`
2. **Use validation functions** from `src/utils/validation.ts` for forms
3. **Never trust external data** - validate and sanitize API responses
4. **Use safe JSON parsing** - import `safeJsonParse` instead of using `JSON.parse`

### API Calls

1. **Use the `apiRequest` function** from `api/apiUtils.ts` for all API calls
2. **Enable response validation** for critical endpoints
3. **Handle errors gracefully** without exposing internal details to users
4. **Never log sensitive data** - no API URLs, tokens, passwords, or user PII

### Logging

1. **No console.log in production** - Remove all debug logging before committing
2. **No sensitive data in logs** - Don't log passwords, tokens, API keys, or user PII
3. **Use error messages carefully** - Generic user-facing messages, detailed logs only in dev mode

### Code Review Checklist

Before committing code, verify:

- [ ] No console.log/error/warn statements that expose sensitive data
- [ ] No hardcoded credentials, API keys, or URLs
- [ ] All user input is validated and sanitized
- [ ] All JSON parsing uses `safeJsonParse()`
- [ ] All API calls use `apiRequest()` or the driverAPI helpers
- [ ] Environment variables are properly validated
- [ ] No `.env` files are committed
- [ ] Error messages don't leak implementation details
- [ ] Passwords and sensitive data are never logged

## Security Vulnerabilities to Avoid

### 1. Prototype Pollution

**Bad:**

```typescript
const data = JSON.parse(untrustedInput);
Object.assign(user, data); // Dangerous!
```

**Good:**

```typescript
import { safeJsonParse, sanitizeObject } from './utils/sanitization';

const data = safeJsonParse(untrustedInput);
const sanitized = sanitizeObject(data);
```

### 2. Information Disclosure

**Bad:**

```typescript
console.log('API URL:', BASE_URL);
console.error('Login failed:', error); // May contain sensitive details
```

**Good:**

```typescript
// No logging of URLs or sensitive errors in production
// Use generic user-facing error messages
```

### 3. Unvalidated Input

**Bad:**

```typescript
const email = emailInput; // No validation
await api.login({ email, password });
```

**Good:**

```typescript
import { sanitizeEmail } from './utils/sanitization';
import { validateEmail } from './utils/validation';

const email = sanitizeEmail(emailInput);
const error = validateEmail(email);
if (error) {
  showError(error);
  return;
}
```

### 4. Hardcoded Secrets

**Bad:**

```typescript
const API_URL = 'http://192.168.1.100:3000'; // Hardcoded
const API_KEY = 'secret-key-12345'; // Never do this!
```

**Good:**

```typescript
import { ENV_CONFIG } from './envConfig';

const API_URL = ENV_CONFIG.API_BASE_URL;
// API keys should come from secure environment variables
```

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT open a public issue**
2. Email the security team with details
3. Allow time for the issue to be patched before disclosure
4. You will be credited for responsible disclosure

## Security Updates

This document should be updated whenever:

- New security measures are implemented
- Security vulnerabilities are discovered and fixed
- Best practices change or evolve
- New authentication/authorization is added
