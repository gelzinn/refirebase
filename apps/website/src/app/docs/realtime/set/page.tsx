import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const result = await db.realtime.set('users/user123', {
  name: 'Alice',
  role: 'admin'
});

if (result?.error) {
  console.error('Failed to set data:', result.error);
} else {
  console.log('Data set successfully!');
}
`;

export default async function SetPage() {
  return (
    <DocPage>
      <DocHeader title="set" description="Write or replace data to a specific path in the Realtime Database." />
      <DocSection title="Overview">
        <P>The <Code>set</Code> method writes data to the specified path, replacing any existing data at that path and its child nodes.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Setting data" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "path", type: "string", required: true, description: "The path to the data in the Realtime Database." },
          { name: "data", type: "T", required: true, description: "The data to be written at the specified path." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<undefined | { error: unknown }>" description="Returns undefined on success, or an error object if the operation fails." />
      </DocSection>
      <DocPagination
        prev={{ title: "get", href: "/docs/realtime/get" }}
        next={{ title: "update", href: "/docs/realtime/update" }}
      />
    </DocPage>
  );
}
