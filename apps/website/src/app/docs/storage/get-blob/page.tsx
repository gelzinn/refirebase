import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

const blob = await db.storage.getBlob('images/photo.png');
const objectUrl = URL.createObjectURL(blob);`;

export default async function GetBlobPage() {
  return (
    <DocPage>
      <DocHeader title="getBlob" description="Get a file as a Blob." />
      <DocSection title="Usage">
        <P>Useful for displaying images locally or downloading files in the browser. Throws an error if it fails.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Example" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "filePath", type: "string", required: true, description: "The path to the file in Storage." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<Blob>" description="A promise that resolves to the Blob." />
      </DocSection>
    </DocPage>
  );
}
