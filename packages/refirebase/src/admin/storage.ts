import type { Storage } from 'firebase-admin/storage';
import { MESSAGES } from '../config/messages';
import type {
  StorageUploadOptions,
  StorageUploadResult,
} from '../types/firebase/storage';

type Bucket = ReturnType<Storage['bucket']>;

function toBuffer(file: Blob | Buffer | Uint8Array): Promise<Buffer> {
  if (Buffer.isBuffer(file)) {
    return Promise.resolve(file);
  }
  if (file instanceof Uint8Array) {
    return Promise.resolve(Buffer.from(file));
  }
  return file.arrayBuffer().then((buffer) => Buffer.from(buffer));
}

export class AdminStorage {
  constructor(private readonly bucket: Bucket) {}

  get native(): Bucket {
    return this.bucket;
  }

  async upload(
    filePath: string,
    file: Blob | Buffer | Uint8Array,
    options?: StorageUploadOptions,
  ): Promise<StorageUploadResult> {
    try {
      const buffer = await toBuffer(file);
      const contentType =
        options?.contentType ||
        (file instanceof Blob ? file.type : undefined) ||
        undefined;
      const fileRef = this.bucket.file(filePath);

      await fileRef.save(buffer, {
        contentType,
        resumable: false,
      });

      const result: StorageUploadResult = {
        path: filePath,
        contentType,
        byteSize: buffer.byteLength,
      };

      if (options?.downloadUrl) {
        const [url] = await fileRef.getSignedUrl({
          action: 'read',
          expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });
        result.downloadUrl = url;
      }

      return result;
    } catch {
      throw new Error(MESSAGES.STORAGE.UPLOAD_FAILED);
    }
  }

  async getBytes(filePath: string): Promise<Buffer> {
    try {
      const [buffer] = await this.bucket.file(filePath).download();
      return buffer;
    } catch {
      throw new Error(MESSAGES.STORAGE.GET_FAILED);
    }
  }

  async getSignedUrl(
    filePath: string,
    options?: { expiresSeconds?: number },
  ): Promise<string> {
    try {
      const expiresSeconds = options?.expiresSeconds ?? 60;
      const [url] = await this.bucket.file(filePath).getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresSeconds * 1000,
      });
      return url;
    } catch {
      throw new Error(MESSAGES.STORAGE.GET_FAILED);
    }
  }

  async delete(filePath: string): Promise<void> {
    try {
      await this.bucket.file(filePath).delete({ ignoreNotFound: true });
    } catch {
      throw new Error(MESSAGES.STORAGE.DELETE_FAILED);
    }
  }
}
