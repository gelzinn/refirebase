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

const ENV_VARS = `# .env or .env.local
FIREBASE_API_KEY=AIza...
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=your-project
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc

# Next.js (client bundle) — same keys with NEXT_PUBLIC_ prefix
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# Enable local emulators
FIREBASE_USE_EMULATORS=true`;

const CONFIG_OBJECT = `import { Refirebase } from 'refirebase';

// Option 1: environment variables (recommended)
const { db, auth } = new Refirebase();

// Option 2: explicit config object
const { db, auth } = new Refirebase({
  apiKey: 'AIza...',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc',
  databaseURL: 'https://your-project-rtdb.firebaseio.com',
});`;

const EMULATOR_CODE = `// Set the env var to auto-connect to local emulators:
// FIREBASE_USE_EMULATORS=true

// Emulator ports used:
// Firestore  → localhost:8080
// Auth       → localhost:9099
// RTDB       → localhost:9000
// Storage    → localhost:9199`;

const SCHEMA_CODE = `import { Refirebase } from 'refirebase';

// Define your Firestore schema
type Schema = {
  users: { name: string; email: string; role: 'admin' | 'user' };
  posts: { title: string; body: string; authorId: string };
};

// Pass the schema as a generic
const { db } = new Refirebase<Schema>();

// Now collection names autocomplete and return typed documents
const users = await db.firestore.get('users'); // typed as users[]
const posts = await db.firestore.get('posts'); // typed as posts[]`;

export default async function ConfigurationPage() {
  return (
    <DocPage>
      <DocHeader
        title="Configuration"
        description="Configure Refirebase with environment variables or a config object."
      />

      <DocSection title="Environment variables">
        <P>
          Refirebase reads your Firebase config from environment variables
          automatically. For Next.js projects, it accepts both the plain{" "}
          <Code>FIREBASE_*</Code> prefix (server-side) and the{" "}
          <Code>NEXT_PUBLIC_FIREBASE_*</Code> prefix (client bundle).
        </P>
        <DocCode code={ENV_VARS} lang="bash" label=".env.local" />
        <Callout type="tip">
          You only need to set the <Code>DATABASE_URL</Code> if you are using
          Realtime Database. <Code>MEASUREMENT_ID</Code> is only needed for
          Analytics.
        </Callout>
      </DocSection>

      <DocSection title="Config object">
        <P>
          You can also pass the config directly to the constructor. Explicit
          values take priority over environment variables.
        </P>
        <DocCode code={CONFIG_OBJECT} lang="ts" label="lib/firebase.ts" />
      </DocSection>

      <DocSection title="Emulators">
        <P>
          Set <Code>FIREBASE_USE_EMULATORS=true</Code> and Refirebase
          automatically connects all services to the local Firebase Emulator
          Suite.
        </P>
        <DocCode code={EMULATOR_CODE} lang="ts" label="emulators" />
      </DocSection>

      <DocSection title="TypeScript schema">
        <P>
          Pass a generic type to get full type inference across all Firestore
          operations. Collection names autocomplete and document fields are
          typed automatically.
        </P>
        <DocCode code={SCHEMA_CODE} lang="ts" label="lib/firebase.ts" />
      </DocSection>

      <DocPagination
        prev={{ title: "Installation", href: "/docs/getting-started/installation" }}
        next={{ title: "Quick Start", href: "/docs/getting-started/quick-start" }}
      />
    </DocPage>
  );
}
