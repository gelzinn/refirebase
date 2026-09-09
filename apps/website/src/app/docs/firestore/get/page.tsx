import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const BASIC = `import { db } from '@/lib/firebase';

// All docs in a collection
const users = await db.firestore.get('users');

// Single document by ID
const user = await db.firestore.get('users', { docId: 'user-123' });
// → returns [{ id: 'user-123', name: '...', ... }] or null`;

const WITH_WHERE = `// Equality
const admins = await db.firestore.get('users', {
  where: { role: 'admin' },
});

// Inequality
const others = await db.firestore.get('users', {
  where: { role: { not: 'admin' } },
});

// Operators: >, >=, <, <=, !=, in, not-in, array-contains, array-contains-any
const seniors = await db.firestore.get('users', {
  where: { age: { operator: '>=', value: 18 } },
});

// Nested fields (dot notation)
const verified = await db.firestore.get('users', {
  where: { 'profile.verified': true },
});`;

const WITH_OPTIONS = `const recent = await db.firestore.get('posts', {
  where: { published: true },
  orderBy: [{ field: 'created_at', direction: 'desc' }],
  limit: 20,
});`;

const SUBCOLLECTION = `// Odd number of path segments = collection
const messages = await db.firestore.get('conversations/conv-abc/messages', {
  orderBy: [{ field: 'sent_at', direction: 'asc' }],
  limit: 50,
});`;

const PAGINATION = `// First page
const page1 = await db.firestore.get('posts', { limit: 20 });

// Next page — pass the last doc from previous page as cursor
const lastDoc = page1[page1.length - 1];
const page2 = await db.firestore.get('posts', {
  limit: 20,
  startAfter: lastDoc,
});`;

const ERROR = `import { isRefirebaseError } from 'refirebase';

const result = await db.firestore.get('users');

if (isRefirebaseError(result)) {
  console.error(result.error.code, result.error.message);
} else {
  // result is ReturnGenericObj<User>[]
}`;

export default async function FirestoreGetPage() {
  return (
    <DocPage>
      <DocHeader
        title="get"
        description="Fetch one or more documents from a Firestore collection."
      />

      <DocSection title="Basic usage">
        <DocCode code={BASIC} lang="ts" label="firestore.get" />
      </DocSection>

      <DocSection title="Filtering with where">
        <P>
          The <Code>where</Code> object accepts field equality, inequality, and
          operator-based conditions. Fields can be nested using dot notation.
        </P>
        <DocCode code={WITH_WHERE} lang="ts" label="where" />
        <Callout type="warning">
          Firestore requires a composite index for queries that combine{" "}
          <Code>where</Code> on different fields with <Code>orderBy</Code>.
          See the{" "}
          <a
            href="https://firebase.google.com/docs/firestore/query-data/queries#query_limitations"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Firebase query limitations
          </a>
          .
        </Callout>
      </DocSection>

      <DocSection title="Ordering and limiting">
        <DocCode code={WITH_OPTIONS} lang="ts" label="orderBy + limit" />
      </DocSection>

      <DocSection title="Subcollections">
        <P>
          Pass a path with an odd number of segments to target a subcollection.
        </P>
        <DocCode code={SUBCOLLECTION} lang="ts" label="subcollection" />
      </DocSection>

      <DocSection title="Pagination">
        <P>
          Pass <Code>startAfter</Code> with the last document from the previous
          page to cursor-paginate.
        </P>
        <DocCode code={PAGINATION} lang="ts" label="pagination" />
        <Callout type="tip">
          For React, use the <a href="/docs/react/use-pagination" className="underline">usePagination</a>{" "}
          hook which manages the cursor automatically.
        </Callout>
      </DocSection>

      <DocSection title="Error handling">
        <P>
          On failure, <Code>get</Code> returns <Code>{`{ error }`}</Code> instead
          of throwing. Use <Code>isRefirebaseError</Code> to narrow the type.
        </P>
        <DocCode code={ERROR} lang="ts" label="error handling" />
      </DocSection>

      <DocSection title="Parameters">
        <PropTable
          rows={[
            { name: "collectionName", type: "string", required: true, description: "Collection path. May include subcollection segments, e.g. conversations/id/messages." },
            { name: "options.docId", type: "string", description: "Fetch a single document by ID." },
            { name: "options.where", type: "WhereCondition<T>", description: "Filter conditions. Supports equality, not, and operator objects." },
            { name: "options.orderBy", type: "{ field, direction }[]", description: "Sort results. direction is 'asc' or 'desc'." },
            { name: "options.limit", type: "number", description: "Maximum number of documents to return." },
            { name: "options.startAfter", type: "unknown", description: "Pagination cursor — pass the last document from the previous page." },
          ]}
        />
      </DocSection>

      <DocSection title="Return value">
        <Returns
          type="Promise<T[] | null | { error }>"
          description="Array of documents (each with an id field), null when fetching by docId and not found, or an error object on failure."
        />
      </DocSection>

      <DocPagination
        prev={{ title: "Quick Start", href: "/docs/getting-started/quick-start" }}
        next={{ title: "add", href: "/docs/firestore/add" }}
      />
    </DocPage>
  );
}
