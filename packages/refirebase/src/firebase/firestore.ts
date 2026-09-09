import type { FirebaseApp } from 'firebase/app';

import {
  type AggregateSpec,
  type Firestore as FirebaseFirestore,
  type Query,
  type Transaction,
  type WriteBatch,
  average,
  collectionGroup,
  count,
  deleteDoc,
  doc,
  getAggregateFromServer,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  startAfter,
  sum,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';

import { MESSAGES } from '../config/messages';
import type {
  FirestoreError,
  GetByCondition,
  GetById,
  ReturnGenericObj,
} from '../types/firebase/firestore';
import { whereClauses } from '../utils/where';
import { collectionRef, documentRef } from './refs';

function withTimestamps<T>(
  data: T,
  created: boolean,
): T & {
  created_at?: string;
  updated_at: string;
} {
  const timestamp = new Date().toISOString();
  const object =
    typeof data === 'object' && data !== null ? data : ({ value: data } as T);

  return created
    ? { ...object, created_at: timestamp, updated_at: timestamp }
    : { ...object, updated_at: timestamp };
}

export class FirestoreTransaction {
  constructor(
    private readonly tx: Transaction,
    private readonly db: FirebaseFirestore,
  ) {}

  async get<T>(
    collectionName: string,
    docId: string,
  ): Promise<ReturnGenericObj<T> | null> {
    const snap = await this.tx.get(documentRef(this.db, collectionName, docId));
    if (!snap.exists()) {
      return null;
    }
    return { id: snap.id, ...snap.data() } as ReturnGenericObj<T>;
  }

  set<T>(collectionName: string, docId: string, data: T): this {
    this.tx.set(
      documentRef(this.db, collectionName, docId),
      withTimestamps(data, true),
    );
    return this;
  }

  update<T>(collectionName: string, docId: string, data: Partial<T>): this {
    this.tx.update(
      documentRef(this.db, collectionName, docId),
      withTimestamps(data, false),
    );
    return this;
  }

  delete(collectionName: string, docId: string): this {
    this.tx.delete(documentRef(this.db, collectionName, docId));
    return this;
  }
}

export class FirestoreWriteBatch {
  constructor(
    private readonly batch: WriteBatch,
    private readonly db: FirebaseFirestore,
  ) {}

  set<T>(collectionName: string, docId: string, data: T): this {
    this.batch.set(
      documentRef(this.db, collectionName, docId),
      withTimestamps(data, true),
    );
    return this;
  }

  update<T>(collectionName: string, docId: string, data: Partial<T>): this {
    this.batch.update(
      documentRef(this.db, collectionName, docId),
      withTimestamps(data, false),
    );
    return this;
  }

  delete(collectionName: string, docId: string): this {
    this.batch.delete(documentRef(this.db, collectionName, docId));
    return this;
  }

  commit(): Promise<void> {
    return this.batch.commit();
  }
}

export class FirestoreDatabase<TSchema extends Record<string, any> = any> {
  db: FirebaseFirestore;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }

    this.db = getFirestore(app);
  }

  /**
   * Underlying Firestore instance (escape hatch for adapters).
   */
  get native(): FirebaseFirestore {
    return this.db;
  }

  private buildQuery<T>(
    collectionName: string,
    options?: GetByCondition<T>,
  ): Query {
    let q: Query = query(collectionRef(this.db, collectionName));

    for (const clause of whereClauses(options?.where)) {
      q = query(q, where(clause.field, clause.operator, clause.value));
    }

    if (options?.orderBy) {
      for (const order of options.orderBy) {
        q = query(q, orderBy(order.field as string, order.direction));
      }
    }

    if (options?.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }

    if (options?.limit) {
      q = query(q, limit(options.limit));
    }

    return q;
  }

  /**
   * Retrieves data from Firestore.
   * `collectionName` may be a top-level collection or a subcollection path
   * such as `conversations/{id}/messages`.
   */
  async get<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    collectionName: K | string,
    options?: GetById | GetByCondition<T>,
  ): Promise<ReturnGenericObj<T>[] | null | FirestoreError> {
    try {
      if (options?.docId) {
        const docSnap = await getDoc(
          documentRef(this.db, collectionName, options.docId),
        );

        return docSnap.exists()
          ? ([
              {
                id: docSnap.id,
                ...docSnap.data(),
              },
            ] as ReturnGenericObj<T>[])
          : null;
      }

      const querySnapshot = await getDocs(
        this.buildQuery<T>(collectionName, options as GetByCondition<T>),
      );

      return querySnapshot.empty
        ? []
        : (querySnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            ...snapshot.data(),
          })) as ReturnGenericObj<T>[]);
    } catch (error) {
      return { error };
    }
  }

  subscribe<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    collectionName: K | string,
    callback: (
      data: ReturnGenericObj<T>[] | ReturnGenericObj<T> | null,
    ) => void,
    options?: GetById | GetByCondition<T>,
    errorCallback?: (error: unknown) => void,
  ): () => void {
    if (options?.docId) {
      return onSnapshot(
        documentRef(this.db, collectionName, options.docId),
        (docSnap) => {
          if (docSnap.exists()) {
            callback({
              id: docSnap.id,
              ...docSnap.data(),
            } as ReturnGenericObj<T>);
          } else {
            callback(null);
          }
        },
        errorCallback,
      );
    }

    return onSnapshot(
      this.buildQuery<T>(collectionName, options as GetByCondition<T>),
      (querySnapshot) => {
        callback(
          querySnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            ...snapshot.data(),
          })) as ReturnGenericObj<T>[],
        );
      },
      errorCallback,
    );
  }

  async add<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    collectionName: K | string,
    data: T,
    docId?: string,
  ): Promise<ReturnGenericObj<T> | FirestoreError> {
    try {
      const col = collectionRef(this.db, collectionName);
      const docRef = docId
        ? documentRef(this.db, collectionName, docId)
        : doc(col);
      const object = withTimestamps(data, true);

      await setDoc(docRef, object);
      return { id: docRef.id, ...object } as ReturnGenericObj<T>;
    } catch (error) {
      return { error };
    }
  }

  async set<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    collectionName: K | string,
    docId: string,
    data: T,
  ): Promise<undefined | FirestoreError> {
    try {
      await setDoc(
        documentRef(this.db, collectionName, docId),
        withTimestamps(data, false),
      );
    } catch (error) {
      return { error };
    }
  }

  async update<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    collectionName: K | string,
    docId: string,
    data: Partial<T>,
  ): Promise<undefined | FirestoreError> {
    try {
      await updateDoc(
        documentRef(this.db, collectionName, docId),
        withTimestamps(data, false),
      );
    } catch (error) {
      return { error };
    }
  }

  async delete<K extends Extract<keyof TSchema, string>>(
    collectionName: K | string,
    docId: string,
  ): Promise<undefined | FirestoreError> {
    try {
      await deleteDoc(documentRef(this.db, collectionName, docId));
    } catch (error) {
      return { error };
    }
  }

  /**
   * Query across **all subcollections** with the same name using Firestore's
   * `collectionGroup` feature.
   *
   * @example
   * // Get all 'messages' documents across every conversation
   * const msgs = await db.firestore.getGroup('messages', {
   *   orderBy: [{ field: 'created_at', direction: 'desc' }],
   *   limit: 50,
   * });
   */
  async getGroup<T = any>(
    collectionId: string,
    options?: GetByCondition<T>,
  ): Promise<ReturnGenericObj<T>[] | FirestoreError> {
    try {
      let q: Query = collectionGroup(this.db, collectionId);

      for (const clause of whereClauses(options?.where)) {
        q = query(q, where(clause.field, clause.operator, clause.value));
      }
      if (options?.orderBy) {
        for (const order of options.orderBy) {
          q = query(q, orderBy(order.field as string, order.direction));
        }
      }
      if (options?.startAfter) {
        q = query(q, startAfter(options.startAfter));
      }
      if (options?.limit) {
        q = query(q, limit(options.limit));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((snapshot) => ({
        id: snapshot.id,
        ...snapshot.data(),
      })) as ReturnGenericObj<T>[];
    } catch (error) {
      return { error };
    }
  }

  /**
   * Count documents in a collection matching optional filters.
   * Uses Firestore's server-side `count()` aggregation — does not read document data.
   *
   * @example
   * const total = await db.firestore.count('users');
   * const activeCount = await db.firestore.count('users', { where: { active: true } });
   */
  async count<T = any>(
    collectionName: string,
    options?: GetByCondition<T>,
  ): Promise<number | FirestoreError> {
    try {
      const q = this.buildQuery<T>(collectionName, options);
      const snapshot = await getAggregateFromServer(q, { count: count() });
      return snapshot.data().count;
    } catch (error) {
      return { error };
    }
  }

  /**
   * Run server-side aggregate queries (`sum`, `average`) on a collection.
   * Does not read full document data, making it very efficient.
   *
   * @example
   * const stats = await db.firestore.aggregate('orders', { sum: 'total', average: 'total' });
   * console.log(stats.sum, stats.average);
   */
  async aggregate<T = any>(
    collectionName: string,
    fields: { sum?: keyof T & string; average?: keyof T & string },
    options?: GetByCondition<T>,
  ): Promise<{ sum?: number | null; average?: number | null } | FirestoreError> {
    try {
      const q = this.buildQuery<T>(collectionName, options);
      const spec: AggregateSpec = {};
      if (fields.sum) spec.sum = sum(fields.sum);
      if (fields.average) spec.average = average(fields.average);
      const snapshot = await getAggregateFromServer(q, spec);
      const data = snapshot.data();
      return {
        sum: fields.sum ? (data.sum as number | null) : undefined,
        average: fields.average ? (data.average as number | null) : undefined,
      };
    } catch (error) {
      return { error };
    }
  }

  async runTransaction<T>(
    fn: (tx: FirestoreTransaction) => Promise<T>,
  ): Promise<T> {
    return runTransaction(this.db, async (raw) =>
      fn(new FirestoreTransaction(raw, this.db)),
    );
  }

  batch(): FirestoreWriteBatch {
    return new FirestoreWriteBatch(writeBatch(this.db), this.db);
  }
}
