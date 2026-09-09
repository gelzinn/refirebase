# Refirebase

[![npm version](https://img.shields.io/npm/v/refirebase.svg)](https://www.npmjs.com/package/refirebase)
[![License](https://img.shields.io/npm/l/refirebase.svg)](https://github.com/gelzinn/refirebase/blob/main/LICENSE)

Refirebase is a typed, unified API for Firebase Authentication, Firestore, Realtime Database, Storage, Analytics, React, React Native/Expo, and the Firebase Admin SDK.

This README documents the `0.2.0` release. Full API documentation and an interactive playground are available at [refirebase.gelzin.com](https://refirebase.gelzin.com) (or run the website locally from `apps/website`).

## Installation

```bash
npm install refirebase
# or: yarn add refirebase
# or: pnpm add refirebase
# or: bun add refirebase
```

Refirebase includes the Firebase JavaScript SDK as a dependency. Install `firebase-admin` only when using the server-side Admin SDK:

```bash
npm install firebase-admin
```

## Quick start

Create one shared instance. The constructor reads `FIREBASE_*` environment variables automatically, or you can pass a configuration object.

```ts
import { Refirebase } from 'refirebase';

export const firebase = new Refirebase({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
});

const { db, auth } = firebase;
```

The required configuration keys are `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, and `appId`. `databaseURL`, `measurementId`, and `useEmulators` are optional.

In Next.js client code, use the corresponding `NEXT_PUBLIC_FIREBASE_*` variables. Refirebase falls back to those names when the unprefixed variables are unavailable.

## Firebase APIs

### Firestore

```ts
const users = await db.firestore.get('users', {
  where: { role: 'admin' },
  orderBy: [{ field: 'created_at', direction: 'desc' }],
  limit: 20,
});

const created = await db.firestore.add('users', {
  name: 'Alice',
  role: 'admin',
});

const stop = db.firestore.subscribe('users', (documents) => {
  console.log('Users updated:', documents);
});

await db.firestore.update('users', 'user-123', { active: true });
stop();
```

The Firestore API also includes `set`, `delete`, `getGroup`, `count`, `aggregate`, `runTransaction`, and `batch`.

### Realtime Database

```ts
const value = await db.realtime.get('settings');
await db.realtime.set('presence/user-123', true);

const stop = await db.realtime.onValue('inbox/user-123', (inbox) => {
  console.log(inbox);
});

const pushed = await db.realtime.push('messages', { text: 'Hello!' });
stop();
```

### Storage

```ts
const uploaded = await db.storage.upload('media/photo.jpg', file, {
  downloadUrl: true,
});

const { task, promise } = db.storage.uploadWithProgress(
  'videos/clip.mp4',
  file,
  { onProgress: (progress) => console.log(`${progress}%`) },
);

const result = await promise;
const bytes = await db.storage.getBytes(uploaded.path);
const url = await db.storage.getUrl(uploaded.path);
```

Storage also provides `getBlob`, `update`, and `delete`.

### Authentication

Authentication methods return typed `{ data, error }` results instead of throwing Firebase errors.

```ts
const { data, error } = await auth.handleEmailSignIn(
  'alice@example.com',
  'password123',
);

await auth.handleEmailSignUp('alice@example.com', 'password123', {
  displayName: 'Alice',
});

await auth.updateProfile({ displayName: 'Alice Smith' });
await auth.handleEmailVerification();
await auth.handleSignOut();
```

Available methods include provider sign-in, email sign-in/sign-up, password reset, email verification, profile updates, account deletion, provider linking, sign-out, and access-token retrieval.

## React

Import the provider and hooks from `refirebase/react`:

```tsx
import { RefirebaseProvider, useAuth, useCollection } from 'refirebase/react';
import { firebase } from './firebase';

export function App() {
  return (
    <RefirebaseProvider instance={firebase}>
      <UserList />
    </RefirebaseProvider>
  );
}

function UserList() {
  const { user, signInWithGoogle } = useAuth();
  const { data, loading } = useCollection('users');

  if (!user) return <button onClick={signInWithGoogle}>Sign in</button>;
  if (loading) return <p>Loading...</p>;
  return <ul>{data.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

Additional hooks include `useRefirebase`, `useUser`, `useDocument`, `useValue`, `usePagination`, `useUploadTask`, and `usePresence`.

## React Native / Expo

Use the native entry point and convert device URIs to Blobs before uploading:

```ts
import { RefirebaseNative, uriToBlob } from 'refirebase/native';

export const firebase = new RefirebaseNative();
const blob = await uriToBlob(imageUri);
await firebase.db.storage.upload('avatars/me.jpg', blob);
```

`NativeFirebaseAuth` uses native credentials instead of browser popups. The package also exposes the same `refirebase` and `refirebase/react` imports through the React Native export condition.

## Admin SDK

Use `refirebase/admin` only in server-side code:

```ts
import { RefirebaseAdmin } from 'refirebase/admin';

const admin = new RefirebaseAdmin();
const token = await admin.auth.createCustomToken(userId);
await admin.db.firestore.update('users', userId, { verified: true });
const signedUrl = await admin.db.storage.getSignedUrl('private/report.pdf');
```

Configure the Admin SDK with `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`, or pass them to the constructor. `firebase-admin` is an optional peer dependency.

## Error handling

Use `isRefirebaseError` to narrow operation results and access the normalized `code`, `message`, and `originalError` fields:

```ts
import { isRefirebaseError } from 'refirebase';

const result = await db.firestore.get('users');
if (isRefirebaseError(result)) {
  console.error(result.error.code, result.error.message);
}
```

## Development

This repository is a Bun/Turborepo monorepo:

```bash
bun install
bun run build
bun test packages/refirebase
bun run dev
```

The published npm package contains only `packages/refirebase/package.json` and its generated `dist` files. The website and playground are repository applications and are not included in the package tarball.

## License

MIT. See [LICENSE](LICENSE).
