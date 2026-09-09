import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Returns, PropTable, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { RefirebaseProvider } from 'refirebase/react';
import { refirebase } from './firebase'; // Your Refirebase instance

export default function App({ children }) {
  return (
    <RefirebaseProvider instance={refirebase}>
      {children}
    </RefirebaseProvider>
  );
}`;

export default async function ProviderPage() {
  return (
    <DocPage>
      <DocHeader title="RefirebaseProvider" description="Provides the Refirebase instance to the entire application." />
      <DocSection title="Usage">
        <P>Wrap your React application with <Code>RefirebaseProvider</Code> so that hooks like <Code>useRefirebase</Code> or <Code>useCollection</Code> have access to your database and authentication instances.</P>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="App.tsx" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "instance", type: "Refirebase<T>", required: true, description: "Your initialized Refirebase instance." },
          { name: "children", type: "React.ReactNode", required: true, description: "Your application components." }
        ]} />
      </DocSection>
    </DocPage>
  );
}
