import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const result = await db.firestore.update('users', 'user-123', {
  age: 29
});

if (result?.error) {
  console.error('Error updating document:', result.error);
}`;

export default async function UpdatePage() {
  return (
    <DocPage>
      <DocHeader title="update" description="Update specific fields of an existing document." />
      <DocSection title="Usage">
        <P>Use <Code>db.firestore.update</Code> to modify parts of a document without replacing everything. It automatically updates the <Code>updated_at</Code> timestamp.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Update document fields" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionName", type: "string", required: true, description: "The name of the collection." },
          { name: "docId", type: "string", required: true, description: "The ID of the document to update." },
          { name: "data", type: "Partial<T>", required: true, description: "The specific fields to update." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<undefined | FirestoreError>" description="Returns undefined on success, or an error object on failure." />
      </DocSection>
      <DocPagination
        prev={{ title: "set", href: "/docs/firestore/set" }}
        next={{ title: "delete", href: "/docs/firestore/delete" }}
      />
    </DocPage>
  );
}
