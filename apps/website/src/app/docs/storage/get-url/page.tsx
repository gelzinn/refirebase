import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const url = await db.storage.getUrl('avatars/me.jpg');
console.log(url);`;

export default async function GetUrlPage() {
  return (
    <DocPage>
      <DocHeader title="getUrl" description="Get a long-lived download URL for a file in Storage." />
      <DocSection title="Usage">
        <P>Prefer <Code>getBytes</Code> or signed URLs for private files. Throws an error if the operation fails.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Example" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "filePath", type: "string", required: true, description: "The path to the file in Storage." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<string>" description="A promise that resolves to the download URL." />
      </DocSection>
    </DocPage>
  );
}
