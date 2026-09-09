import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const BASIC = `import { useUploadTask } from 'refirebase/react';

function AvatarUploader() {
  const { upload, progress, state, result, error, pause, resume, cancel } = useUploadTask();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const uploadResult = await upload('avatars/' + file.name, file, {
      downloadUrl: true,
    });
    if (uploadResult) {
      console.log('Uploaded:', uploadResult.downloadUrl);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFile} disabled={state === 'running'} />
      {state === 'running' && (
        <div>
          <progress value={progress} max={100} />
          <button onClick={pause}>Pause</button>
          <button onClick={cancel}>Cancel</button>
        </div>
      )}
      {state === 'paused' && <button onClick={resume}>Resume</button>}
      {state === 'success' && <p>Done! {result?.byteSize} bytes uploaded.</p>}
      {error && <p>Error: {String(error)}</p>}
    </div>
  );
}`;

export default async function UseUploadTaskPage() {
  return (
    <DocPage>
      <DocHeader
        title="useUploadTask"
        description="File upload hook with real-time progress, pause, resume, and cancel support."
        badge="new"
      />

      <DocSection title="Usage">
        <P>
          <Code>useUploadTask</Code> wraps Firebase's <Code>uploadBytesResumable</Code> and
          exposes progress as a number from 0 to 100, plus control methods.
        </P>
        <DocCode code={BASIC} lang="tsx" label="useUploadTask" />
      </DocSection>

      <DocSection title="Return value">
        <PropTable rows={[
          { name: "upload", type: "(path, file, options?) => Promise<result | null>", description: "Start the upload." },
          { name: "progress", type: "number", description: "Upload progress 0–100." },
          { name: "state", type: "'idle' | 'running' | 'paused' | 'success' | 'error'", description: "Current upload state." },
          { name: "result", type: "StorageUploadResult | null", description: "Upload result after completion." },
          { name: "error", type: "unknown | null", description: "Error if upload failed." },
          { name: "pause", type: "() => void", description: "Pause the active upload." },
          { name: "resume", type: "() => void", description: "Resume a paused upload." },
          { name: "cancel", type: "() => void", description: "Cancel the active upload." },
        ]} />
      </DocSection>

      <DocPagination
        prev={{ title: "usePagination", href: "/docs/react/use-pagination" }}
        next={{ title: "usePresence", href: "/docs/react/use-presence" }}
      />
    </DocPage>
  );
}
