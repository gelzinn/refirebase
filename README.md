<p align="center">
  <a href="https://github.com/refirebase">
    <img src="https://avatars.githubusercontent.com/u/181779808?v=4" alt="Refirebase Logo" width="128" style="border-radius: 8px">
    <h1 align="center">
      Refirebase
    </h1>
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/refirebase">
    <img src="https://img.shields.io/npm/v/refirebase.svg">
  </a>
  <a href="https://github.com/refirebase/refirebase?tab=MIT-1-ov-file">
    <img src="https://img.shields.io/npm/l/refirebase.svg">
  </a>
</p>

Refirebase is a simple library that allows you to use Firebase Realtime Database, Firestore, Storage and Authentication as a state management solution in your JavaScript application.

## Installation

Use your favorite package manager to install Refirebase:

### NPM

```bash
npm install refirebase
```

### Yarn, PNPM, BUN

```bash
yarn add refirebase
```

```bash
pnpm add refirebase
```

```bash
bun add refirebase
```

## Usage

Import the `Refirebase` class:

```javascript
import { Refirebase } from 'refirebase';
```

You can use the `Refirebase` class to get the Firebase objects:

```javascript
const refirebase = new Refirebase({
  apiKey: 'FIREBASE_API_KEY',
  authDomain: 'FIREBASE_AUTH_DOMAIN',
  databaseURL: 'FIREBASE_DATABASE_URL',
  projectId: 'FIREBASE_PROJECT_ID',
  storageBucket: 'FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
  appId: 'FIREBASE_APP_ID',
  measurementId: 'FIREBASE_MEASUREMENT_ID',
});
```

Or you can use destructuring to get other objects:

```javascript
const { db, auth } = new Refirebase({
  apiKey: 'FIREBASE_API_KEY',
  authDomain: 'FIREBASE_AUTH_DOMAIN',
  databaseURL: 'FIREBASE_DATABASE_URL',
  projectId: 'FIREBASE_PROJECT_ID',
  storageBucket: 'FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'FIREBASE_MESSAGING_SENDER_ID',
  appId: 'FIREBASE_APP_ID',
  measurementId: 'FIREBASE_MEASUREMENT_ID',
});
```

If you prefer to use environment variables, you can call the constructor without any parameters. In Next.js, `NEXT_PUBLIC_FIREBASE_*` is also accepted (the client bundle cannot read unprefixed `FIREBASE_*` keys).

```yaml
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=

# Next.js public aliases (optional)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
```

```javascript
const refirebase = new Refirebase();
```

## Examples

### Databases

#### Firestore Database Example
```javascript
// Import the Refirebase class
import { db } from '@/config/firebase';

// Get all data from the 'users' collection
const users = db.firestore.get("users");

// Get data with conditions
const users = db.firestore.get("users", {
  where: {
    name: "John",
  },
});

// Get data with conditions and index
const users = db.firestore.get("users", {
  where: {
    name: "John",
    lastName: { not: "Doe" },
  },
});

// Get data with conditions and not
const users = db.firestore.get("users", {
  where: {
    name: "John",
    age: { operator: ">=", value: 18 },
  },
});

// Subcollections (odd number of path segments)
const messages = db.firestore.get("conversations/abc/messages", {
  orderBy: [{ field: "created_at", direction: "desc" }],
  limit: 50,
});

// Live updates
const unsubscribe = db.firestore.subscribe("users", (docs) => {
  console.log(docs);
});

// Transactions and batches
await db.firestore.runTransaction(async (tx) => {
  const current = await tx.get("meta", "storageQuota");
  tx.update("meta", "storageQuota", { usedBytes: current.usedBytes + 1024 });
});

const batch = db.firestore.batch();
batch.set("inbox/uid/chats", "abc", { previewKind: "text" });
await batch.commit();
```

> [!WARNING]  
> For more information about the limitations of the Firestore query, see [Firebase Firestore Query Limitations](https://firebase.google.com/docs/firestore/query-data/queries#query_limitations).

#### Realtime Database Example

```javascript
import { db } from '@/config/firebase';

const users = await db.realtime.get("users");

const stop = await db.realtime.onValue("inbox/uid", (value) => {
  console.log(value);
});

await db.realtime.onDisconnect("presence/uid").remove();
```

#### Storage

```javascript
import { db } from '@/config/firebase';

// Default: path + size only (no long-lived download URL)
const uploaded = await db.storage.upload("media/photo.jpg", file);

// Legacy public URL
const publicFile = await db.storage.upload("public/photo.jpg", file, {
  downloadUrl: true,
});

const bytes = await db.storage.getBytes("media/photo.jpg");
const url = await db.storage.getUrl("public/photo.jpg");
```

### Features

#### Authentication Example

```javascript
import { auth } from '@/config/firebase';

const google = await auth.handleProviderSignIn("google");
const email = await auth.handleEmailSignIn("user@email.com", "password");
const custom = await auth.handleCustomTokenSignIn(serverMintedToken);

await auth.handleSignOut();
```

#### React

```javascript
import { RefirebaseProvider, useCollection, useUser, useValue } from 'refirebase/react';
```

#### Admin SDK (server only)

```javascript
import { RefirebaseAdmin } from 'refirebase/admin';

const admin = new RefirebaseAdmin({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const token = await admin.auth.createCustomToken(userId);
await admin.db.storage.upload("media/photo.jpg", buffer);
const signed = await admin.db.storage.getSignedUrl("media/photo.jpg", {
  expiresSeconds: 60,
});

// Escape hatch for adapters (e.g. Better Auth Firestore adapter)
const nativeFirestore = admin.db.firestore.native;
```

`firebase-admin` is an optional peer dependency of `refirebase/admin`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
