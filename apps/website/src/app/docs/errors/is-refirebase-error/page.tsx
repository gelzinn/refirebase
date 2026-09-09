import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { isRefirebaseError } from 'refirebase';
import { db } from './firebase';

async function fetchUser(id: string) {
  const result = await db.firestore.get('users', id);
  
  if (isRefirebaseError(result)) {
    console.error("Failed to fetch user:", result.error.message);
    return null;
  }
  
  return result.data;
}`;

export default async function IsRefirebaseErrorPage() {
  return (
    <DocPage>
      <DocHeader title="isRefirebaseError" description="Type guard to check if a value is a RefirebaseError result." />
      <DocSection title="Usage">
        <P>Instead of throwing exceptions, Refirebase methods return a <Code>{`{ data, error }`}</Code> object. Use <Code>isRefirebaseError</Code> to safely check if an operation failed.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Type Guard" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "result", type: "unknown", required: true, description: "The result object returned from a Refirebase operation." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="boolean" description="Returns true if the object contains a RefirebaseError under the 'error' key." />
      </DocSection>
      <DocPagination prev={{ title: "Admin Auth", href: "/docs/admin/auth" }} next={{ title: "Error Codes", href: "/docs/errors/error-codes" }} />
    </DocPage>
  );
}
