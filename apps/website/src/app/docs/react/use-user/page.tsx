import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { useUser } from 'refirebase/react';

export function UserProfile() {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Welcome, {user.displayName}!</div>;
}`;

export default async function UseUserPage() {
  return (
    <DocPage>
      <DocHeader title="useUser" description="Hook to access the current authenticated Firebase user." />
      <DocSection title="Usage">
        <P>Use this hook to get the currently authenticated user in real-time. It listens to state changes and avoids boilerplate <Code>onAuthStateChanged</Code> listeners.</P>
        <DocCode code={EXAMPLE_CODE} lang="tsx" label="UserProfile.tsx" />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="{ user: User | null, loading: boolean }" description="The current user object and a loading state." />
      </DocSection>
    </DocPage>
  );
}
