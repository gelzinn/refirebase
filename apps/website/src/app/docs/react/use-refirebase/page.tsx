import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Returns, DocPagination, Callout
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useRefirebase } from 'refirebase/react';

export function MyComponent() {
  const { auth, db } = useRefirebase();

  const handleAction = async () => {
    // Access auth methods
    await auth.handleSignOut();
    
    // Access database methods directly
    const userDoc = await db.firestore.get('users', { docId: '123' });
  };

  return <button onClick={handleAction}>Action</button>;
}`;

export default async function UseRefirebasePage() {
  return (
    <DocPage>
      <DocHeader title="useRefirebase" description="Hook to access the global Refirebase instance." />
      <DocSection title="Usage">
        <P>Returns the instance provided by <Code>RefirebaseProvider</Code>. This is the primary way to access <Code>auth</Code>, <Code>db.firestore</Code>, <Code>db.realtime</Code>, and <Code>db.storage</Code> in your React components.</P>
        <Callout type="note">This hook must be used within a component wrapped in <Code>RefirebaseProvider</Code>.</Callout>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="MyComponent.tsx" />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Refirebase<T>" description="The initialized Refirebase instance." />
      </DocSection>
    </DocPage>
  );
}
