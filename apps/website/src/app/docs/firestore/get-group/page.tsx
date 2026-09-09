import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const result = await db.firestore.getGroup('messages', {
  orderBy: [{ field: 'created_at', direction: 'desc' }],
  limit: 50,
});

if ('error' in result) {
  console.error('Error fetching group:', result.error);
} else {
  console.log('Group results:', result);
}`;

export default async function GetGroupPage() {
  return (
    <DocPage>
      <DocHeader title="getGroup" description="Query across all subcollections with the same name." badge="new" />
      <DocSection title="Usage">
        <P>Use <Code>db.firestore.getGroup</Code> to fetch documents from any subcollection sharing the same name using Firestore's <Code>collectionGroup</Code> feature.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Collection group query" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionId", type: "string", required: true, description: "The ID of the collection group to query (e.g., 'messages')." },
          { name: "options", type: "GetByCondition", required: false, description: "Query modifiers like where clauses, orderBy, limit, and startAfter." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<ReturnGenericObj<T>[] | FirestoreError>" description="Returns an array of matched documents or an error object." />
      </DocSection>
      <DocPagination
        prev={{ title: "subscribe", href: "/docs/firestore/subscribe" }}
        next={{ title: "count", href: "/docs/firestore/count" }}
      />
    </DocPage>
  );
}
