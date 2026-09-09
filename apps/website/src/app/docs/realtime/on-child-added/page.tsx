import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const stop = db.realtime.onChildAdded('messages', (child) => {
  console.log(child.key, child.val());
});

// Later, to stop listening:
stop();`;

export default async function OnChildAddedPage() {
  return (
    <DocPage>
      <DocHeader title="onChildAdded" description="Listen for new child nodes added at the given path." />
      <DocSection title="Usage">
        <P>Ideal for list-style data such as chat messages or activity feeds. Fires for each existing child and then for any new children added.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Example" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "path", type: "string", required: true, description: "The path to the parent node." },
          { name: "callback", type: "(snapshot: DataSnapshot) => void", required: true, description: "Function called when a child is added." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="() => void" description="An unsubscribe function to stop listening." />
      </DocSection>
    </DocPage>
  );
}
