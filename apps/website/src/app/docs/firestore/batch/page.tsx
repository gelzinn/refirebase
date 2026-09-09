import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const batch = db.firestore.batch();

// Queue multiple writes
batch.set('users', 'user1', { name: 'Alice' });
batch.update('users', 'user2', { status: 'active' });
batch.delete('users', 'user3');

// Commit all operations as a single atomic unit
await batch.commit();
console.log('Batch committed!');
`;

export default async function BatchPage() {
  return (
    <DocPage>
      <DocHeader title="batch" description="Perform multiple write operations as a single batch." />
      <DocSection title="Overview">
        <P>The <Code>batch</Code> method creates a new <Code>FirestoreWriteBatch</Code> which allows you to group up to 500 write operations (<Code>set</Code>, <Code>update</Code>, <Code>delete</Code>) into a single atomic operation. Batched writes complete only if all operations succeed.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Using a write batch" />
      </DocSection>
      <DocSection title="Parameters">
        <P>This method takes no parameters. It returns a <Code>FirestoreWriteBatch</Code> instance.</P>
      </DocSection>
      <DocSection title="Return value">
        <Returns type="FirestoreWriteBatch" description="An object with methods to set, update, delete, and commit batched operations." />
      </DocSection>
      <DocPagination
        prev={{ title: "runTransaction", href: "/docs/firestore/run-transaction" }}
        next={{ title: "Realtime DB get", href: "/docs/realtime/get" }}
      />
    </DocPage>
  );
}
