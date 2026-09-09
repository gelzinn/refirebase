import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const NEXTJS_CODE = `// lib/firebase.ts
import { Refirebase } from 'refirebase';

// Singleton pattern — safe for Next.js
const refirebase = new Refirebase();
export const { db, auth, analytics } = refirebase;`;

const PROVIDER_CODE = `// app/providers.tsx
'use client';

import { RefirebaseProvider } from 'refirebase/react';
import { refirebase } from '@/lib/firebase';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <RefirebaseProvider instance={refirebase}>
      {children}
    </RefirebaseProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}`;

const SERVER_CODE = `// app/users/page.tsx (Server Component)
import { db } from '@/lib/firebase';

export default async function UsersPage() {
  const users = await db.firestore.get('users');
  return <ul>{users?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}`;

const ENV_CODE = `# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...

# Server / Admin SDK
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...`;

export default async function NextjsGuidePage() {
  return (
    <DocPage>
      <DocHeader
        title="Next.js Setup"
        description="Set up Refirebase in a Next.js App Router project."
      />

      <DocSection title="Environment variables">
        <P>
          Next.js requires the <Code>NEXT_PUBLIC_</Code> prefix for client-accessible
          variables. Refirebase reads both <Code>FIREBASE_*</Code> and{" "}
          <Code>NEXT_PUBLIC_FIREBASE_*</Code> automatically.
        </P>
        <DocCode code={ENV_CODE} lang="bash" label=".env.local" />
      </DocSection>

      <DocSection title="Singleton instance">
        <P>
          Create one shared instance and export <Code>db</Code>,{" "}
          <Code>auth</Code>, and <Code>analytics</Code> from it.
        </P>
        <DocCode code={NEXTJS_CODE} lang="ts" label="lib/firebase.ts" />
      </DocSection>

      <DocSection title="React Provider (Client Components)">
        <P>
          Wrap your app in <Code>RefirebaseProvider</Code> inside a{" "}
          <Code>'use client'</Code> component so hooks work throughout the app.
        </P>
        <DocCode code={PROVIDER_CODE} lang="tsx" label="app/layout.tsx" />
      </DocSection>

      <DocSection title="Server Components">
        <P>
          Use <Code>db</Code> directly in Server Components for SSR data
          fetching — no provider needed.
        </P>
        <DocCode code={SERVER_CODE} lang="tsx" label="Server Component" />
        <Callout type="tip">
          The Admin SDK (<Code>refirebase/admin</Code>) is recommended for
          server-side privileged operations. Use the client SDK for SSR-only
          data reads.
        </Callout>
      </DocSection>

      <DocPagination
        prev={{ title: "Firebase Emulators", href: "/docs/guides/emulators" }}
        next={{ title: "Expo Setup", href: "/docs/guides/expo" }}
      />
    </DocPage>
  );
}
