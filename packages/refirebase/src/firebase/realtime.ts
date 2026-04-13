import type { FirebaseApp } from "firebase/app";

import {
  type Database as FirebaseDatabase,
  get,
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  update,
} from "firebase/database";

import { MESSAGES } from "../config/messages";

export class RealtimeDatabase<TSchema extends Record<string, any> = any> {
  db: FirebaseDatabase;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }

    this.db = getDatabase(app);
  }

  /**
   * Retrieves data from the Firebase Realtime Database.
   *
   * @param path - The path to the data in the database.
   * @returns The data at the specified path or null if the data does not exist.
   */
  async get<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    path: K | string
  ): Promise<T | null | { error: unknown }> {
    try {
      const snapshot = await get(ref(this.db, path));
      return snapshot.exists() ? (snapshot.val() as T) : null;
    } catch (error) {
      return { error };
    }
  }

  async onValue<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    path: K | string,
    callback: (data: T | null) => void
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
    data: T
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
    data: Partial<T>
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
    path: K | string
  ): Promise<undefined | { error: unknown }> {
    try {
      await remove(ref(this.db, path));
    } catch (error) {
      return { error };
    }
  }
}
