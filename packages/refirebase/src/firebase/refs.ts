import {
  type CollectionReference,
  type DocumentReference,
  type Firestore,
  collection,
  doc,
} from 'firebase/firestore';
import { collectionSegments, docSegments } from '../utils/path';

export function collectionRef(
  db: Firestore,
  path: string,
): CollectionReference {
  const [first, ...rest] = collectionSegments(path);
  return collection(db, first, ...rest);
}

export function documentRef(
  db: Firestore,
  collectionPath: string,
  docId: string,
): DocumentReference {
  const [first, ...rest] = docSegments(collectionPath, docId);
  return doc(db, first, ...rest);
}
