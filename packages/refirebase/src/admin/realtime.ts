import type { Database } from 'firebase-admin/database';

export class AdminRealtimeDatabase {
  constructor(private readonly db: Database) {}

  get native(): Database {
    return this.db;
  }

  async get<T = unknown>(path: string): Promise<T | null | { error: unknown }> {
    try {
      const snapshot = await this.db.ref(path).get();
      return snapshot.exists() ? (snapshot.val() as T) : null;
    } catch (error) {
      return { error };
    }
  }

  async set(
    path: string,
    data: unknown,
  ): Promise<undefined | { error: unknown }> {
    try {
      await this.db.ref(path).set(data);
    } catch (error) {
      return { error };
    }
  }

  async update(
    path: string,
    data: object,
  ): Promise<undefined | { error: unknown }> {
    try {
      await this.db.ref(path).update(data);
    } catch (error) {
      return { error };
    }
  }

  async delete(path: string): Promise<undefined | { error: unknown }> {
    try {
      await this.db.ref(path).remove();
    } catch (error) {
      return { error };
    }
  }
}
