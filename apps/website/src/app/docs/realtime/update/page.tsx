import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

// Only updates the 'role' field, leaving 'name' untouched
const result = await db.realtime.update('users/user123', {
  role: 'superadmin'
});

if (result?.error) {
  console.error('Failed to update data:', result.error);
} else {
  console.log('Data updated successfully!');
}
`;

export default async function UpdatePage() {
  return (
    <DocPage>
      <DocHeader title="update" description="Update specific children at a path without overwriting other data." />
      <DocSection title="Overview">
        <P>The <Code>update</Code> method merges the provided object with the existing data at the path. Only the specified keys are modified, while other fields remain untouched.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Updating data" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "path", type: "string", required: true, description: "The path to the data in the Realtime Database." },
          { name: "data", type: "Partial<T>", required: true, description: "The subset of data fields to update." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<undefined | { error: unknown }>" description="Returns undefined on success, or an error object if the operation fails." />
      </DocSection>
      <DocPagination
        prev={{ title: "set", href: "/docs/realtime/set" }}
        next={{ title: "delete", href: "/docs/realtime/delete" }}
      />
    </DocPage>
  );
}
