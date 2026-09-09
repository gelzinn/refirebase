import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const result = await db.firestore.set('users', 'user-123', {
  name: 'Jane Doe',
  age: 28
});

if (result?.error) {
  console.error('Error setting document:', result.error);
} else {
  console.log('Document successfully set!');
}`;

export default async function SetPage() {
  return (
    <DocPage>
      <DocHeader title="set" description="Write data to a specific document, overwriting it if it already exists." />
      <DocSection title="Usage">
        <P>Use <Code>db.firestore.set</Code> to overwrite a document entirely or create a new one with a specific ID. It automatically updates the <Code>updated_at</Code> timestamp.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Set document data" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionName", type: "string", required: true, description: "The name of the collection." },
          { name: "docId", type: "string", required: true, description: "The ID of the document to write." },
          { name: "data", type: "T", required: true, description: "The data to set." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<undefined | FirestoreError>" description="Returns undefined on success, or an error object on failure." />
      </DocSection>
      <DocPagination
        prev={{ title: "add", href: "/docs/firestore/add" }}
        next={{ title: "update", href: "/docs/firestore/update" }}
      />
    </DocPage>
  );
}
