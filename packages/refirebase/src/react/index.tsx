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
import type { UploadTask } from 'firebase/storage';

import type { Refirebase } from '../index';
import type {
  GetByCondition,
  ReturnGenericObj,
} from '../types/firebase/firestore';
import type { StorageUploadOptions, StorageUploadResult, UploadTaskState } from '../types/firebase/storage';

const RefirebaseContext = createContext<Refirebase<any> | null>(null);

export interface RefirebaseProviderProps<T extends Record<string, any>> {
  instance: Refirebase<T>;
  children: React.ReactNode;
}

/**
 * RefirebaseProvider
 *
 * Provides the Refirebase instance to the entire application.
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
 * Hook to access the Refirebase instance.
 */
export function useRefirebase<T extends Record<string, any> = any>() {
  const context = useContext(RefirebaseContext);

  if (!context) {
    throw new Error('useRefirebase must be used within a RefirebaseProvider');
  }

  return context as Refirebase<T>;
}

/**
 * useUser
 *
 * Hook to access the current authenticated user.
 * Returns `{ user, loading }`.
 */
export function useUser() {
  const { auth } = useRefirebase();

  const [user, setUser] = useState<User | null>(auth.getCurrentUser());
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}

/**
 * useAuth
 *
 * All-in-one auth hook with ready-to-use sign-in/sign-out actions.
 * Eliminates boilerplate for the most common auth patterns.
 *
 * @example
 * const { user, loading, signInWithGoogle, signOut, error } = useAuth();
 */
export function useAuth() {
  const { auth } = useRefirebase();
  const [user, setUser] = useState<User | null>(auth.getCurrentUser());
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const signInWithGoogle = useCallback(
    async (options?: { scopes?: string[] }) => {
      setError(null);
      const { data, error: err } = await auth.handleProviderSignIn('google', options);
      if (err) setError(err);
      return { data, error: err };
    },
    [auth],
  );

  const signInWithGithub = useCallback(
    async (options?: { scopes?: string[] }) => {
      setError(null);
      const { data, error: err } = await auth.handleProviderSignIn('github', options);
      if (err) setError(err);
      return { data, error: err };
    },
    [auth],
  );

  const signInWithFacebook = useCallback(
    async (options?: { scopes?: string[] }) => {
      setError(null);
      const { data, error: err } = await auth.handleProviderSignIn('facebook', options);
      if (err) setError(err);
      return { data, error: err };
    },
    [auth],
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      setError(null);
      const { data, error: err } = await auth.handleEmailSignIn(email, password);
      if (err) setError(err);
      return { data, error: err };
    },
    [auth],
  );

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      options?: { displayName?: string; photoURL?: string },
    ) => {
      setError(null);
      const { data, error: err } = await auth.handleEmailSignUp(email, password, options);
      if (err) setError(err);
      return { data, error: err };
    },
    [auth],
  );

  const resetPassword = useCallback(
    async (email: string) => {
      setError(null);
      const result = await auth.handlePasswordReset(email);
      if (result?.error) setError(result.error);
      return result;
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
    signInWithGithub,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
  };
}

/**
 * useCollection
 *
 * Hook to subscribe to a Firestore collection with real-time updates.
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
 * Hook to subscribe to a Realtime Database path with real-time updates.
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
 * Hook for paginated Firestore queries with automatic cursor management.
 * Supports infinite-scroll and load-more patterns.
 *
 * @example
 * const { data, loadMore, hasMore, loading } = usePagination('posts', {
 *   orderBy: [{ field: 'created_at', direction: 'desc' }],
 *   pageSize: 20,
 * });
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

  // Reset when collection/options change
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
 * Hook for file uploads with real-time progress reporting.
 * Returns an `upload` function, progress (0–100), state, and the result.
 *
 * @example
 * const { upload, progress, state, result, error } = useUploadTask();
 * // trigger:
 * await upload('avatars/me.jpg', file, { downloadUrl: true });
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
 *
 * @example
 * const { isOnline } = usePresence('presence/user123');
 */
export function usePresence(path: string, userValue: unknown = true) {
  const { db } = useRefirebase();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const setup = async () => {
      // Mark online
      await db.realtime.set(path, userValue);
      // Mark offline on disconnect
      db.realtime.onDisconnect(path).remove();

      // Listen for changes
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
