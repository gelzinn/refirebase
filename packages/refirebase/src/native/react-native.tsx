import type { User } from 'firebase/auth';
import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { RefirebaseNative } from './index';
import type {
  GetByCondition,
  ReturnGenericObj,
} from '../types/firebase/firestore';
import type { StorageUploadOptions, StorageUploadResult, UploadTaskState } from '../types/firebase/storage';
import type { UploadTask } from 'firebase/storage';
import type { GoogleSignInOptions, FacebookSignInOptions } from './auth';

// ─── Context ─────────────────────────────────────────────────────────────────

const RefirebaseContext = createContext<RefirebaseNative<any> | null>(null);

export interface RefirebaseProviderProps<T extends Record<string, any>> {
  instance: RefirebaseNative<T>;
  children: React.ReactNode;
}

/**
 * RefirebaseProvider
 *
 * Provides the RefirebaseNative instance to the entire React Native / Expo app.
 * Identical name to the web bundle — the bundler picks the right one automatically.
 *
 * @example
 * import { RefirebaseProvider } from 'refirebase/react';
 * import { firebase } from './config/firebase';
 *
 * export default function App() {
 *   return (
 *     <RefirebaseProvider instance={firebase}>
 *       <Navigation />
 *     </RefirebaseProvider>
 *   );
 * }
 */
export function RefirebaseProvider<T extends Record<string, any>>({
  instance,
  children,
}: RefirebaseProviderProps<T>) {
  return (
    <RefirebaseContext.Provider value={instance}>
      {children}
    </RefirebaseContext.Provider>
  );
}

/**
 * useRefirebase
 *
 * Hook to access the RefirebaseNative instance.
 * Identical name to the web hook — works transparently via the `react-native` condition.
 */
export function useRefirebase<T extends Record<string, any> = any>() {
  const context = useContext(RefirebaseContext);
  if (!context) {
    throw new Error(
      'useRefirebase must be used within a RefirebaseProvider',
    );
  }
  return context as RefirebaseNative<T>;
}

/**
 * useAuth
 *
 * All-in-one auth hook for React Native.
 * Uses `signInWithGoogle` / `signInWithFacebook` with tokens from the native SDKs.
 * Identical name to the web hook — behaviour adapts automatically.
 *
 * @example
 * const { user, loading, signInWithGoogle, signOut } = useAuth();
 */
export function useAuth() {
  const { auth } = useRefirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = useCallback(
    async (options: GoogleSignInOptions) => {
      setError(null);
      const { data, error: err } = await auth.handleGoogleSignIn(options);
      if (err) setError(err);
      return { data, error: err };
    },
    [auth],
  );

  const signInWithFacebook = useCallback(
    async (options: FacebookSignInOptions) => {
      setError(null);
      const { data, error: err } = await auth.handleFacebookSignIn(options);
      if (err) setError(err);
      return { data, error: err };
    },
    [auth],
  );

  const signOut = useCallback(async () => {
    setError(null);
    const result = await auth.handleSignOut();
    if (result?.error) setError(result.error);
    return result;
  }, [auth]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };
}

/**
 * useCollection
 *
 * Hook to subscribe to a Firestore collection with real-time updates.
 * Identical to the web version.
 */
export function useCollection<
  TSchema extends Record<string, any> = any,
  K extends Extract<keyof TSchema, string> = any,
  T = TSchema[K],
>(collectionName: K, options?: GetByCondition<T>) {
  const { db } = useRefirebase<TSchema>();
  const [data, setData] = useState<ReturnGenericObj<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const optionsKey = JSON.stringify(options ?? {});

  useEffect(() => {
    setLoading(true);
    const parsedOptions = JSON.parse(optionsKey) as GetByCondition<T>;

    const unsubscribe = db.firestore.subscribe(
      collectionName,
      (docs) => {
        setData(docs as ReturnGenericObj<T>[]);
        setLoading(false);
      },
      parsedOptions,
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [db, collectionName, optionsKey]);

  return { data, loading, error };
}

/**
 * useDocument
 *
 * Hook to subscribe to a single Firestore document with real-time updates.
 * Identical to the web version.
 */
export function useDocument<
  TSchema extends Record<string, any> = any,
  K extends Extract<keyof TSchema, string> = any,
  T = TSchema[K],
>(collectionName: K, docId: string) {
  const { db } = useRefirebase<TSchema>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReturnGenericObj<T> | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!docId) return;
    setLoading(true);

    const unsubscribe = db.firestore.subscribe(
      collectionName,
      (doc) => {
        setData(doc as ReturnGenericObj<T>);
        setLoading(false);
      },
      { docId },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [db, collectionName, docId]);

  return { data, loading, error };
}

/**
 * useValue
 *
 * Hook to subscribe to a Realtime Database path.
 * Identical to the web version.
 */
export function useValue<
  TSchema extends Record<string, any> = any,
  K extends Extract<keyof TSchema, string> = any,
  T = TSchema[K],
>(path: K | string) {
  const { db } = useRefirebase<TSchema>();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    const setup = async () => {
      try {
        setLoading(true);
        const unsub = await db.realtime.onValue(path, (val) => {
          setData(val);
          setLoading(false);
        });
        unsubscribe = unsub;
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    setup();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [db, path]);

  return { data, loading, error };
}

/**
 * usePagination
 *
 * Paginated Firestore queries with automatic cursor management.
 * Identical to the web version.
 */
export function usePagination<
  TSchema extends Record<string, any> = any,
  K extends Extract<keyof TSchema, string> = any,
  T = TSchema[K],
>(
  collectionName: K | string,
  options?: GetByCondition<T> & { pageSize?: number },
) {
  const { db } = useRefirebase<TSchema>();
  const pageSize = options?.pageSize ?? 20;
  const [data, setData] = useState<ReturnGenericObj<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const lastDocRef = useRef<unknown>(null);

  const optionsKey = JSON.stringify({ collectionName, ...options });
  useEffect(() => {
    setData([]);
    setHasMore(true);
    lastDocRef.current = null;
    setLoading(true);

    const load = async () => {
      try {
        const result = await db.firestore.get(collectionName as K, {
          ...options,
          limit: pageSize,
        } as GetByCondition<T>);

        if (Array.isArray(result)) {
          setData(result as ReturnGenericObj<T>[]);
          setHasMore(result.length === pageSize);
          lastDocRef.current = result.length > 0 ? result[result.length - 1] : null;
        } else {
          setData([]);
          setHasMore(false);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsKey]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDocRef.current) return;
    setLoadingMore(true);

    try {
      const result = await db.firestore.get(collectionName as K, {
        ...options,
        limit: pageSize,
        startAfter: lastDocRef.current,
      } as GetByCondition<T>);

      if (Array.isArray(result) && result.length > 0) {
        setData((prev) => [...prev, ...(result as ReturnGenericObj<T>[])]);
        setHasMore(result.length === pageSize);
        lastDocRef.current = result[result.length - 1];
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoadingMore(false);
    }
  }, [db, collectionName, options, pageSize, hasMore, loadingMore]);

  return { data, loading, loadingMore, hasMore, loadMore, error };
}

/**
 * useUploadTask
 *
 * File upload hook with real-time progress, pause, resume, and cancel support.
 * Use `uriToBlob` from `refirebase/native` to convert Expo/RN file URIs first.
 * Identical to the web version.
 */
export function useUploadTask() {
  const { db } = useRefirebase();
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState<UploadTaskState>('idle');
  const [result, setResult] = useState<StorageUploadResult | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const taskRef = useRef<UploadTask | null>(null);

  const upload = useCallback(
    async (
      filePath: string,
      file: Blob,
      options?: StorageUploadOptions,
    ): Promise<StorageUploadResult | null> => {
      setState('running');
      setProgress(0);
      setError(null);
      setResult(null);

      const { task, promise } = db.storage.uploadWithProgress(filePath, file, {
        ...options,
        onProgress: (pct) => setProgress(pct),
      });
      taskRef.current = task;

      try {
        const uploadResult = await promise;
        setResult(uploadResult);
        setState('success');
        setProgress(100);
        return uploadResult;
      } catch (err) {
        setError(err);
        setState('error');
        return null;
      }
    },
    [db],
  );

  const pause = useCallback(() => {
    taskRef.current?.pause();
    setState('paused');
  }, []);

  const resume = useCallback(() => {
    taskRef.current?.resume();
    setState('running');
  }, []);

  const cancel = useCallback(() => {
    taskRef.current?.cancel();
    setState('idle');
    setProgress(0);
  }, []);

  return { upload, progress, state, result, error, pause, resume, cancel };
}

/**
 * usePresence
 *
 * Real-time online/offline presence hook using Realtime Database.
 * Automatically marks the user as offline on disconnect.
 * Identical to the web version.
 */
export function usePresence(path: string, userValue: unknown = true) {
  const { db } = useRefirebase();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await db.realtime.set(path, userValue);
      db.realtime.onDisconnect(path).remove();

      const unsub = await db.realtime.onValue(path, (val) => {
        setIsOnline(val !== null);
      });

      return unsub;
    };

    let cleanup: (() => void) | undefined;
    setup().then((unsub) => {
      cleanup = unsub;
    });

    return () => {
      db.realtime.set(path, null);
      if (cleanup) cleanup();
    };
  }, [db, path]);

  return { isOnline };
}

// ─── useUser (web compat) ─────────────────────────────────────────────────────

/**
 * useUser
 *
 * Simple hook that returns just the current user.
 * Identical to the web version.
 */
export function useUser() {
  const { auth } = useRefirebase();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
  }, [auth]);

  return { user, loading };
}

// ─── Backward-compat aliases ─────────────────────────────────────────────────
// These allow existing code using the /react-native explicit import to keep
// working with the old names.

/** @deprecated Use RefirebaseProvider */
export { RefirebaseProvider as RefirebaseNativeProvider };
/** @deprecated Use RefirebaseProviderProps */
export type { RefirebaseProviderProps as RefirebaseNativeProviderProps };
/** @deprecated Use useRefirebase */
export { useRefirebase as useRefirebaseNative };
/** @deprecated Use useAuth */
export { useAuth as useNativeAuth };
