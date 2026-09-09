import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `// .env.local
FIREBASE_USE_EMULATORS=true
FIREBASE_PROJECT_ID=demo-project`;

const JS_CODE = `import { Refirebase } from 'refirebase';

// Just pass useEmulators: true in the config object
// OR rely on the FIREBASE_USE_EMULATORS env var.
const firebase = new Refirebase({
  useEmulators: true
});

// Emulators automatically bind to standard ports:
// Firestore: 8080
// Auth: 9099
// Realtime DB: 9000
// Storage: 9199`;

export default async function EmulatorsPage() {
  return (
    <DocPage>
      <DocHeader title="Firebase Emulators" description="Connecting to local Firebase Emulators for development." />
      <DocSection title="Usage">
        <P>Refirebase automatically connects to the Firebase Local Emulator Suite if you set the <Code>useEmulators</Code> flag to true. You don't need to manually import or configure the connection methods.</P>
        <DocCode code={EXAMPLE_CODE} lang="bash" label=".env" />
        <DocCode code={JS_CODE} lang="ts" label="firebase.ts" />
      </DocSection>
      <DocSection title="Default Ports">
        <P>Refirebase expects the emulators to be running on their default ports. Ensure your <Code>firebase.json</Code> matches these values:</P>
        <div className="overflow-hidden rounded-xl border border-border mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-2.5 text-left font-semibold">Emulator</th>
                <th className="px-4 py-2.5 text-left font-semibold">Default Host:Port</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Firestore', url: 'http://localhost:8080' },
                { name: 'Auth', url: 'http://localhost:9099' },
                { name: 'Realtime DB', url: 'http://localhost:9000' },
                { name: 'Storage', url: 'http://localhost:9199' },
              ].map((item, i) => (
                <tr
                  key={item.name}
                  className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-card" : "bg-background"}`}
                >
                  <td className="px-4 py-2.5 font-medium">
                    {item.name}
                  </td>
                  <td className="px-4 py-2.5">
                    <Code>{item.url}</Code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>
      <DocPagination prev={{ title: "TypeScript Schema", href: "/docs/guides/typescript-schema" }} next={{ title: "Next.js Setup", href: "/docs/guides/nextjs" }} />
    </DocPage>
  );
}
