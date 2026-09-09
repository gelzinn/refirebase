import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { admin } from './admin';

async function verifyUserToken(token: string) {
  const decoded = await admin.auth.native.verifyIdToken(token);
  return decoded;
}`;

export default async function AdminAuthPage() {
  return (
    <DocPage>
      <DocHeader title="Admin Auth" description="Server-side Firebase Authentication utilities." />
      <DocSection title="Usage">
        <P>Use <Code>admin.auth</Code> to verify tokens, manage users, set custom claims, and more.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="server.ts" />
      </DocSection>
      <DocPagination prev={{ title: "Admin Storage", href: "/docs/admin/storage" }} next={{ title: "isRefirebaseError", href: "/docs/errors/is-refirebase-error" }} />
    </DocPage>
  );
}
