import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const BASIC = `import { usePagination } from 'refirebase/react';

function PostList() {
  const { data, loading, loadingMore, hasMore, loadMore, error } = usePagination('posts', {
    orderBy: [{ field: 'created_at', direction: 'desc' }],
    pageSize: 20,
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>

      {hasMore && (
        <button onClick={loadMore} disabled={loadingMore}>
          {loadingMore ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}`;

export default async function UsePaginationPage() {
  return (
    <DocPage>
      <DocHeader
        title="usePagination"
        description="Paginated Firestore queries with automatic cursor management."
        badge="new"
      />

      <DocSection title="Usage">
        <P>
          <Code>usePagination</Code> manages the <Code>startAfter</Code> cursor
          automatically. Call <Code>loadMore</Code> to fetch the next page;
          documents accumulate in the <Code>data</Code> array.
        </P>
        <DocCode code={BASIC} lang="tsx" label="usePagination" />
      </DocSection>

      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "collectionName", type: "string", required: true, description: "Firestore collection path." },
          { name: "options.pageSize", type: "number", description: "Documents per page.", default: "20" },
          { name: "options.where", type: "WhereCondition", description: "Filter conditions." },
          { name: "options.orderBy", type: "{ field, direction }[]", description: "Sort order." },
        ]} />
      </DocSection>

      <DocSection title="Return value">
        <PropTable rows={[
          { name: "data", type: "T[]", description: "Accumulated documents from all loaded pages." },
          { name: "loading", type: "boolean", description: "True during the initial load." },
          { name: "loadingMore", type: "boolean", description: "True while loading the next page." },
          { name: "hasMore", type: "boolean", description: "False when all pages have been loaded." },
          { name: "loadMore", type: "() => void", description: "Load the next page." },
          { name: "error", type: "unknown | null", description: "Error from the last operation." },
        ]} />
      </DocSection>

      <DocPagination
        prev={{ title: "useValue", href: "/docs/react/use-value" }}
        next={{ title: "useUploadTask", href: "/docs/react/use-upload-task" }}
      />
    </DocPage>
  );
}
