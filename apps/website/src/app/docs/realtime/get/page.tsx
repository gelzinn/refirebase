import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const data = await db.realtime.get('config/settings');

if (data && !('error' in data)) {
  console.log('Settings retrieved:', data);
} else {
  console.error('Failed to get data', data?.error);
}
`;

export default async function GetPage() {
  return (
    <DocPage>
      <DocHeader title="get" description="Retrieve data from the Realtime Database once." />
      <DocSection title="Overview">
        <P>The <Code>get</Code> method reads data at a specified path exactly once. This is useful for data that doesn't change frequently or when you don't need real-time updates.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Getting data" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "path", type: "string", required: true, description: "The path to the data in the Realtime Database." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<T | null | { error: unknown }>" description="The data at the path, null if it doesn't exist, or an error object if the operation fails." />
      </DocSection>
      <DocPagination
        prev={{ title: "Firestore batch", href: "/docs/firestore/batch" }}
        next={{ title: "set", href: "/docs/realtime/set" }}
      />
    </DocPage>
  );
}
