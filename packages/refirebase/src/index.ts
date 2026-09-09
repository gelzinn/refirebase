import type { FirebaseApp } from 'firebase/app';

import { init } from './firebase';

import { FirebaseAnalytics } from './firebase/analytics';
import { FirebaseAuth } from './firebase/auth';
import { FirestoreDatabase } from './firebase/firestore';
import { RealtimeDatabase } from './firebase/realtime';
import { StorageFirebase } from './firebase/storage';

import type { FirebaseConfig } from './types/firebase/config';
import type { WhereCondition } from './types/firebase/firestore';
import { getEnv, getEnvFlag } from './utils/env';
import { logger } from './utils/logger';

import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

export class Refirebase<TSchema extends Record<string, any> = any> {
  private readonly internalConfig: FirebaseConfig;
  private readonly app: FirebaseApp;

  public readonly db: {
    firestore: FirestoreDatabase<TSchema>;
    realtime: RealtimeDatabase<TSchema>;
    storage: StorageFirebase;
  };

  public readonly auth: FirebaseAuth;
  public readonly analytics: FirebaseAnalytics;

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

    /**
     * Merge environment variables with provided config, preferring provided config values
     */
    const config = {
      ...envConfig,
      ...firebaseConfig,
    };

    /**
     * Check for required values
     * If any of the required values are missing, throw an error
     */
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
        `Missing Firebase keys: ${missingValues.join(
          ', ',
        )}. Please provide all required keys either through environment variables or the config object.`,
      );
    }

    this.internalConfig = config as FirebaseConfig;
    this.app = init(this.internalConfig);

    this.db = {
      firestore: new FirestoreDatabase<TSchema>(this.app),
      realtime: new RealtimeDatabase<TSchema>(this.app),
      storage: new StorageFirebase(this.app),
    };

    this.auth = new FirebaseAuth(this.app);
    this.analytics = new FirebaseAnalytics(this.app);

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

export type {
  FirebaseConfig as RefirebaseConfig,
  FirebaseApp as RefirebaseApp,
  FirestoreDatabase as RefirebaseFirestore,
  RealtimeDatabase as RefirebaseRealtime,
  StorageFirebase as RefirebaseStorage,
  FirebaseAuth as RefirebaseAuth,
  FirebaseAnalytics as RefirebaseAnalytics,
  WhereCondition as RefirebaseWhereCondition,
};

export type {
  StorageUploadOptions,
  StorageUploadResult,
  UploadTaskState,
} from './types/firebase/storage';

export type {
  RefirebaseError,
} from './types/firebase/error';

export {
  isRefirebaseError,
  toRefirebaseError,
  ERROR_MESSAGES,
} from './types/firebase/error';

export type {
  UpdateProfileOptions,
} from './types/firebase/auth';

export {
  FirestoreTransaction,
  FirestoreWriteBatch,
} from './firebase/firestore';
