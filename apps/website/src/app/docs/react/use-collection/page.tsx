import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Returns, PropTable, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useCollection } from 'refirebase/react';

export function PostList() {
  const { data, loading, error } = useCollection('posts', {
    where: [{ field: 'published', op: '==', value: true }],
    orderBy: [{ field: 'createdAt', direction: 'desc' }],
    limit: 10
  });

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <ul>
      {data.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  );
}`;

export default async function UseCollectionPage() {
  return (
    <DocPage>
      <DocHeader title="useCollection" description="Hook to subscribe to a Firestore collection with real-time updates." />
      <DocSection title="Usage">
        <P>Automatically sets up a snapshot listener on a collection or query and returns the live data. Unsubscribes when the component unmounts.</P>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="PostList.tsx" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionName", type: "string", required: true, description: "The name of the collection." },
          { name: "options", type: "GetByCondition<T>", required: false, description: "Query options (where, orderBy, limit, etc.)." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="{ data: T[], loading: boolean, error: unknown | null }" description="The real-time list of documents, loading state, and any error encountered." />
      </DocSection>
    </DocPage>
  );
}
