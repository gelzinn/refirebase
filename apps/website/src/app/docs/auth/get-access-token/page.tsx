import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Returns, PropTable, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useRefirebase } from 'refirebase/react';

export function TokenDisplay() {
  const { auth } = useRefirebase();

  const handleGetToken = async () => {
    const token = await auth.getAccessToken(true);
    console.log('Access token:', token);
  };

  return <button onClick={handleGetToken}>Log Token</button>;
}`;

export default async function GetAccessTokenPage() {
  return (
    <DocPage>
      <DocHeader title="getAccessToken" description="Get the current user's Firebase ID token." />
      <DocSection title="Usage">
        <P>Use <Code>getAccessToken</Code> to retrieve the JWT ID token. Useful for authenticating API requests to your backend.</P>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="TokenDisplay.tsx" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "forceRefresh", type: "boolean", required: false, description: "Whether to force a token refresh. Defaults to false." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<string | null>" description="The ID token string, or null if no user is signed in." />
      </DocSection>
    </DocPage>
  );
}
