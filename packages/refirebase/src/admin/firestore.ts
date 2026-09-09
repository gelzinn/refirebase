import type {
  DocumentData,
  Firestore,
  Query,
  Transaction,
  WriteBatch,
  WriteResult,
} from 'firebase-admin/firestore';
import type {
  FirestoreError,
  GetByCondition,
  GetById,
  ReturnGenericObj,
} from '../types/firebase/firestore';
import { whereClauses } from '../utils/where';
import { adminCollection, adminDoc } from './refs';

function withTimestamps<T>(data: T, created: boolean) {
  const timestamp = new Date().toISOString();
  const object =
    typeof data === 'object' && data !== null ? data : ({ value: data } as T);

  return created
    ? { ...object, created_at: timestamp, updated_at: timestamp }
    : { ...object, updated_at: timestamp };
}

export class AdminFirestoreTransaction {
  constructor(
    private readonly tx: Transaction,
    private readonly db: Firestore,
  ) {}

  async get<T>(
    collectionName: string,
    docId: string,
  ): Promise<ReturnGenericObj<T> | null> {
    const snap = await this.tx.get(adminDoc(this.db, collectionName, docId));
    if (!snap.exists) {
      return null;
    }
    return { id: snap.id, ...(snap.data() as T) } as ReturnGenericObj<T>;
  }

  set<T>(collectionName: string, docId: string, data: T): this {
    this.tx.set(
      adminDoc(this.db, collectionName, docId),
      withTimestamps(data, true),
    );
    return this;
  }

  update<T>(collectionName: string, docId: string, data: Partial<T>): this {
    this.tx.update(
      adminDoc(this.db, collectionName, docId),
      withTimestamps(data, false),
    );
    return this;
  }

  delete(collectionName: string, docId: string): this {
    this.tx.delete(adminDoc(this.db, collectionName, docId));
    return this;
  }
}

export class AdminFirestoreWriteBatch {
  constructor(
    private readonly batch: WriteBatch,
    private readonly db: Firestore,
  ) {}

  set<T>(collectionName: string, docId: string, data: T): this {
    this.batch.set(
      adminDoc(this.db, collectionName, docId),
      withTimestamps(data, true),
    );
    return this;
  }

  update<T>(collectionName: string, docId: string, data: Partial<T>): this {
    this.batch.update(
      adminDoc(this.db, collectionName, docId),
      withTimestamps(data, false),
    );
    return this;
  }

  delete(collectionName: string, docId: string): this {
    this.batch.delete(adminDoc(this.db, collectionName, docId));
    return this;
  }

  commit(): Promise<WriteResult[]> {
    return this.batch.commit();
  }
}

export class AdminFirestoreDatabase {
  constructor(private readonly db: Firestore) {}

  get native(): Firestore {
    return this.db;
  }

  private buildQuery<T>(collectionName: string, options?: GetByCondition<T>) {
    let q: Query = adminCollection(this.db, collectionName);

    for (const clause of whereClauses(options?.where)) {
      q = q.where(clause.field, clause.operator, clause.value);
    }

    if (options?.orderBy) {
      for (const order of options.orderBy) {
        q = q.orderBy(order.field as string, order.direction);
      }
    }

    if (options?.startAfter) {
      q = q.startAfter(options.startAfter);
    }

    if (options?.limit) {
      q = q.limit(options.limit);
    }

    return q;
  }

  async get<T = DocumentData>(
    collectionName: string,
    options?: GetById | GetByCondition<T>,
  ): Promise<ReturnGenericObj<T>[] | null | FirestoreError> {
    try {
      if (options?.docId) {
        const snap = await adminDoc(
          this.db,
          collectionName,
          options.docId,
        ).get();
        return snap.exists
          ? ([{ id: snap.id, ...(snap.data() as T) }] as ReturnGenericObj<T>[])
          : null;
      }

      const querySnapshot = await this.buildQuery(
        collectionName,
        options as GetByCondition<T>,
      ).get();

      return querySnapshot.empty
        ? []
        : (querySnapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            ...(snapshot.data() as T),
          })) as ReturnGenericObj<T>[]);
    } catch (error) {
      return { error };
    }
  }

  async add<T>(
    collectionName: string,
    data: T,
    docId?: string,
  ): Promise<ReturnGenericObj<T> | FirestoreError> {
    try {
      const col = adminCollection(this.db, collectionName);
      const docRef = docId
        ? adminDoc(this.db, collectionName, docId)
        : col.doc();
      const object = withTimestamps(data, true);
      await docRef.set(object);
      return { id: docRef.id, ...object } as ReturnGenericObj<T>;
    } catch (error) {
      return { error };
    }
  }

  async set<T>(
    collectionName: string,
    docId: string,
    data: T,
  ): Promise<undefined | FirestoreError> {
    try {
      await adminDoc(this.db, collectionName, docId).set(
        withTimestamps(data, false),
      );
    } catch (error) {
      return { error };
    }
  }

  async update<T>(
    collectionName: string,
    docId: string,
    data: Partial<T>,
  ): Promise<undefined | FirestoreError> {
    try {
      await adminDoc(this.db, collectionName, docId).update(
        withTimestamps(data, false),
      );
    } catch (error) {
      return { error };
    }
  }

  async delete(
    collectionName: string,
    docId: string,
  ): Promise<undefined | FirestoreError> {
    try {
      await adminDoc(this.db, collectionName, docId).delete();
    } catch (error) {
      return { error };
    }
  }

  runTransaction<T>(
    fn: (tx: AdminFirestoreTransaction) => Promise<T>,
  ): Promise<T> {
    return this.db.runTransaction(async (raw) =>
      fn(new AdminFirestoreTransaction(raw, this.db)),
    );
  }

  batch(): AdminFirestoreWriteBatch {
    return new AdminFirestoreWriteBatch(this.db.batch(), this.db);
  }
}
