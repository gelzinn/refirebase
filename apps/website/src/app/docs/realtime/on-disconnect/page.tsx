import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

// Set online status
await db.realtime.set('presence/uid', true);

// Remove data when client disconnects
db.realtime.onDisconnect('presence/uid').remove();`;

export default async function OnDisconnectPage() {
  return (
    <DocPage>
      <DocHeader title="onDisconnect" description="Manage presence by writing or deleting data when the client disconnects." />
      <DocSection title="Usage">
        <P>Typical use is to update presence information when a user goes offline.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Example" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "path", type: "string", required: true, description: "The path to the data." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Object" description="An object containing `set`, `update`, `remove`, and `cancel` methods." />
      </DocSection>
    </DocPage>
  );
}
