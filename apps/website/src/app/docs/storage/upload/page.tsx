import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const BASIC = `const result = await db.storage.upload('media/photo.jpg', file);
// result.path, result.byteSize, result.contentType`;

const WITH_URL = `// Include a long-lived download URL
const result = await db.storage.upload('public/photo.jpg', file, {
  downloadUrl: true,
});
console.log(result.downloadUrl); // https://...`;

const WITH_TYPE = `// Explicitly set MIME type
const result = await db.storage.upload('data/report.pdf', blob, {
  contentType: 'application/pdf',
});`;

export default async function StorageUploadPage() {
  return (
    <DocPage>
      <DocHeader
        title="upload"
        description="Upload a file to Firebase Storage."
      />
      <DocSection title="Basic usage">
        <P>
          By default, <Code>upload</Code> does not mint a long-lived download URL
          (which requires an extra round-trip). If you need a URL, pass{" "}
          <Code>{"{ downloadUrl: true }"}</Code>.
        </P>
        <DocCode code={BASIC} lang="ts" label="storage.upload" />
      </DocSection>
      <DocSection title="With download URL">
        <DocCode code={WITH_URL} lang="ts" label="with URL" />
      </DocSection>
      <DocSection title="Custom content type">
        <DocCode code={WITH_TYPE} lang="ts" label="contentType" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "filePath", type: "string", required: true, description: "Storage path, e.g. 'avatars/user123.jpg'." },
          { name: "file", type: "Blob", required: true, description: "File to upload. For React Native, use uriToBlob first." },
          { name: "options.downloadUrl", type: "boolean", description: "Include a long-lived download URL in the result.", default: "false" },
          { name: "options.contentType", type: "string", description: "Override the MIME type. Defaults to file.type." },
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<StorageUploadResult>" description="{ path, byteSize, contentType, downloadUrl? }" />
      </DocSection>
      <DocSection title="For React Native">
        <Callout type="tip">
          Device files are URIs, not Blobs. Use{" "}
          <a href="/docs/react-native/uri-to-blob" className="underline">uriToBlob</a>{" "}
          from <Code>refirebase</Code> to convert before uploading.
        </Callout>
      </DocSection>
      <DocPagination
        next={{ title: "uploadWithProgress", href: "/docs/storage/upload-with-progress" }}
      />
    </DocPage>
  );
}
