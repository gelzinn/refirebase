export interface StorageUploadOptions {
  contentType?: string;
  /** Include a long-lived download URL in the result. @deprecated Prefer signed URLs for private files. */
  downloadUrl?: boolean;
}

export interface StorageUploadResult {
  path: string;
  contentType?: string;
  byteSize: number;
  downloadUrl?: string;
}

/** State of an upload task managed by `useUploadTask`. */
export type UploadTaskState = 'idle' | 'running' | 'paused' | 'success' | 'error';
