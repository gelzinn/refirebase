import { afterEach, describe, expect, test } from 'bun:test';
import { getEnv, getEnvFlag } from './env';

const KEYS = [
  'FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'FIREBASE_USE_EMULATORS',
  'NEXT_PUBLIC_FIREBASE_USE_EMULATORS',
];

afterEach(() => {
  for (const key of KEYS) {
    delete process.env[key];
  }
});

describe('getEnv', () => {
  test('reads FIREBASE_* first', () => {
    process.env.FIREBASE_API_KEY = 'server-key';
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'public-key';
    expect(getEnv('FIREBASE_API_KEY')).toBe('server-key');
  });

  test('falls back to NEXT_PUBLIC_FIREBASE_*', () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'public-key';
    expect(getEnv('FIREBASE_API_KEY')).toBe('public-key');
  });
});

describe('getEnvFlag', () => {
  test('accepts true and 1', () => {
    process.env.FIREBASE_USE_EMULATORS = 'true';
    expect(getEnvFlag('FIREBASE_USE_EMULATORS')).toBe(true);
    process.env.FIREBASE_USE_EMULATORS = '1';
    expect(getEnvFlag('FIREBASE_USE_EMULATORS')).toBe(true);
  });

  test('reads the Next.js public alias', () => {
    process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS = 'true';
    expect(getEnvFlag('FIREBASE_USE_EMULATORS')).toBe(true);
  });
});
