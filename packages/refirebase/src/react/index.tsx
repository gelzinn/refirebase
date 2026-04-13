import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type { Refirebase } from "../index";
import type {
  ReturnGenericObj,
  GetByCondition,
} from "../types/firebase/firestore";

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
    throw new Error("useRefirebase must be used within a RefirebaseProvider");
  }

  return context as Refirebase<T>;
}

/**
 * useUser
 *
 * Hook to access the current authenticated user.
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
 * useCollection
 *
 * Hook to subscribe to a Firestore collection.
 */
export function useCollection<
  TSchema extends Record<string, any> = any,
  K extends Extract<keyof TSchema, string> = any,
  T = TSchema[K]
>(collectionName: K, options?: GetByCondition<T>) {
  const { db } = useRefirebase<TSchema>();
  const [data, setData] = useState<ReturnGenericObj<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = db.firestore.subscribe(
      collectionName,
      (docs) => {
        setData(docs as ReturnGenericObj<T>[]);
        setLoading(false);
      },
      options,
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, collectionName, JSON.stringify(options)]);

  return { data, loading, error };
}

/**
 * useDocument
 *
 * Hook to subscribe to a single Firestore document.
 */
export function useDocument<
  TSchema extends Record<string, any> = any,
  K extends Extract<keyof TSchema, string> = any,
  T = TSchema[K]
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
      }
    );

    return () => unsubscribe();
  }, [db, collectionName, docId]);

  return { data, loading, error };
}
