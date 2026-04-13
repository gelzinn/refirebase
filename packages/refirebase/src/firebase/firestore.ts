import type { FirebaseApp } from "firebase/app";

import {
  type Firestore as FirebaseFirestore,
  CollectionReference,
  Query,
  WhereFilterOp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
} from "firebase/firestore";

import {
  GetByCondition,
  GetById,
  ReturnGenericObj,
  FirestoreError,
  WhereCondition,
} from "../types/firebase/firestore";

import { MESSAGES } from "../config/messages";

export class FirestoreDatabase<TSchema extends Record<string, any> = any> {
  db: FirebaseFirestore;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }

    this.db = getFirestore(app);
  }

  /**
   * Flattens the where conditions into a single object.
   *
   * @param conditions - The where conditions to flatten.
   * @param prefix - The prefix to use for the flattened conditions.
   *
   * @returns The flattened conditions.
   */
  private flattenWhereConditions<T>(
    conditions: WhereCondition<T>,
    prefix = ""
  ): Record<string, unknown> {
    return Object.entries(conditions).reduce((acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "object" && value !== null) {
        if ("operator" in value || "not" in value) {
          acc[newKey] = value;
        } else {
          Object.assign(
            acc,
            this.flattenWhereConditions(value as WhereCondition<T>, newKey)
          );
        }
      } else {
        acc[newKey] = value;
      }

      return acc;
    }, {} as Record<string, unknown>);
  }

  /**
   * Builds a query based on the provided conditions.
   *
   * @param collectionRef - The collection reference to build the query on.
   * @param options - The options to build the query with.
   *
   * @returns The built query.
   */
  private buildQuery<T>(
    collectionRef: CollectionReference,
    options?: GetByCondition<T>
  ): Query {
    let q = query(collectionRef);

    if (options?.where) {
      const flattened = this.flattenWhereConditions(options.where);

      Object.entries(flattened).forEach(([field, condition]) => {
        if (
          typeof condition === "object" &&
          condition !== null &&
          "operator" in condition
        ) {
          const { operator, value } = condition as {
            operator: WhereFilterOp;
            value: unknown;
          };
          q = query(q, where(field, operator, value));
        } else if (
          typeof condition === "object" &&
          condition !== null &&
          "not" in condition
        ) {
          const { not } = condition as { not: unknown };
          q = query(q, where(field, "!=", not));
        } else {
          q = query(q, where(field, "==", condition));
        }
      });
    }

    if (options?.orderBy) {
      options.orderBy.forEach((order) => {
        q = query(q, orderBy(order.field as string, order.direction));
      });
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
   * Retrieves data from the Firebase Firestore.
   *
   * @param collectionName - The name of the collection to retrieve data from.
   * @param options - The options for retrieving the data.
   *
   * @returns The data at the specified path or null if the data does not exist.
   */
  async get<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    collectionName: K,
    options?: GetById | GetByCondition<T>
  ): Promise<ReturnGenericObj<T>[] | null | FirestoreError> {
    try {
      const collectionRef = collection(this.db, collectionName);

      if (options && options.docId) {
        const docRef = doc(this.db, collectionName, options.docId as string);
        const docSnap = await getDoc(docRef);

        return docSnap.exists()
          ? ([
              {
                id: docSnap.id,
                ...docSnap.data(),
              },
            ] as ReturnGenericObj<T>[])
          : null;
      }

      const q = this.buildQuery<T>(collectionRef, options as GetByCondition<T>);
      const querySnapshot = await getDocs(q);

      return querySnapshot.empty
        ? []
        : (querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ReturnGenericObj<T>[]);
    } catch (error) {
      return { error };
    }
  }

  /**
   * Subscribes to data from the Firebase Firestore.
   *
   * @param collectionName - The name of the collection to subscribe to.
   * @param callback - The callback to run when the data changes.
   * @param options - The options for subscribing to the data.
   * @param errorCallback - The callback to run when an error occurs.
   *
   * @returns A function to unsubscribe from the data.
   */
  subscribe<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    collectionName: K,
    callback: (data: ReturnGenericObj<T>[] | ReturnGenericObj<T> | null) => void,
    options?: GetById | GetByCondition<T>,
    errorCallback?: (error: unknown) => void
  ): () => void {
    const collectionRef = collection(this.db, collectionName);

    if (options && options.docId) {
      const docRef = doc(this.db, collectionName, options.docId as string);
      return onSnapshot(
        docRef,
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
        errorCallback
      );
    }

    const q = this.buildQuery<T>(collectionRef, options as GetByCondition<T>);
    return onSnapshot(
      q,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ReturnGenericObj<T>[];
        callback(data);
      },
      errorCallback
    );
  }

  /**
   * Adds data to the Firebase Firestore.
   *
   * @param collectionName - The name of the collection to add data to.
   * @param data - The data to add to the collection.
   * @param id - The ID of the document to add the data to.
   *
   * @returns The data that was added to the collection or an error object if the operation fails.
   */
  async add<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    collectionName: K,
    data: T,
    docId?: string
  ): Promise<ReturnGenericObj<T> | FirestoreError> {
    try {
      const docRef = docId
        ? doc(this.db, collectionName, docId)
        : doc(collection(this.db, collectionName));

      const timestamp = new Date().toISOString();
      const object =
        typeof data === "object" && data !== null
          ? data
          : ({ [collectionName]: data } as unknown as T);

      await setDoc(docRef, {
        ...object,
        created_at: timestamp,
        updated_at: timestamp,
      });
      return { id: docRef.id, ...object } as ReturnGenericObj<T>;
    } catch (error) {
      return { error };
    }
  }

  /**
   * Updates data in the Firebase Firestore (Overwrite).
   *
   * @param collectionName - The name of the collection to update data in.
   * @param doc_id - The ID of the document to update.
   * @param data - The data to update in the document.
   *
   * @returns An error object if the operation fails.
   */
  async set<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    collectionName: K,
    docId: string,
    data: T
  ): Promise<void | FirestoreError> {
    try {
      const timestamp = new Date().toISOString();
      const object =
        typeof data === "object" && data !== null
          ? data
          : ({ [collectionName]: data } as unknown as T);

      await setDoc(doc(this.db, collectionName, docId), {
        ...object,
        updated_at: timestamp,
      });
    } catch (error) {
      return { error };
    }
  }

  /**
   * Updates data in the Firebase Firestore (Merge).
   *
   * @param collection - The name of the collection to update data in.
   * @param docId - The ID of the document to update.
   * @param data - The data to update in the document.
   *
   * @returns An error object if the operation fails.
   */
  async update<K extends Extract<keyof TSchema, string>, T = TSchema[K]>(
    collectionName: K,
    docId: string,
    data: Partial<T>
  ): Promise<void | FirestoreError> {
    try {
      const timestamp = new Date().toISOString();
      const object =
        typeof data === "object" && data !== null
          ? data
          : ({ [collectionName]: data } as unknown as Partial<T>);

      await updateDoc(doc(this.db, collectionName, docId), {
        ...object,
        updated_at: timestamp,
      });
    } catch (error) {
      return { error };
    }
  }

  /**
   * Deletes data from the Firebase Firestore.
   *
   * @param collectionName - The name of the collection to delete data from.
   * @param docId - The ID of the document to delete.
   *
   * @returns An error object if the operation fails.
   */
  async delete<K extends Extract<keyof TSchema, string>>(
    collectionName: K,
    docId: string
  ): Promise<void | FirestoreError> {
    try {
      await deleteDoc(doc(this.db, collectionName, docId));
    } catch (error) {
      return { error };
    }
  }
}
