import type { FirebaseApp } from 'firebase/app';

import {
  type FirebaseStorage,
  type UploadTask,
  deleteObject,
  getBlob,
  getBytes,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from 'firebase/storage';

import { MESSAGES } from '../config/messages';
import type {
  StorageUploadOptions,
  StorageUploadResult,
} from '../types/firebase/storage';

/** Callback that receives upload progress as a percentage (0–100). */
export type UploadProgressCallback = (progress: number) => void;

export class StorageFirebase {
  storage: FirebaseStorage;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }
    this.storage = getStorage(app);
  }

  get native(): FirebaseStorage {
    return this.storage;
  }

  /**
   * Uploads a file. By default this does **not** mint a long-lived download URL.
   * Pass `{ downloadUrl: true }` to include one (legacy 0.1.x behavior).
   */
  async upload(
    filePath: string,
    file: Blob,
    options?: StorageUploadOptions,
  ): Promise<StorageUploadResult> {
    try {
      const storageRef = ref(this.storage, filePath);
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: options?.contentType || file.type || undefined,
      });
      const result: StorageUploadResult = {
        path: filePath,
        contentType: snapshot.metadata.contentType,
        byteSize: Number(snapshot.metadata.size ?? file.size ?? 0),
      };

      if (options?.downloadUrl) {
        result.downloadUrl = await getDownloadURL(storageRef);
      }

      return result;
    } catch {
      throw new Error(MESSAGES.STORAGE.UPLOAD_FAILED);
    }
  }

  /**
   * Upload a file with real-time progress reporting.
   * Returns both the underlying `UploadTask` (for pause/resume/cancel control)
   * and a `Promise` that resolves to the final `StorageUploadResult`.
   *
   * @example
   * const { task, promise } = storage.uploadWithProgress('avatars/me.jpg', file, {
   *   onProgress: (pct) => setProgress(pct),
   *   downloadUrl: true,
   * });
   * // pause / resume / cancel:
   * task.pause();
   * task.resume();
   * task.cancel();
   * // await result:
   * const result = await promise;
   */
  uploadWithProgress(
    filePath: string,
    file: Blob,
    options?: StorageUploadOptions & { onProgress?: UploadProgressCallback },
  ): { task: UploadTask; promise: Promise<StorageUploadResult> } {
    const storageRef = ref(this.storage, filePath);
    const task = uploadBytesResumable(storageRef, file, {
      contentType: options?.contentType || file.type || undefined,
    });

    const promise = new Promise<StorageUploadResult>((resolve, reject) => {
      task.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          options?.onProgress?.(Math.round(progress));
        },
        (error) => reject(error),
        async () => {
          const result: StorageUploadResult = {
            path: filePath,
            contentType: task.snapshot.metadata.contentType,
            byteSize: task.snapshot.totalBytes,
          };
          if (options?.downloadUrl) {
            result.downloadUrl = await getDownloadURL(storageRef);
          }
          resolve(result);
        },
      );
    });

    return { task, promise };
  }

  /**
   * Long-lived download URL. Prefer `getBytes` / signed URLs for private files.
   */
  async getUrl(filePath: string): Promise<string> {
    try {
      return await getDownloadURL(ref(this.storage, filePath));
    } catch {
      throw new Error(MESSAGES.STORAGE.GET_FAILED);
    }
  }

  /**
   * @deprecated Use `getUrl`. Kept as an alias of `getDownloadURL`.
   */
  async get(filePath: string): Promise<string> {
    return this.getUrl(filePath);
  }

  /** Get raw bytes of a file. */
  async getBytes(filePath: string): Promise<ArrayBuffer> {
    try {
      return await getBytes(ref(this.storage, filePath));
    } catch {
      throw new Error(MESSAGES.STORAGE.GET_FAILED);
    }
  }

  /** Get a file as a Blob. */
  async getBlob(filePath: string): Promise<Blob> {
    try {
      return await getBlob(ref(this.storage, filePath));
    } catch {
      throw new Error(MESSAGES.STORAGE.GET_FAILED);
    }
  }

  /** Upload a new version of an existing file. */
  async update(
    filePath: string,
    file: Blob,
    options?: StorageUploadOptions,
  ): Promise<StorageUploadResult> {
    try {
      return await this.upload(filePath, file, options);
    } catch {
      throw new Error(MESSAGES.STORAGE.UPDATE_FAILED);
    }
  }

  /** Delete a file from Storage. */
  async delete(filePath: string): Promise<void> {
    try {
      await deleteObject(ref(this.storage, filePath));
    } catch {
      throw new Error(MESSAGES.STORAGE.DELETE_FAILED);
    }
  }
}
