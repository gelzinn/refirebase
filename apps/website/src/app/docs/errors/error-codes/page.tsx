import { ERROR_MESSAGES } from 'refirebase';
import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from './firebase';

const { error } = await db.firestore.get('users', '123');

if (error?.code === 'not-found') {
  console.log("User does not exist.");
}`;

export default async function ErrorCodesPage() {
  return (
    <DocPage>
      <DocHeader title="Error Codes" description="Common Refirebase error codes and messages." />
      <DocSection title="Overview">
        <P>Refirebase automatically intercepts Firebase errors and converts them into standardized <Code>RefirebaseError</Code> objects containing a friendly <Code>message</Code> and a recognizable <Code>code</Code>.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Example" />
      </DocSection>
      <DocSection title="All Error Codes">
        <div className="overflow-hidden rounded-xl border border-border mt-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-4 py-2.5 text-left font-semibold">Error Code</th>
                <th className="px-4 py-2.5 text-left font-semibold">Message</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(ERROR_MESSAGES).map(([code, message], i) => (
                <tr
                  key={code}
                  className={`border-b border-border last:border-0 ${i % 2 === 0 ? "bg-card" : "bg-background"}`}
                >
                  <td className="px-4 py-2.5">
                    <Code>{code}</Code>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>
      <DocPagination prev={{ title: "isRefirebaseError", href: "/docs/errors/is-refirebase-error" }} next={{ title: "Introduction", href: "/docs" }} />
    </DocPage>
  );
}
