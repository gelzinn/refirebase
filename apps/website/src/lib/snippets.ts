export const INIT_SNIPPET = `import { Refirebase } from 'refirebase';
const { db, auth } = new Refirebase();
`;

export const FIRESTORE_SNIPPET = `const users = await db.firestore.get('users', {
  where: { role: 'admin' },
  orderBy: [{ field: 'created_at', direction: 'desc' }],
  limit: 20,
});

const stop = db.firestore.subscribe(
  'conversations/abc/messages',
  (messages) => console.log(messages),
);
`;

export const AUTH_SNIPPET = `// google
await auth.handleProviderSignIn('google');
// better auth
await auth.handleCustomTokenSignIn(serverToken);
// sign out
await auth.handleSignOut();
`;

export const STORAGE_SNIPPET = `const uploaded = await db.storage.upload(
  'media/photo.jpg',
  file,
);

const bytes = await db.storage.getBytes(uploaded.path);
`;

export const ADMIN_SNIPPET = `import { RefirebaseAdmin } from 'refirebase/admin';

const admin = new RefirebaseAdmin();
const token = await admin.auth.createCustomToken(userId);

await admin.db.storage.upload('media/photo.jpg', buffer);

const url = await admin.db.storage.getSignedUrl(
  'media/photo.jpg',
  { expiresSeconds: 60 },
);
`;

export const REACT_SNIPPET = `import {
  RefirebaseProvider,
  useCollection,
  useUser,
} from 'refirebase/react';

function Inbox() {
  const { user } = useUser();
  const { data } = useCollection('messages', {
    where: { to: user?.uid },
  });

  return <ul>{data.map((m) => <li key={m.id}>{m.text}</li>)}</ul>;
}
`;
