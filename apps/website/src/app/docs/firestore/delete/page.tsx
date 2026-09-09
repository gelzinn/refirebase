import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const result = await db.firestore.delete('users', 'user-123');

if (result?.error) {
  console.error('Error deleting document:', result.error);
}`;

export default async function DeletePage() {
  return (
    <DocPage>
      <DocHeader title="delete" description="Delete a document from a collection." />
      <DocSection title="Usage">
        <P>Use <Code>db.firestore.delete</Code> to entirely remove a document from a collection.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Delete a document" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionName", type: "string", required: true, description: "The name of the collection." },
          { name: "docId", type: "string", required: true, description: "The ID of the document to delete." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<undefined | FirestoreError>" description="Returns undefined on success, or an error object on failure." />
      </DocSection>
      <DocPagination
        prev={{ title: "update", href: "/docs/firestore/update" }}
        next={{ title: "subscribe", href: "/docs/firestore/subscribe" }}
      />
    </DocPage>
  );
}
