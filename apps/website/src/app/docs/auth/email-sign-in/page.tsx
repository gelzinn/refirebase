import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { auth } from 'refirebase';

const { data, error } = await auth.handleEmailSignIn('user@example.com', 'supersecret');

if (error) {
  console.error('Sign in failed:', error.message);
} else {
  console.log('Signed in as:', data?.user.email);
}`;

export default async function EmailSignInPage() {
  return (
    <DocPage>
      <DocHeader title="handleEmailSignIn" description="Sign in with an email and password." />
      <DocSection title="Usage">
        <P>Authenticates a user via email and password. Returns <Code>{`{ data, error }`}</Code> instead of throwing.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Example" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "email", type: "string", required: true, description: "The user's email address." },
          { name: "password", type: "string", required: true, description: "The user's password." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<{ data: UserCredential | null, error?: RefirebaseError }>" description="An object containing the user credential data on success, or an error object on failure." />
      </DocSection>
    </DocPage>
  );
}
