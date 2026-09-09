import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useCollection, useAuth } from 'refirebase/react';

export function MobileList() {
  const { user } = useAuth();
  const { data } = useCollection('posts');
  
  // Renders exactly the same way on mobile!
  return <View>...</View>;
}`;

export default async function MobileHooksPage() {
  return (
    <DocPage>
      <DocHeader title="React Native Hooks" description="Using React Hooks in React Native / Expo." />
      <DocSection title="Usage">
        <P>You can use the exact same imports for hooks in React Native as you do on the web.</P>
        <Callout type="note">Import from <Code>refirebase/react</Code> just like in web projects. The bundler automatically resolves the underlying Firebase calls to the native-compatible SDK.</Callout>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="Component.tsx" />
      </DocSection>
      <DocPagination prev={{ title: "RefirebaseNative", href: "/docs/react-native/refirebase-native" }} next={{ title: "Admin Setup", href: "/docs/admin/setup" }} />
    </DocPage>
  );
}
