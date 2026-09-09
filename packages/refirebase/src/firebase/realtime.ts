import type { FirebaseApp } from 'firebase/app';

import {
  type Database as FirebaseDatabase,
  type DataSnapshot,
  get,
  getDatabase,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  onDisconnect,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';

import { MESSAGES } from '../config/messages';

export class RealtimeDatabase<TSchema extends Record<string, any> = any> {
  db: FirebaseDatabase;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }

    this.db = getDatabase(app);
  }

  get native(): FirebaseDatabase {
    return this.db;
  }

  /**
   * Retrieves data from the Firebase Realtime Database once.
   *
   * @param path - The path to the data in the database.
   * @returns The data at the specified path or null if the data does not exist.
   */
  async get<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    path: K | string,
  ): Promise<T | null | { error: unknown }> {
    try {
      const snapshot = await get(ref(this.db, path));
      return snapshot.exists() ? (snapshot.val() as T) : null;
    } catch (error) {
      return { error };
    }
  }

  /**
   * Subscribe to real-time value changes at the given path.
   * Fires immediately with the current value, then on every change.
   *
   * @returns An unsubscribe function.
   */
  async onValue<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    path: K | string,
    callback: (data: T | null) => void,
  ) {
    const dbRef = ref(this.db, path);
    const snapshot = await get(dbRef);
    callback(snapshot.val() as T);

    return onValue(dbRef, (snapshot) => {
      callback(snapshot.val() as T);
    });
  }

  /**
   * Sets data in the Firebase Realtime Database.
   *
   * @param path - The path to the data in the database.
   * @param data - The data to set.
   *
   * @returns An error object if the operation fails.
   */
  async set<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    path: K | string,
    data: T,
  ): Promise<undefined | { error: unknown }> {
    try {
      await set(ref(this.db, path), data);
    } catch (error) {
      return { error };
    }
  }

  /**
   * Updates data in the Firebase Realtime Database.
   *
   * @param path - The path to the data in the database.
   * @param data - The data to update.
   *
   * @returns An error object if the operation fails.
   */
  async update<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    path: K | string,
    data: Partial<T>,
  ): Promise<undefined | { error: unknown }> {
    try {
      await update(ref(this.db, path), data as object);
    } catch (error) {
      return { error };
    }
  }

  /**
   * Deletes data from the Firebase Realtime Database.
   *
   * @param path - The path to the data in the database.
   * @returns An error object if the operation fails.
   */
  async delete<K extends Extract<keyof TSchema, string>>(
    path: K | string,
  ): Promise<undefined | { error: unknown }> {
    try {
      await remove(ref(this.db, path));
    } catch (error) {
      return { error };
    }
  }

  /**
   * Push a new child entry with an auto-generated key (like Firebase `.push()`).
   * Ideal for list-style data such as chat messages or activity feeds.
   *
   * @example
   * const result = await db.realtime.push('messages', { text: 'hello', uid: 'abc' });
   * console.log(result?.key); // '-NxYZ123...'
   */
  async push<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    path: K | string,
    data: T,
  ): Promise<{ key: string | null } | { error: unknown }> {
    try {
      const newRef = await push(ref(this.db, path), data);
      return { key: newRef.key };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Listen for new child nodes added at the given path.
   *
   * @example
   * const stop = db.realtime.onChildAdded('messages', (child) => {
   *   console.log(child.key, child.val());
   * });
   * // later:
   * stop();
   */
  onChildAdded<K extends Extract<keyof TSchema, string>>(
    path: K | string,
    callback: (snapshot: DataSnapshot) => void,
  ): () => void {
    return onChildAdded(ref(this.db, path), callback);
  }

  /**
   * Listen for child nodes that change at the given path.
   */
  onChildChanged<K extends Extract<keyof TSchema, string>>(
    path: K | string,
    callback: (snapshot: DataSnapshot) => void,
  ): () => void {
    return onChildChanged(ref(this.db, path), callback);
  }

  /**
   * Listen for child nodes that are removed at the given path.
   */
  onChildRemoved<K extends Extract<keyof TSchema, string>>(
    path: K | string,
    callback: (snapshot: DataSnapshot) => void,
  ): () => void {
    return onChildRemoved(ref(this.db, path), callback);
  }

  /**
   * Presence helper. Typical use: `onDisconnect(path).remove()` or `.set(false)`.
   *
   * @example
   * await db.realtime.set('presence/uid', true);
   * db.realtime.onDisconnect('presence/uid').remove();
   */
  onDisconnect<K extends Extract<keyof TSchema, string>>(path: K | string) {
    const handle = onDisconnect(ref(this.db, path));
    return {
      set: (data: unknown) => handle.set(data),
      update: (data: object) => handle.update(data),
      remove: () => handle.remove(),
      cancel: () => handle.cancel(),
    };
  }
}
