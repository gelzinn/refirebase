import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

// Count all documents in the 'users' collection
const totalUsers = await db.firestore.count('users');

// Count active users with filters
const activeUsers = await db.firestore.count('users', {
  where: { active: true }
});

if (typeof activeUsers === 'number') {
  console.log(\`There are \${activeUsers} active users.\`);
} else {
  console.error(activeUsers.error);
}
`;

export default async function CountPage() {
  return (
    <DocPage>
      <DocHeader title="count" description="Count documents in a Firestore collection efficiently." />
      <DocSection title="Overview">
        <P>The <Code>count</Code> method uses Firestore's server-side aggregation feature to count documents matching optional filters without actually retrieving the document data. This makes it highly efficient and cost-effective compared to traditional client-side counting.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Counting documents" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionName", type: "string", required: true, description: "The name of the Firestore collection." },
          { name: "options", type: "GetByCondition<T>", required: false, description: "Optional query filters, such as where clauses." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<number | FirestoreError>" description="Returns the number of documents matching the query, or a FirestoreError object if an error occurs." />
      </DocSection>
      <DocPagination
        prev={{ title: "getGroup", href: "/docs/firestore/get-group" }}
        next={{ title: "aggregate", href: "/docs/firestore/aggregate" }}
      />
    </DocPage>
  );
}
