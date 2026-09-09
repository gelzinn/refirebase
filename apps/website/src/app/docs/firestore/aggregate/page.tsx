import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const stats = await db.firestore.aggregate('orders', {
  sum: 'totalAmount',
  average: 'totalAmount'
}, {
  where: { status: 'completed' }
});

if (!('error' in stats)) {
  console.log(\`Total Revenue: \${stats.sum}\`);
  console.log(\`Average Order: \${stats.average}\`);
} else {
  console.error(stats.error);
}
`;

export default async function AggregatePage() {
  return (
    <DocPage>
      <DocHeader title="aggregate" description="Run server-side aggregate queries (sum, average) on a collection." />
      <DocSection title="Overview">
        <P>The <Code>aggregate</Code> method performs server-side aggregation for summation and averaging. Like <Code>count</Code>, it does not retrieve full document data, ensuring performance and cost-efficiency when analyzing metrics across a collection.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Aggregating data" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionName", type: "string", required: true, description: "The name of the Firestore collection." },
          { name: "fields", type: "{ sum?: string; average?: string }", required: true, description: "Specifies which fields to sum and/or average." },
          { name: "options", type: "GetByCondition<T>", required: false, description: "Optional query filters to apply before aggregating." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<{ sum?: number | null; average?: number | null } | FirestoreError>" description="Returns an object containing the sum and/or average values, or a FirestoreError object if an error occurs." />
      </DocSection>
      <DocPagination
        prev={{ title: "count", href: "/docs/firestore/count" }}
        next={{ title: "runTransaction", href: "/docs/firestore/run-transaction" }}
      />
    </DocPage>
  );
}
