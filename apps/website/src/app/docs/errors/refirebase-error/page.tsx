import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const TYPE = `import type { RefirebaseError } from 'refirebase';

interface RefirebaseError {
  code: string;       // e.g. 'permission-denied'
  message: string;   // user-friendly message
  originalError?: unknown; // raw Firebase error
}`;

const USAGE = `import { isRefirebaseError } from 'refirebase';

const result = await db.firestore.get('users');

if (isRefirebaseError(result)) {
  // result.error is RefirebaseError
  console.error(result.error.code);     // 'permission-denied'
  console.error(result.error.message);  // 'You do not have permission...'
  showToast(result.error.message);
} else {
  // result is User[]
  renderUsers(result);
}`;

const AUTH_ERROR = `const { data, error } = await auth.handleEmailSignIn(email, password);

if (error) {
  if (error.code === 'auth/wrong-password') {
    setFieldError('password', 'Incorrect password');
  } else {
    showToast(error.message);
  }
}`;

export default async function RefirebaseErrorPage() {
  return (
    <DocPage>
      <DocHeader
        title="RefirebaseError"
        description="Typed, user-friendly error type returned by all Refirebase operations."
        badge="new"
      />

      <DocSection title="Type definition">
        <P>
          Instead of catching raw Firebase errors with <Code>unknown</Code> type,
          Refirebase wraps every error into a <Code>RefirebaseError</Code> with a
          readable <Code>code</Code> and a pre-translated <Code>message</Code>.
        </P>
        <DocCode code={TYPE} lang="ts" label="RefirebaseError" />
      </DocSection>

      <DocSection title="Usage with isRefirebaseError">
        <DocCode code={USAGE} lang="ts" label="isRefirebaseError" />
      </DocSection>

      <DocSection title="Usage with auth errors">
        <P>
          Auth methods return <Code>{`{ data, error }`}</Code> directly.
          The <Code>error</Code> field is typed as <Code>RefirebaseError</Code>.
        </P>
        <DocCode code={AUTH_ERROR} lang="ts" label="auth error" />
      </DocSection>

      <DocSection title="Properties">
        <PropTable rows={[
          { name: "code", type: "string", description: "Firebase error code, e.g. permission-denied, auth/wrong-password." },
          { name: "message", type: "string", description: "User-friendly message pre-translated from the error code." },
          { name: "originalError", type: "unknown", description: "The original FirebaseError or Error for advanced use." },
        ]} />
      </DocSection>

      <DocPagination
        next={{ title: "isRefirebaseError", href: "/docs/errors/is-refirebase-error" }}
      />
    </DocPage>
  );
}
