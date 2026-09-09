import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const BASIC = `const { data, error } = await auth.handleEmailSignUp(
  'alice@example.com',
  'password123',
);

if (error) {
  console.error(error.code, error.message);
} else {
  console.log('Signed up:', data.user.uid);
}`;

const WITH_PROFILE = `// Set display name and photo right after account creation
const { data, error } = await auth.handleEmailSignUp(
  'alice@example.com',
  'password123',
  {
    displayName: 'Alice',
    photoURL: 'https://cdn.example.com/avatar.jpg',
  },
);`;

export default async function EmailSignUpPage() {
  return (
    <DocPage>
      <DocHeader
        title="handleEmailSignUp"
        description="Create a new user account with email and password."
        badge="new"
      />

      <DocSection title="Basic usage">
        <DocCode code={BASIC} lang="ts" label="auth.handleEmailSignUp" />
      </DocSection>

      <DocSection title="With profile options">
        <P>Optionally set the display name and photo URL immediately after account creation.</P>
        <DocCode code={WITH_PROFILE} lang="ts" label="with profile" />
      </DocSection>

      <DocSection title="Parameters">
        <PropTable
          rows={[
            { name: "email", type: "string", required: true, description: "The user's email address." },
            { name: "password", type: "string", required: true, description: "The user's password. Must be at least 6 characters." },
            { name: "options.displayName", type: "string", description: "Display name to set on the new user profile." },
            { name: "options.photoURL", type: "string", description: "Photo URL to set on the new user profile." },
          ]}
        />
      </DocSection>

      <DocSection title="Return value">
        <Returns
          type="Promise<{ data: UserCredential | null; error?: RefirebaseError }>"
          description="data contains the Firebase UserCredential on success. error is a typed RefirebaseError on failure."
        />
      </DocSection>

      <DocPagination
        prev={{ title: "handleEmailSignIn", href: "/docs/auth/email-sign-in" }}
        next={{ title: "handlePasswordReset", href: "/docs/auth/password-reset" }}
      />
    </DocPage>
  );
}
