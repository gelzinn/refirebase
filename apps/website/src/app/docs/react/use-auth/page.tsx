import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const BASIC = `import { useAuth } from 'refirebase/react';

function AuthButton() {
  const {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signOut,
  } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return (
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    );
  }

  return (
    <div>
      <p>Hello, {user.displayName}!</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}`;

const EMAIL_SIGNUP = `const { signUpWithEmail, error } = useAuth();

await signUpWithEmail('alice@example.com', 'password', {
  displayName: 'Alice',
});

if (error) {
  setFieldError(error.message); // user-friendly message
}`;

export default async function UseAuthPage() {
  return (
    <DocPage>
      <DocHeader
        title="useAuth"
        description="All-in-one auth hook with ready-to-use sign-in and sign-out actions."
        badge="new"
      />

      <DocSection title="Usage">
        <P>
          <Code>useAuth</Code> combines user state with auth actions in one hook.
          It eliminates the boilerplate of managing auth state and calling individual auth methods.
        </P>
        <DocCode code={BASIC} lang="tsx" label="useAuth" />
      </DocSection>

      <DocSection title="Email sign up">
        <DocCode code={EMAIL_SIGNUP} lang="tsx" label="signUpWithEmail" />
      </DocSection>

      <DocSection title="Return value">
        <PropTable rows={[
          { name: "user", type: "User | null", description: "Current Firebase user, or null if not signed in." },
          { name: "loading", type: "boolean", description: "True while auth state is being resolved on first render." },
          { name: "error", type: "RefirebaseError | null", description: "Last auth error, if any." },
          { name: "isAuthenticated", type: "boolean", description: "Shorthand for !!user." },
          { name: "signInWithGoogle", type: "(options?) => Promise", description: "Sign in with Google popup." },
          { name: "signInWithGithub", type: "(options?) => Promise", description: "Sign in with GitHub popup." },
          { name: "signInWithFacebook", type: "(options?) => Promise", description: "Sign in with Facebook popup." },
          { name: "signInWithEmail", type: "(email, password) => Promise", description: "Sign in with email and password." },
          { name: "signUpWithEmail", type: "(email, password, options?) => Promise", description: "Create a new account." },
          { name: "resetPassword", type: "(email) => Promise", description: "Send a password reset email." },
          { name: "signOut", type: "() => Promise", description: "Sign out the current user." },
        ]} />
      </DocSection>

      <DocPagination
        prev={{ title: "useRefirebase", href: "/docs/react/use-refirebase" }}
        next={{ title: "useUser", href: "/docs/react/use-user" }}
      />
    </DocPage>
  );
}
