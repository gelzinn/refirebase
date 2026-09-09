import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useValue } from 'refirebase/react';

function Status() {
  const { data: status, loading, error } = useValue('system/status');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading status.</p>;
  
  return <div>System status: {status}</div>;
}`;

export default async function UseValuePage() {
  return (
    <DocPage>
      <DocHeader title="useValue" description="Subscribe to a Realtime Database path with real-time updates." />
      <DocSection title="Usage">
        <P>The <Code>useValue</Code> hook listens to a specific path in the Firebase Realtime Database and updates automatically when data changes.</P>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="React Component" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "path", type: "string", required: true, description: "The Realtime Database path to subscribe to." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="{ data: T | null, loading: boolean, error: unknown | null }" description="An object containing the path data, loading state, and any error." />
      </DocSection>
      <DocPagination prev={{ title: "useDocument", href: "/docs/react/use-document" }} next={{ title: "RefirebaseNative", href: "/docs/react-native/refirebase-native" }} />
    </DocPage>
  );
}
