import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const unsubscribe = await db.realtime.onValue('users/123', (data) => {
  console.log('User data:', data);
});

// Later, to stop listening:
unsubscribe();`;

export default async function OnValuePage() {
  return (
    <DocPage>
      <DocHeader title="onValue" description="Subscribe to real-time value changes at the given path." />
      <DocSection title="Usage">
        <P>Fires immediately with the current value, then on every change.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Example" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "path", type: "string", required: true, description: "The path to the data in the database." },
          { name: "callback", type: "(data: T | null) => void", required: true, description: "Function called immediately and whenever the data changes." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<() => void>" description="A promise that resolves to an unsubscribe function." />
      </DocSection>
    </DocPage>
  );
}
