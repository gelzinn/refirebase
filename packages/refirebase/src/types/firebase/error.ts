import { FirebaseError } from 'firebase/app';

/**
 * Typed Refirebase error with a readable code and message.
 */
export interface RefirebaseError {
  code: string;
  message: string;
  originalError?: unknown;
}

/**
 * Converts any thrown value into a RefirebaseError.
 */
export function toRefirebaseError(raw: unknown): RefirebaseError {
  if (raw instanceof FirebaseError) {
    return {
      code: raw.code,
      message: friendlyMessage(raw.code) ?? raw.message,
      originalError: raw,
    };
  }
  if (raw instanceof Error) {
    return { code: 'unknown', message: raw.message, originalError: raw };
  }
  return { code: 'unknown', message: String(raw), originalError: raw };
}

export const ERROR_MESSAGES: Record<string, string> = {
  'permission-denied': 'You do not have permission to perform this action.',
  'not-found': 'The requested resource was not found.',
  'already-exists': 'This resource already exists.',
  unauthenticated: 'You must be signed in to perform this action.',
  unavailable: 'The service is temporarily unavailable. Please try again.',
  cancelled: 'The operation was cancelled.',
  'deadline-exceeded': 'The operation timed out. Please try again.',
  'resource-exhausted': 'Quota exceeded. Please try again later.',
  'failed-precondition': 'The operation failed because a precondition was not met.',
  'auth/user-not-found': 'No user found with this email address.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
  'auth/cancelled-popup-request': 'Only one sign-in popup can be open at a time.',
  'storage/unauthorized': 'You do not have permission to access this file.',
  'storage/object-not-found': 'File not found.',
  'storage/quota-exceeded': 'Storage quota exceeded.',
  'storage/retry-limit-exceeded': 'Upload failed after too many retries.',
};

/**
 * Returns a user-friendly message for well-known Firebase error codes.
 */
function friendlyMessage(code: string): string | null {
  return ERROR_MESSAGES[code] ?? null;
}

/**
 * Type guard to check if a value is a RefirebaseError result.
 *
 * @example
 * const result = await db.firestore.get('users');
 * if (isRefirebaseError(result)) {
 *   console.log(result.error.code);
 * }
 */
export function isRefirebaseError<T>(
  result: { data?: T; error?: RefirebaseError } | T | null,
): result is { error: RefirebaseError } {
  return (
    result !== null &&
    typeof result === 'object' &&
    'error' in result &&
    (result as { error?: unknown }).error !== undefined
  );
}
