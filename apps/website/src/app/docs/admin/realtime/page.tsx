import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { admin } from './admin';

async function setServerStatus(status: string) {
  const result = await admin.db.realtime.set('system/status', status);
  if (result.error) console.error(result.error);
}`;

export default async function AdminRealtimePage() {
  return (
    <DocPage>
      <DocHeader title="Admin Realtime Database" description="Server-side access to Realtime Database." />
      <DocSection title="Usage">
        <P>Access the Realtime Database with admin privileges, ensuring you can manage state securely from your server.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="server.ts" />
      </DocSection>
      <DocPagination prev={{ title: "Admin Firestore", href: "/docs/admin/firestore" }} next={{ title: "Admin Storage", href: "/docs/admin/storage" }} />
    </DocPage>
  );
}
