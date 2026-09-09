import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { admin } from './admin';

async function updateServerUser(id: string) {
  const result = await admin.db.firestore.update('users', id, { verified: true });
  if (result.error) console.error(result.error);
}`;

export default async function AdminFirestorePage() {
  return (
    <DocPage>
      <DocHeader title="Admin Firestore" description="Server-side access to Firestore." />
      <DocSection title="Usage">
        <P>The Admin SDK provides privileged access to Firestore, bypassing security rules. It wraps standard admin methods returning <Code>{`{ data, error }`}</Code> for easier error handling.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="server.ts" />
      </DocSection>
      <DocPagination prev={{ title: "Admin Setup", href: "/docs/admin/setup" }} next={{ title: "Admin Realtime", href: "/docs/admin/realtime" }} />
    </DocPage>
  );
}
