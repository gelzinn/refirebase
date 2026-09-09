import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Returns, DocPagination, Callout
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useRefirebase } from 'refirebase/react';

export function DeleteAccount() {
  const { auth } = useRefirebase();

  const handleDelete = async () => {
    const { error } = await auth.deleteAccount();
    if (error) console.error(error);
  };

  return <button onClick={handleDelete}>Delete My Account</button>;
}`;

export default async function DeleteAccountPage() {
  return (
    <DocPage>
      <DocHeader title="deleteAccount" description="Permanently delete the current user's account." />
      <DocSection title="Usage">
        <P>Use the <Code>deleteAccount</Code> method to delete the authenticated user. Note that a recent sign-in might be required by Firebase.</P>
        <Callout type="warning">Re-authenticate the user if you encounter a credential error during deletion.</Callout>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="DeleteAccount.tsx" />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<{ error?: ReturnType<typeof toRefirebaseError> }>" description="An object containing an error if the deletion fails." />
      </DocSection>
    </DocPage>
  );
}
