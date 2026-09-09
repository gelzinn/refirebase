import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const CODE = `const { error } = await auth.updateProfile({
  displayName: 'Alice Smith',
  photoURL: 'https://cdn.example.com/new-avatar.jpg',
});

if (error) {
  console.error(error.code);
}`;

export default async function UpdateProfilePage() {
  return (
    <DocPage>
      <DocHeader
        title="updateProfile"
        description="Update the current user's display name and/or photo URL."
        badge="new"
      />
      <DocSection title="Usage">
        <DocCode code={CODE} lang="ts" label="auth.updateProfile" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "options.displayName", type: "string | null", description: "New display name. Pass null to remove." },
          { name: "options.photoURL", type: "string | null", description: "New photo URL. Pass null to remove." },
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<{ error?: RefirebaseError }>" description="Returns an empty object on success, or an error on failure. Requires a signed-in user." />
      </DocSection>
      <DocPagination
        prev={{ title: "handleEmailVerification", href: "/docs/auth/email-verification" }}
        next={{ title: "deleteAccount", href: "/docs/auth/delete-account" }}
      />
    </DocPage>
  );
}
