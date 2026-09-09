import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const CODE = `import { uriToBlob } from 'refirebase';
import * as ImagePicker from 'expo-image-picker';

const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ['images'],
  quality: 0.8,
});

if (!result.canceled) {
  const blob = await uriToBlob(result.assets[0].uri);
  const uploaded = await db.storage.upload('avatars/me.jpg', blob);
  console.log('Uploaded:', uploaded.path);
}`;

const WITH_PROGRESS = `import { uriToBlob } from 'refirebase';
import { useUploadTask } from 'refirebase/react';

const { upload, progress, state } = useUploadTask();

const blob = await uriToBlob(pickerResult.uri);
await upload('uploads/video.mp4', blob, { downloadUrl: true });`;

export default async function UriToBlobPage() {
  return (
    <DocPage>
      <DocHeader
        title="uriToBlob"
        description="Convert a React Native / Expo file URI to a Blob for storage uploads."
        badge="new"
      />

      <DocSection title="Usage">
        <P>
          React Native files are represented as <Code>file://</Code> or{" "}
          <Code>content://</Code> URIs, not <Code>Blob</Code> objects.
          <Code>uriToBlob</Code> converts them using <Code>fetch</Code> so they
          can be passed to <Code>db.storage.upload</Code>.
        </P>
        <DocCode code={CODE} lang="ts" label="uriToBlob with Expo ImagePicker" />
      </DocSection>

      <DocSection title="With progress">
        <DocCode code={WITH_PROGRESS} lang="ts" label="with useUploadTask" />
      </DocSection>

      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "uri", type: "string", required: true, description: "File URI from Expo ImagePicker, DocumentPicker, CameraRoll, etc." },
        ]} />
      </DocSection>

      <DocSection title="Return value">
        <Returns type="Promise<Blob>" description="A Blob ready to be passed to db.storage.upload or db.storage.uploadWithProgress." />
      </DocSection>

      <DocPagination
        prev={{ title: "NativeFirebaseAuth", href: "/docs/react-native/native-auth" }}
        next={{ title: "React Native Hooks", href: "/docs/react-native/hooks" }}
      />
    </DocPage>
  );
}
