import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const unsubscribe = db.firestore.subscribe(
  'messages',
  (data) => {
    console.log('Real-time data:', data);
  },
  { where: { read: false }, limit: 20 },
  (error) => {
    console.error('Subscription error:', error);
  }
);

// Stop listening when done
// unsubscribe();`;

export default async function SubscribePage() {
  return (
    <DocPage>
      <DocHeader title="subscribe" description="Listen to real-time updates for a document or collection." />
      <DocSection title="Usage">
        <P>Use <Code>db.firestore.subscribe</Code> to fetch data and continue listening to it in real-time. It handles both single documents (via <Code>docId</Code>) and complex queries.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Subscribe to a query" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionName", type: "string", required: true, description: "The name of the collection." },
          { name: "callback", type: "Function", required: true, description: "Called with the new data whenever it changes. Receives an array of documents, a single document, or null." },
          { name: "options", type: "GetById | GetByCondition", required: false, description: "Target a specific docId, or apply where, orderBy, limit, and startAfter clauses." },
          { name: "errorCallback", type: "Function", required: false, description: "Optional callback for listener errors." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="() => void" description="Returns a function that unsubscribes the listener when called." />
      </DocSection>
      <DocPagination
        prev={{ title: "delete", href: "/docs/firestore/delete" }}
        next={{ title: "getGroup", href: "/docs/firestore/get-group" }}
      />
    </DocPage>
  );
}
