import type { FirebaseApp } from 'firebase/app';

import { init } from '../firebase';
import { FirestoreDatabase } from '../firebase/firestore';
import { RealtimeDatabase } from '../firebase/realtime';
import { StorageFirebase } from '../firebase/storage';
import { NativeFirebaseAuth } from './auth';

import type { FirebaseConfig } from '../types/firebase/config';
import { getEnv, getEnvFlag } from '../utils/env';
import { logger } from '../utils/logger';

import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

/**
 * RefirebaseNative
 *
 * The React Native / Expo variant of Refirebase.
 * Drop-in replacement for `Refirebase` in mobile projects.
 *
 * Key differences:
 * - `auth` is a `NativeFirebaseAuth` instance that uses `signInWithCredential`
 *   instead of `signInWithPopup` (which is incompatible with React Native).
 * - `db.storage.upload` accepts a `Blob` — use the `uriToBlob` helper exported
 *   from `refirebase/native` to convert Expo/RN file URIs before uploading.
 *
 * @example
 * // config/firebase.ts
 * import { RefirebaseNative } from 'refirebase/native';
 * export const { db, auth } = new RefirebaseNative();
 *
 * // In your component:
 * import { GoogleSignin } from '@react-native-google-signin/google-signin';
 * const { idToken } = await GoogleSignin.signIn();
 * const { data, error } = await auth.handleGoogleSignIn({ idToken });
 */
export class RefirebaseNative<TSchema extends Record<string, any> = any> {
  private readonly internalConfig: FirebaseConfig;
  private readonly app: FirebaseApp;

  public readonly db: {
    firestore: FirestoreDatabase<TSchema>;
    realtime: RealtimeDatabase<TSchema>;
    storage: StorageFirebase;
  };

  public readonly auth: NativeFirebaseAuth;

  constructor(firebaseConfig?: Partial<FirebaseConfig>) {
    const envConfig: Partial<FirebaseConfig> = {
      apiKey: getEnv('FIREBASE_API_KEY'),
      authDomain: getEnv('FIREBASE_AUTH_DOMAIN'),
      databaseURL: getEnv('FIREBASE_DATABASE_URL'),
      projectId: getEnv('FIREBASE_PROJECT_ID'),
      storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: getEnv('FIREBASE_MESSAGING_SENDER_ID'),
      appId: getEnv('FIREBASE_APP_ID'),
      measurementId: getEnv('FIREBASE_MEASUREMENT_ID'),
      useEmulators: getEnvFlag('FIREBASE_USE_EMULATORS'),
    };

    const config = {
      ...envConfig,
      ...firebaseConfig,
    };

    if (
      !config.apiKey ||
      !config.authDomain ||
      !config.projectId ||
      !config.storageBucket ||
      !config.messagingSenderId ||
      !config.appId
    ) {
      const missingValues = Object.keys(config).filter(
        (key) => !config[key as keyof FirebaseConfig],
      );
      throw new Error(
        `Missing Firebase keys: ${missingValues.join(', ')}. Please provide all required keys either through environment variables or the config object.`,
      );
    }

    this.internalConfig = config as FirebaseConfig;
    this.app = init(this.internalConfig);

    this.db = {
      firestore: new FirestoreDatabase<TSchema>(this.app),
      realtime: new RealtimeDatabase<TSchema>(this.app),
      storage: new StorageFirebase(this.app),
    };

    this.auth = new NativeFirebaseAuth(this.app);

    if (this.internalConfig.useEmulators) {
      this.setupEmulators();
    }
  }

  private setupEmulators() {
    try {
      connectFirestoreEmulator(getFirestore(this.app), 'localhost', 8080);
      connectAuthEmulator(getAuth(this.app), 'http://localhost:9099');
      connectDatabaseEmulator(getDatabase(this.app), 'localhost', 9000);
      connectStorageEmulator(getStorage(this.app), 'localhost', 9199);
      logger.info('Connected to Firebase Emulators');
    } catch (error) {
      logger.warn('Failed to connect to emulators:', error);
    }
  }
}

/**
 * Converts a React Native / Expo file URI to a Blob for use with
 * `db.storage.upload()`.
 *
 * @example
 * import { uriToBlob } from 'refirebase/native';
 * import * as ImagePicker from 'expo-image-picker';
 *
 * const result = await ImagePicker.launchImageLibraryAsync();
 * const blob = await uriToBlob(result.assets[0].uri);
 * await db.storage.upload('avatars/me.jpg', blob);
 */
export async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return response.blob();
}

export { NativeFirebaseAuth } from './auth';
export type { GoogleSignInOptions, FacebookSignInOptions } from './auth';

/**
 * Transparent alias — when Metro resolves `refirebase` to this bundle via the
 * `react-native` export condition, `import { Refirebase } from 'refirebase'`
 * works identically to the web version.
 *
 * The only behavioural difference is that `auth` uses `signInWithCredential`
 * instead of `signInWithPopup`. Everything else is identical.
 */
export { RefirebaseNative as Refirebase };
