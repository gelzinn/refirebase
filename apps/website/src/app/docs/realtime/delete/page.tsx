import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const result = await db.realtime.delete('sessions/session456');

if (result?.error) {
  console.error('Failed to delete data:', result.error);
} else {
  console.log('Data deleted successfully!');
}
`;

export default async function DeletePage() {
  return (
    <DocPage>
      <DocHeader title="delete" description="Remove data from a specific path in the Realtime Database." />
      <DocSection title="Overview">
        <P>The <Code>delete</Code> method removes all data at the specified path, including its child nodes. This is equivalent to calling <Code>set</Code> with null.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Deleting data" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "path", type: "string", required: true, description: "The path to the data in the Realtime Database." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<undefined | { error: unknown }>" description="Returns undefined on success, or an error object if the operation fails." />
      </DocSection>
      <DocPagination
        prev={{ title: "update", href: "/docs/realtime/update" }}
        next={{ title: "Realtime DB push", href: "/docs/realtime/push" }}
      />
    </DocPage>
  );
}
