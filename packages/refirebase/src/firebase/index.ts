import type { FirebaseConfig } from '../types/firebase/config';

import {
  type FirebaseApp,
  deleteApp,
  getApps,
  initializeApp,
} from 'firebase/app';
import { FirebaseError } from 'firebase/app';

let app: FirebaseApp | null = null;

function matchingApp(config: FirebaseConfig): FirebaseApp | undefined {
  return getApps().find(
    (existing) =>
      existing.options.apiKey === config.apiKey &&
      existing.options.appId === config.appId &&
      existing.options.projectId === config.projectId,
  );
}

/**
 * Initializes the Firebase app with the given configuration.
 *
 * @param config - The Firebase configuration.
 *
 * @returns The initialized Firebase app.
 */
function init(config: FirebaseConfig) {
  const existing = matchingApp(config);
  if (existing) {
    app = existing;
    return existing;
  }

  try {
    const name =
      getApps().length === 0 ? undefined : `refirebase-${config.appId}`;
    app = name ? initializeApp(config, name) : initializeApp(config);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(`x Firebase initialization error: ${error.message}`);
    }

    throw new Error(`x Firebase initialization unexpected error: ${error}`);
  }

  return app;
}

/**
 * Destroys the Firebase app.
 *
 * @returns A promise that resolves when the app is destroyed.
 */
async function destroy() {
  if (!app) return;

  try {
    await deleteApp(app);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(`x Firebase destruction error: ${error.message}`);
    }

    throw new Error(`x Firebase destruction unexpected error: ${error}`);
  }
}

export { init, destroy };
