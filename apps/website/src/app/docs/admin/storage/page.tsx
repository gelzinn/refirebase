import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { admin } from './admin';

async function getAdminBucket() {
  // Access the underlying Cloud Storage bucket directly
  const bucket = admin.db.storage.bucket;
  return bucket;
}`;

export default async function AdminStoragePage() {
  return (
    <DocPage>
      <DocHeader title="Admin Storage" description="Server-side access to Cloud Storage." />
      <DocSection title="Usage">
        <P>Manage files, buckets, and generate signed URLs from the server using Admin privileges.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="server.ts" />
      </DocSection>
      <DocPagination prev={{ title: "Admin Realtime", href: "/docs/admin/realtime" }} next={{ title: "Admin Auth", href: "/docs/admin/auth" }} />
    </DocPage>
  );
}
