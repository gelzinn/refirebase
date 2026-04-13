import { 
  WhereFilterOp as WhereFilterOperator,
  OrderByDirection
} from "firebase/firestore";

export type ReturnGenericObj<T> = T & { id: string };

export type GetById = { docId: string; where?: never; orderBy?: never; limit?: never; startAfter?: never };

export type GetByCondition<T> = { 
  docId?: never; 
  where?: WhereCondition<T>;
  orderBy?: { 
    field: keyof T | string; 
    direction?: OrderByDirection 
  }[];
  limit?: number;
  startAfter?: any;
};

export type FirestoreError = { error: Error | unknown };

export type WhereCondition<T> = {
  [K in keyof T]?:
    | T[K]
    | { operator: WhereFilterOperator; value: T[K] }
    | { not: T[K] }
    | (T[K] extends object ? WhereCondition<T[K]> : never);
};
