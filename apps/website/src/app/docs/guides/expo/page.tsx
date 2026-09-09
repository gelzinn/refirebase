import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const INSTALL = `# Install refirebase
npx expo install refirebase

# Install native Google Sign-In (optional)
npx expo install @react-native-google-signin/google-signin

# Install Expo ImagePicker (for file uploads)
npx expo install expo-image-picker`;

const FIREBASE_CONFIG = `// app/firebase.ts
import { Refirebase } from 'refirebase';

export const firebase = new Refirebase({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
});`;

const ENV_CODE = `# .env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-rtdb.firebaseio.com`;

const LAYOUT_CODE = `// app/_layout.tsx (Expo Router)
import { Stack } from 'expo-router';
import { RefirebaseProvider } from 'refirebase/react';
import { firebase } from './firebase';

export default function RootLayout() {
  return (
    <RefirebaseProvider instance={firebase}>
      <Stack />
    </RefirebaseProvider>
  );
}`;

const SCREEN_CODE = `// app/(tabs)/profile.tsx
import { useAuth, useCollection } from 'refirebase/react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({ webClientId: 'YOUR_WEB_CLIENT_ID' });

export default function ProfileScreen() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { data: posts } = useCollection('posts');

  const handleGoogleSignIn = async () => {
    const { idToken } = await GoogleSignin.signIn();
    await signInWithGoogle({ idToken });
  };

  if (loading) return <ActivityIndicator />;

  if (!user) {
    return <Button title="Sign in with Google" onPress={handleGoogleSignIn} />;
  }

  return (
    <View>
      <Text>Hello, {user.displayName}</Text>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Text>{item.title}</Text>}
        keyExtractor={(item) => item.id}
      />
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}`;

const UPLOAD_CODE = `import { uriToBlob } from 'refirebase';
import { useUploadTask } from 'refirebase/react';
import * as ImagePicker from 'expo-image-picker';

export function AvatarPicker() {
  const { upload, progress, state } = useUploadTask();

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!result.canceled) {
      const blob = await uriToBlob(result.assets[0].uri);
      await upload('avatars/me.jpg', blob, { downloadUrl: true });
    }
  };

  return (
    <View>
      <Button title="Pick photo" onPress={pick} />
      {state === 'running' && <Text>Uploading {progress}%...</Text>}
    </View>
  );
}`;

export default async function ExpoGuidePage() {
  return (
    <DocPage>
      <DocHeader
        title="Expo Setup"
        description="Set up refirebase in an Expo (Expo Router) project."
        badge="new"
      />

      <DocSection title="Install">
        <DocCode code={INSTALL} lang="bash" label="terminal" />
      </DocSection>

      <DocSection title="Environment variables">
        <P>
          Expo uses the <Code>EXPO_PUBLIC_</Code> prefix for client-accessible
          variables. Pass them explicitly to the constructor since Refirebase
          does not read <Code>EXPO_PUBLIC_*</Code> automatically.
        </P>
        <DocCode code={ENV_CODE} lang="bash" label=".env" />
      </DocSection>

      <DocSection title="Initialize">
        <DocCode code={FIREBASE_CONFIG} lang="ts" label="app/firebase.ts" />
      </DocSection>

      <DocSection title="Provider">
        <DocCode code={LAYOUT_CODE} lang="tsx" label="app/_layout.tsx" />
      </DocSection>

      <DocSection title="Screen example">
        <DocCode code={SCREEN_CODE} lang="tsx" label="app/(tabs)/profile.tsx" />
      </DocSection>

      <DocSection title="File upload">
        <P>
          Use <Code>uriToBlob</Code> to convert Expo ImagePicker URIs to Blobs,
          then upload with progress using <Code>useUploadTask</Code>.
        </P>
        <DocCode code={UPLOAD_CODE} lang="tsx" label="AvatarPicker.tsx" />
      </DocSection>

      <DocPagination
        prev={{ title: "Next.js Setup", href: "/docs/guides/nextjs" }}
      />
    </DocPage>
  );
}
