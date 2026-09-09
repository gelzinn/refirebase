import {
  DocPage,
  DocHeader,
  DocSection,
  DocCode,
  P,
  Code,
  Callout,
  DocPagination,
} from "@/components/docs/ui";

const INIT_CODE = `// lib/firebase.ts
import { Refirebase } from 'refirebase';

// Reads FIREBASE_* env vars automatically
export const { db, auth, analytics } = new Refirebase();
`;

const FIRESTORE_CODE = `// Get all docs from a collection
const users = await db.firestore.get('users');

// Query with filters
const admins = await db.firestore.get('users', {
  where: { role: 'admin' },
  orderBy: [{ field: 'created_at', direction: 'desc' }],
  limit: 10,
});

// Add a document (auto-generated ID + timestamps)
const newUser = await db.firestore.add('users', {
  name: 'Alice',
  email: 'alice@example.com',
  role: 'user',
});

// Live updates
const unsubscribe = db.firestore.subscribe('users', (docs) => {
  console.log('users updated:', docs);
});
`;

const AUTH_CODE = `// Sign in with Google
const { data, error } = await auth.handleProviderSignIn('google');

// Sign up with email
const { data, error } = await auth.handleEmailSignUp(
  'alice@example.com',
  'password123',
  { displayName: 'Alice' },
);

// Sign out
await auth.handleSignOut();
`;

const REACT_CODE = `// app/layout.tsx
import { RefirebaseProvider } from 'refirebase/react';
import { firebase } from '@/lib/firebase';

export default function Layout({ children }) {
  return (
    <RefirebaseProvider instance={firebase}>
      {children}
    </RefirebaseProvider>
  );
}

// components/UserList.tsx
import { useAuth, useCollection } from 'refirebase/react';

export function UserList() {
  const { user, signInWithGoogle } = useAuth();
  const { data, loading } = useCollection('users');

  if (!user) return <button onClick={signInWithGoogle}>Sign in</button>;
  if (loading) return <p>Loading...</p>;

  return (
    <ul>
      {data.map((u) => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
}
`;

const MOBILE_CODE = `// app/firebase.ts (React Native / Expo)
import { Refirebase } from 'refirebase';
export const firebase = new Refirebase();

// Sign in with Google (native SDK)
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const { idToken } = await GoogleSignin.signIn();
const { data, error } = await firebase.auth.handleGoogleSignIn({ idToken });

// Upload from device
import { uriToBlob } from 'refirebase';
const blob = await uriToBlob(pickerResult.uri);
await firebase.db.storage.upload('avatars/me.jpg', blob);
`;

export default async function QuickStartPage() {
  return (
    <DocPage>
      <DocHeader
        title="Quick Start"
        description="From zero to working Firebase integration in minutes."
      />

      <DocSection title="1. Initialize">
        <P>
          Create a single shared instance. Refirebase reads your Firebase config
          from environment variables automatically — no config object needed.
        </P>
        <DocCode code={INIT_CODE} lang="ts" label="lib/firebase.ts" />
      </DocSection>

      <DocSection title="2. Firestore">
        <P>
          Simple verb-based API for Firestore. No more building{" "}
          <Code>Query</Code> objects or importing dozens of functions.
        </P>
        <DocCode code={FIRESTORE_CODE} lang="ts" label="Firestore" />
      </DocSection>

      <DocSection title="3. Auth">
        <P>
          Multiple auth methods with typed error returns. No try/catch needed —
          errors are returned as <Code>{`{ data, error }`}</Code>.
        </P>
        <DocCode code={AUTH_CODE} lang="ts" label="auth" />
        <Callout type="tip">
          Every method returns <Code>{`{ data, error }`}</Code>. The{" "}
          <Code>error</Code> includes a readable <Code>code</Code> and{" "}
          <Code>message</Code> — no more opaque Firebase error objects.
        </Callout>
      </DocSection>

      <DocSection title="4. React hooks">
        <P>
          Wrap your app in <Code>RefirebaseProvider</Code> once, then use any
          hook anywhere.
        </P>
        <DocCode code={REACT_CODE} lang="tsx" label="React" />
      </DocSection>

      <DocSection title="5. React Native / Expo">
        <P>
          Mobile projects use the exact same imports! Metro bundler automatically 
          resolves to the native implementation, which swaps popup-based auth for 
          credential-based auth, and provides a <Code>uriToBlob</Code> helper for uploading device files.
        </P>
        <DocCode code={MOBILE_CODE} lang="ts" label="React Native" />
      </DocSection>

      <DocPagination
        prev={{ title: "Configuration", href: "/docs/getting-started/configuration" }}
        next={{ title: "Firestore — get", href: "/docs/firestore/get" }}
      />
    </DocPage>
  );
}
