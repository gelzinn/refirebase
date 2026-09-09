import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const buffer = await db.storage.getBytes('docs/report.pdf');
console.log(buffer.byteLength);`;

export default async function GetBytesPage() {
  return (
    <DocPage>
      <DocHeader title="getBytes" description="Get the raw bytes of a file." />
      <DocSection title="Usage">
        <P>Downloads the file entirely into memory as an ArrayBuffer. Throws an error if the download fails.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Example" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "filePath", type: "string", required: true, description: "The path to the file in Storage." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<ArrayBuffer>" description="A promise that resolves to the raw file bytes." />
      </DocSection>
    </DocPage>
  );
}
