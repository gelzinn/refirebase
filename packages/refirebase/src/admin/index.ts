import { type App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getDatabase } from 'firebase-admin/database';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

import type { RefirebaseAdminConfig } from '../types/firebase/admin';
import { getEnv } from '../utils/env';
import { AdminAuth } from './auth';
import { AdminFirestoreDatabase } from './firestore';
import { AdminRealtimeDatabase } from './realtime';
import { AdminStorage } from './storage';

const APP_NAME = 'refirebase-admin';

function readAdminConfig(
  config?: Partial<RefirebaseAdminConfig>,
): RefirebaseAdminConfig {
  const merged: Partial<RefirebaseAdminConfig> = {
    projectId: getEnv('FIREBASE_PROJECT_ID'),
    clientEmail: getEnv('FIREBASE_CLIENT_EMAIL'),
    privateKey: getEnv('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
    storageBucket: getEnv('FIREBASE_STORAGE_BUCKET'),
    databaseURL: getEnv('FIREBASE_DATABASE_URL'),
    ...config,
  };

  if (merged.privateKey) {
    merged.privateKey = merged.privateKey.replace(/\\n/g, '\n');
  }

  if (!merged.projectId || !merged.clientEmail || !merged.privateKey) {
    throw new Error(
      'Missing Firebase Admin keys: projectId, clientEmail, privateKey. Pass them in the constructor or as FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY.',
    );
  }

  return merged as RefirebaseAdminConfig;
}

function getAdminApp(config: RefirebaseAdminConfig): App {
  const existing = getApps().find((app) => app.name === APP_NAME);
  if (existing) {
    return existing;
  }

  return initializeApp(
    {
      credential: cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey,
      }),
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      databaseURL: config.databaseURL,
    },
    APP_NAME,
  );
}

export class RefirebaseAdmin {
  private readonly app: App;

  public readonly db: {
    firestore: AdminFirestoreDatabase;
    realtime: AdminRealtimeDatabase;
    storage: AdminStorage;
  };

  public readonly auth: AdminAuth;

  constructor(config?: Partial<RefirebaseAdminConfig>) {
    const resolved = readAdminConfig(config);
    this.app = getAdminApp(resolved);

    const firestore = getFirestore(this.app);
    const realtime = getDatabase(this.app);
    const storage = getStorage(this.app);
    const bucketName = resolved.storageBucket;

    this.db = {
      firestore: new AdminFirestoreDatabase(firestore),
      realtime: new AdminRealtimeDatabase(realtime),
      storage: new AdminStorage(
        bucketName ? storage.bucket(bucketName) : storage.bucket(),
      ),
    };

    this.auth = new AdminAuth(getAuth(this.app));
  }

  get native(): App {
    return this.app;
  }
}

export type { RefirebaseAdminConfig } from '../types/firebase/admin';
export {
  AdminFirestoreDatabase,
  AdminFirestoreTransaction,
  AdminFirestoreWriteBatch,
} from './firestore';
export { AdminRealtimeDatabase } from './realtime';
export { AdminStorage } from './storage';
export { AdminAuth } from './auth';
