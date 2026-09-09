declare global {
  interface Window {
    __FIREBASE_CONFIG__?: Record<string, string>;
  }
}

function readEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }

  if (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__) {
    const value = window.__FIREBASE_CONFIG__[key];
    if (value) {
      return value;
    }
  }

  return undefined;
}

/**
 * Read `FIREBASE_*` and, when missing, the Next.js `NEXT_PUBLIC_FIREBASE_*` alias.
 */
export function getEnv(key: string): string | undefined {
  const direct = readEnv(key);
  if (direct) {
    return direct;
  }

  if (!key.startsWith('NEXT_PUBLIC_')) {
    return readEnv(`NEXT_PUBLIC_${key}`);
  }

  return undefined;
}

export function getEnvFlag(key: string): boolean {
  const value = getEnv(key);
  return value === 'true' || value === '1';
}
