import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { auth } from 'refirebase';

const { data, error } = await auth.handleProviderSignIn('google', { 
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'] 
});

if (error) {
  console.error('Sign in failed:', error);
} else {
  console.log('Signed in as:', data?.user.email);
}`;

export default async function ProviderSignInPage() {
  return (
    <DocPage>
      <DocHeader title="handleProviderSignIn" description="Sign in with a third-party provider (Google, GitHub, Twitter, Facebook)." />
      <DocSection title="Usage">
        <P>Uses a popup flow. For React Native, use <Code>refirebase/native</Code>. Returns <Code>{`{ data, error }`}</Code> instead of throwing.</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Example" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "provider", type: "'google' | 'github' | 'twitter' | 'facebook'", required: true, description: "The third-party authentication provider." },
          { name: "options", type: "{ scopes?: string[] }", required: false, description: "Additional options, such as OAuth scopes." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<{ data: UserCredential | null, error?: RefirebaseError }>" description="An object containing the user credential data on success, or an error object on failure." />
      </DocSection>
    </DocPage>
  );
}
