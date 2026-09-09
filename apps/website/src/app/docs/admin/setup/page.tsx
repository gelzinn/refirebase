import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { RefirebaseAdmin } from 'refirebase/admin';

export const admin = new RefirebaseAdmin({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
});`;

export default async function AdminSetupPage() {
  return (
    <DocPage>
      <DocHeader title="Admin Setup" description="Initialize Refirebase Admin SDK for server-side usage." />
      <DocSection title="Initialization">
        <P>The <Code>RefirebaseAdmin</Code> class initializes a server-side Firebase environment using <Code>firebase-admin</Code>.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="admin.ts" />
        <P>You can also omit the arguments if the standard <Code>FIREBASE_PROJECT_ID</Code>, <Code>FIREBASE_CLIENT_EMAIL</Code>, and <Code>FIREBASE_PRIVATE_KEY</Code> environment variables are set.</P>
      </DocSection>
      <DocPagination prev={{ title: "React Native Hooks", href: "/docs/react-native/hooks" }} next={{ title: "Admin Firestore", href: "/docs/admin/firestore" }} />
    </DocPage>
  );
}
