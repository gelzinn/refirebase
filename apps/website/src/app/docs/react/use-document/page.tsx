import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useDocument } from 'refirebase/react';

function UserProfile({ userId }: { userId: string }) {
  const { data: user, loading, error } = useDocument('users', userId);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading user.</p>;
  
  return <div>{user?.name}</div>;
}`;

export default async function UseDocumentPage() {
  return (
    <DocPage>
      <DocHeader title="useDocument" description="Subscribe to a single Firestore document with real-time updates." />
      <DocSection title="Usage">
        <P>The <Code>useDocument</Code> hook listens to a single document in a Firestore collection and provides real-time updates.</P>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="React Component" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionName", type: "string", required: true, description: "The name of the Firestore collection." },
          { name: "docId", type: "string", required: true, description: "The ID of the document to subscribe to." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="{ data: T | null, loading: boolean, error: unknown | null }" description="An object containing the document data, loading state, and any encountered error." />
      </DocSection>
      <DocPagination prev={{ title: "useCollection", href: "/docs/react/use-collection" }} next={{ title: "useValue", href: "/docs/react/use-value" }} />
    </DocPage>
  );
}
