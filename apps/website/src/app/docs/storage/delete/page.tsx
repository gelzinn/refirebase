import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

await db.storage.delete('images/old-photo.png');`;

export default async function DeletePage() {
  return (
    <DocPage>
      <DocHeader title="delete" description="Delete a file from Storage." />
      <DocSection title="Usage">
        <P>Permanently removes the specified file. Throws an error if the deletion fails.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Example" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "filePath", type: "string", required: true, description: "The path to the file in Storage." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<void>" description="A promise that resolves when the file is deleted." />
      </DocSection>
    </DocPage>
  );
}
