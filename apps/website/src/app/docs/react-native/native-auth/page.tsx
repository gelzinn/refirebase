import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const GOOGLE = `// 1. Configure Google Sign-In (once, e.g. in app init)
import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure({ webClientId: 'YOUR_WEB_CLIENT_ID' });

// 2. Sign in
const { idToken } = await GoogleSignin.signIn();
const { data, error } = await auth.handleGoogleSignIn({ idToken });

if (error) {
  console.error(error.code, error.message);
}`;

const FACEBOOK = `import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

await LoginManager.logInWithPermissions(['public_profile', 'email']);
const token = await AccessToken.getCurrentAccessToken();

const { data, error } = await auth.handleFacebookSignIn({
  accessToken: token.accessToken,
});`;

export default async function NativeAuthPage() {
  return (
    <DocPage>
      <DocHeader
        title="NativeFirebaseAuth"
        description="Auth class for React Native/Expo using credential-based sign-in flows."
        badge="new"
      />

      <DocSection title="Google Sign-In">
        <P>
          Requires <Code>@react-native-google-signin/google-signin</Code>.
          You obtain an <Code>idToken</Code> from the native SDK and pass it
          to Refirebase.
        </P>
        <DocCode code={GOOGLE} lang="ts" label="Google Sign-In" />
      </DocSection>

      <DocSection title="Facebook Login">
        <P>
          Requires <Code>react-native-fbsdk-next</Code> or similar.
          Pass the <Code>accessToken</Code> from Facebook's Login SDK.
        </P>
        <DocCode code={FACEBOOK} lang="ts" label="Facebook Login" />
      </DocSection>

      <Callout type="note">
        All methods return <Code>{`{ data, error }`}</Code>. The <Code>error</Code>
        includes a user-friendly <Code>message</Code> and Firebase <Code>code</Code>.
      </Callout>

      <DocSection title="Methods">
        <PropTable rows={[
          { name: "handleGoogleSignIn", type: "({ idToken, accessToken? }) => Promise", description: "Sign in with a Google ID token from the native SDK." },
          { name: "handleFacebookSignIn", type: "({ accessToken }) => Promise", description: "Sign in with a Facebook access token from the native SDK." },
          { name: "handleCredentialSignIn", type: "(credential) => Promise", description: "Sign in with any Firebase AuthCredential (escape hatch)." },
          { name: "handleSignOut", type: "() => Promise", description: "Sign out the current user." },
          { name: "onAuthStateChanged", type: "(callback) => unsubscribe", description: "Listen for auth state changes." },
          { name: "native", type: "Auth", description: "Underlying Firebase Auth instance (escape hatch)." },
        ]} />
      </DocSection>

      <DocPagination
        prev={{ title: "RefirebaseNative", href: "/docs/react-native/refirebase-native" }}
        next={{ title: "uriToBlob", href: "/docs/react-native/uri-to-blob" }}
      />
    </DocPage>
  );
}
