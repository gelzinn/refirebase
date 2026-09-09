import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const BASIC = `const { task, promise } = db.storage.uploadWithProgress(
  'videos/clip.mp4',
  file,
  {
    onProgress: (pct) => console.log(pct + '%'),
    downloadUrl: true,
  },
);

// Await the result
const result = await promise;
console.log(result.downloadUrl);`;

const CONTROL = `const { task, promise } = db.storage.uploadWithProgress('files/doc.pdf', file);

// Control the upload
task.pause();
task.resume();
task.cancel();

// Or await result
const result = await promise;`;

const HOOK = `// For React, use the hook instead
import { useUploadTask } from 'refirebase/react';

const { upload, progress, state, pause, resume, cancel } = useUploadTask();

await upload('avatars/me.jpg', file, { downloadUrl: true });`;

export default async function UploadWithProgressPage() {
  return (
    <DocPage>
      <DocHeader
        title="uploadWithProgress"
        description="Upload a file with real-time progress reporting and pause/resume/cancel control."
        badge="new"
      />
      <DocSection title="Usage">
        <P>
          Returns both the underlying Firebase <Code>UploadTask</Code> for
          control and a <Code>Promise</Code> that resolves to the final result.
          The <Code>onProgress</Code> callback fires with a number from 0 to 100.
        </P>
        <DocCode code={BASIC} lang="ts" label="uploadWithProgress" />
      </DocSection>
      <DocSection title="Pause, resume, cancel">
        <DocCode code={CONTROL} lang="ts" label="task control" />
      </DocSection>
      <DocSection title="React hook">
        <P>For React, use the <Code>useUploadTask</Code> hook instead, which manages state automatically.</P>
        <DocCode code={HOOK} lang="tsx" label="useUploadTask" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "filePath", type: "string", required: true, description: "Storage path." },
          { name: "file", type: "Blob", required: true, description: "File to upload." },
          { name: "options.onProgress", type: "(pct: number) => void", description: "Callback fired with progress 0–100." },
          { name: "options.downloadUrl", type: "boolean", description: "Include a download URL in the result.", default: "false" },
          { name: "options.contentType", type: "string", description: "Override MIME type." },
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="{ task: UploadTask; promise: Promise<StorageUploadResult> }" description="task for pause/resume/cancel control, promise resolves to the upload result." />
      </DocSection>
      <DocPagination
        prev={{ title: "upload", href: "/docs/storage/upload" }}
        next={{ title: "getUrl", href: "/docs/storage/get-url" }}
      />
    </DocPage>
  );
}
