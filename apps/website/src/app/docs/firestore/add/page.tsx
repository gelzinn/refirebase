import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const result = await db.firestore.add('users', {
  name: 'John Doe',
  age: 30
});

if ('error' in result) {
  console.error('Error adding document:', result.error);
} else {
  console.log('Added document with ID:', result.id);
}`;

export default async function AddPage() {
  return (
    <DocPage>
      <DocHeader title="add" description="Add a new document to a collection in Firestore." />
      <DocSection title="Usage">
        <P>Use <Code>db.firestore.add</Code> to add a new document. If you don't provide a <Code>docId</Code>, Firestore generates one for you. This method also automatically appends <Code>created_at</Code> and <Code>updated_at</Code> timestamps.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Add a new document" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionName", type: "string", required: true, description: "The name of the collection." },
          { name: "data", type: "T", required: true, description: "The data to store." },
          { name: "docId", type: "string", required: false, description: "An optional ID for the document." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<ReturnGenericObj<T> | FirestoreError>" description="Returns the inserted document data (including its generated ID), or an error object if the operation fails." />
      </DocSection>
      <DocPagination
        prev={{ title: "Firestore Overview", href: "/docs/firestore" }}
        next={{ title: "set", href: "/docs/firestore/set" }}
      />
    </DocPage>
  );
}
