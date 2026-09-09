import type {
  CollectionReference,
  DocumentReference,
  Firestore,
} from 'firebase-admin/firestore';
import { collectionSegments, docSegments } from '../utils/path';

export function adminCollection(
  db: Firestore,
  path: string,
): CollectionReference {
  const segments = collectionSegments(path);
  let ref: CollectionReference = db.collection(segments[0]);

  for (let i = 1; i < segments.length; i += 2) {
    ref = ref.doc(segments[i]).collection(segments[i + 1]);
  }

  return ref;
}

export function adminDoc(
  db: Firestore,
  collectionPath: string,
  docId: string,
): DocumentReference {
  return db.doc(docSegments(collectionPath, docId).join('/'));
}
