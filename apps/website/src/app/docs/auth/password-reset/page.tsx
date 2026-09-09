import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const CODE = `const { error } = await auth.handlePasswordReset('user@example.com');

if (error) {
  console.error(error.code, error.message);
} else {
  alert('Password reset email sent!');
}`;

export default async function PasswordResetPage() {
  return (
    <DocPage>
      <DocHeader
        title="handlePasswordReset"
        description="Send a password reset email to a user's address."
        badge="new"
      />
      <DocSection title="Usage">
        <DocCode code={CODE} lang="ts" label="auth.handlePasswordReset" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "email", type: "string", required: true, description: "Email address of the account to reset." },
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<{ error?: RefirebaseError }>" description="Returns an empty object on success, or an error object on failure." />
      </DocSection>
      <DocPagination
        prev={{ title: "handleEmailSignUp", href: "/docs/auth/email-sign-up" }}
        next={{ title: "handleEmailVerification", href: "/docs/auth/email-verification" }}
      />
    </DocPage>
  );
}
