import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Returns, PropTable, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useRefirebase } from 'refirebase/react';

export function LinkGithub() {
  const { auth } = useRefirebase();

  const handleLink = async () => {
    const { data, error } = await auth.linkProvider('github');
    if (error) console.error(error);
    else console.log('Linked credentials:', data);
  };

  return <button onClick={handleLink}>Link GitHub Account</button>;
}`;

export default async function LinkProviderPage() {
  return (
    <DocPage>
      <DocHeader title="linkProvider" description="Link the current account with an additional third-party provider." />
      <DocSection title="Usage">
        <P>The <Code>linkProvider</Code> method allows a user to sign in with multiple providers by linking them to their current account.</P>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="LinkGithub.tsx" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "provider", type: "'google' | 'github' | 'twitter' | 'facebook'", required: true, description: "The third-party provider to link." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<{ data: UserCredential | null, error?: ReturnType<typeof toRefirebaseError> }>" description="Returns the linked user credentials on success, or an error if linking fails." />
      </DocSection>
    </DocPage>
  );
}
