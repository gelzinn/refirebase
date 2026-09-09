import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `// config/firebase.ts
import { RefirebaseNative } from 'refirebase/native';

export const { db, auth } = new RefirebaseNative({
  apiKey: "...",
  // ...
});`;

export default async function RefirebaseNativePage() {
  return (
    <DocPage>
      <DocHeader title="RefirebaseNative" description="The React Native / Expo variant of Refirebase." />
      <DocSection title="Usage">
        <P><Code>RefirebaseNative</Code> is a drop-in replacement for mobile projects. Under the hood, Metro resolves standard <Code>refirebase</Code> imports to use this bundle, making it virtually transparent.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="firebase.ts" />
      </DocSection>
      <DocSection title="Key Differences">
        <P>The main differences compared to the web SDK are:</P>
        <ul>
          <li><P><Code>auth</Code> uses <Code>signInWithCredential</Code> rather than popup methods (which don't work in React Native).</P></li>
          <li><P><Code>db.storage.upload</Code> accepts a <Code>Blob</Code>. Use the <Code>uriToBlob</Code> helper exported from <Code>refirebase/native</Code> to convert Expo/RN file URIs to Blobs before uploading.</P></li>
        </ul>
      </DocSection>
      <DocPagination prev={{ title: "useValue", href: "/docs/react/use-value" }} next={{ title: "React Native Hooks", href: "/docs/react-native/hooks" }} />
    </DocPage>
  );
}
