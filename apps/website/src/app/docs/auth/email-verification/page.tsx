import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useRefirebase } from 'refirebase/react';

export function VerifyEmail() {
  const { auth } = useRefirebase();

  const handleVerify = async () => {
    const { error } = await auth.handleEmailVerification();
    if (error) console.error(error);
  };

  return <button onClick={handleVerify}>Verify Email</button>;
}`;

export default async function EmailVerificationPage() {
  return (
    <DocPage>
      <DocHeader title="handleEmailVerification" description="Send an email verification to the currently signed-in user." />
      <DocSection title="Usage">
        <P>Use the <Code>handleEmailVerification</Code> method to send a verification email. Returns an error if no user is signed in.</P>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="VerifyEmail.tsx" />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<{ error?: ReturnType<typeof toRefirebaseError> }>" description="An object containing an error if the operation fails." />
      </DocSection>
    </DocPage>
  );
}
