import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useAuth } from 'refirebase/react';

export function SignOutButton() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) console.error(error);
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}`;

export default async function SignOutPage() {
  return (
    <DocPage>
      <DocHeader title="handleSignOut" description="Sign out the current user." />
      <DocSection title="Usage">
        <P>You can use the <Code>signOut</Code> function from <Code>useAuth</Code> or <Code>auth.handleSignOut()</Code> from <Code>useRefirebase</Code> to sign the user out.</P>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="SignOutButton.tsx" />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<{ error?: ReturnType<typeof toRefirebaseError> }>" description="An object containing an error if the sign-out fails." />
      </DocSection>
    </DocPage>
  );
}
