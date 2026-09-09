/**
 * Split a Firestore path into non-empty segments.
 */
export function splitPath(path: string): string[] {
  if (typeof path !== 'string' || path.trim() === '') {
    throw new Error('Firestore path must be a non-empty string.');
  }

  const segments = path.split('/').filter((segment) => segment.length > 0);

  if (segments.length === 0) {
    throw new Error('Firestore path must be a non-empty string.');
  }

  return segments;
}

/**
 * Collection paths have an odd number of segments
 * (`users`, `conversations/{id}/messages`).
 */
export function collectionSegments(path: string): string[] {
  const segments = splitPath(path);

  if (segments.length % 2 === 0) {
    throw new Error(
      `Collection path must have an odd number of segments, received "${path}".`,
    );
  }

  return segments;
}

/**
 * Document paths are a collection path plus a document id.
 */
export function docSegments(collectionPath: string, docId: string): string[] {
  if (typeof docId !== 'string' || docId.trim() === '') {
    throw new Error('Document id must be a non-empty string.');
  }

  if (docId.includes('/')) {
    throw new Error(`Document id cannot contain slashes, received "${docId}".`);
  }

  return [...collectionSegments(collectionPath), docId];
}
