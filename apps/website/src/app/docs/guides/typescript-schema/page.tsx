import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { Refirebase } from 'refirebase';

// 1. Define your schema
type MySchema = {
  users: {
    id: string; // reserved for docId
    name: string;
    role: 'admin' | 'user';
    age: number;
    created_at?: number; // auto-managed
    updated_at?: number; // auto-managed
  };
  posts: {
    id: string;
    title: string;
    published: boolean;
    authorId: string;
  };
  'users/posts': { // subcollections can be typed via slash
    title: string;
  }
};

// 2. Initialize with your schema
const refirebase = new Refirebase<MySchema>();
export const { db, auth } = refirebase;

// Now all methods are strictly typed!
const user = await db.firestore.get('users', { docId: '123' });
console.log(user?.name); // typed as string
// db.firestore.add('posts', { title: 123 }) // Error: Type 'number' is not assignable to type 'string'.
`;

export default async function TypeScriptSchemaPage() {
  return (
    <DocPage>
      <DocHeader title="TypeScript Schema" description="How to strongly type your entire Firebase database." />
      <DocSection title="Usage">
        <P>By default, Refirebase methods return <Code>any</Code>. You can get full end-to-end type safety by passing a schema interface to the <Code>Refirebase</Code> constructor.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Schema Definition" />
      </DocSection>
      <DocSection title="How it works">
        <ul>
          <li>The keys of the schema object become the allowed collection names (for both Firestore and Realtime Database).</li>
          <li>The values become the expected document shapes.</li>
          <li>The <Code>id</Code> field is automatically returned on reads and is optional on writes.</li>
          <li>Subcollections can be typed using a string with a slash, e.g., <Code>'users/posts'</Code>.</li>
        </ul>
      </DocSection>
      <DocPagination prev={{ title: "Error Codes", href: "/docs/errors/error-codes" }} next={{ title: "Emulators", href: "/docs/guides/emulators" }} />
    </DocPage>
  );
}
