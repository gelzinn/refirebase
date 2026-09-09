import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const SAME_IMPORT = `// ✅ Mesmo import — funciona em web E mobile sem mudar nada
import { Refirebase } from 'refirebase';
import { RefirebaseProvider, useAuth, useCollection } from 'refirebase/react';`;

const HOW_IT_WORKS = `// Metro (React Native / Expo) lê a condição "react-native" no package.json:
// "react-native" → ./dist/native/index.js     (NativeFirebaseAuth)
// "import"       → ./dist/index.js            (FirebaseAuth com popup)

// O resultado: mesmos imports, implementação correta para cada bundler.`;

const ONLY_DIFFERENCE = `// A ÚNICA diferença é como você obtém o token do provider nativo.
// O SDK nativo (ex: @react-native-google-signin) faz o OAuth,
// você só passa o token para o Refirebase:

import { GoogleSignin } from '@react-native-google-signin/google-signin';

const { user, signInWithGoogle } = useAuth();

const handleGoogleLogin = async () => {
  const { idToken } = await GoogleSignin.signIn(); // ← SDK nativo
  await signInWithGoogle({ idToken });             // ← refirebase
};`;

const EXPO_SETUP = `// app/firebase.ts (Expo / React Native)
import { Refirebase } from 'refirebase'; // ← mesmo import do web!

export const firebase = new Refirebase({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... demais chaves
});

export const { db, auth } = firebase;`;

const PROVIDER = `// app/_layout.tsx (Expo Router)
import { RefirebaseProvider } from 'refirebase/react'; // ← mesmo import do web!
import { firebase } from './firebase';

export default function RootLayout() {
  return (
    <RefirebaseProvider instance={firebase}>
      <Stack />
    </RefirebaseProvider>
  );
}`;



export default async function ReactNativeOverviewPage() {
  return (
    <DocPage>
      <DocHeader
        title="React Native / Expo"
        description="Use refirebase em projetos mobile com os mesmos imports do web."
        badge="new"
      />

      <DocSection title="Zero fricção — mesmo import em qualquer plataforma">
        <P>
          Não existe mais alias separado. O mesmo{" "}
          <Code>import {`{ Refirebase } from 'refirebase'`}</Code> funciona em
          Next.js, Vite, Expo e React Native bare. O Metro bundler lê a
          condição <Code>react-native</Code> no <Code>package.json</Code> e
          resolve automaticamente para o bundle nativo.
        </P>
        <DocCode code={SAME_IMPORT} lang="ts" label="mesmo import" />
      </DocSection>

      <DocSection title="Como funciona internamente">
        <DocCode code={HOW_IT_WORKS} lang="ts" label="resolução automática" />
        <Callout type="note">
          O bundle nativo usa <Code>signInWithCredential</Code> ao invés de{" "}
          <Code>signInWithPopup</Code> (que não existe em React Native).
          Firestore, Realtime Database e Storage são idênticos.
        </Callout>
      </DocSection>

      <DocSection title="A única diferença: como você obtém o token">
        <P>
          A única coisa específica de mobile é o passo de autenticação com o
          SDK nativo (Google, Facebook, etc.) para obter um token. O refirebase
          recebe esse token e completa o sign-in — a API é a mesma.
        </P>
        <DocCode code={ONLY_DIFFERENCE} lang="tsx" label="diferença real" />
      </DocSection>

      <DocSection title="Setup no Expo (Expo Router)">
        <DocCode code={EXPO_SETUP} lang="ts" label="app/firebase.ts" />
        <DocCode code={PROVIDER} lang="tsx" label="app/_layout.tsx" />
      </DocSection>

      <DocSection title="O que é diferente entre web e mobile?">
        <PropTable rows={[
          { name: "Auth de provider", type: "handleGoogleSignIn({ idToken })", description: "Mobile usa signInWithCredential — você passa o token do SDK nativo." },
          { name: "Auth de email", type: "Idêntico", description: "handleEmailSignIn, handleEmailSignUp, handlePasswordReset — zero diferença." },
          { name: "Firestore", type: "Idêntico", description: "get, subscribe, add, set, update, delete — sem diferença." },
          { name: "Realtime DB", type: "Idêntico", description: "set, get, push, onValue, onChildAdded — sem diferença." },
          { name: "Storage upload", type: "uriToBlob helper", description: "Expo devolve URIs de arquivo. Use uriToBlob (de refirebase) para converter para Blob antes de upload." },
          { name: "Hooks React", type: "Idêntico", description: "useAuth, useCollection, useDocument, useValue, usePagination, useUploadTask, usePresence." },
        ]} />
      </DocSection>



      <DocPagination
        prev={{ title: "usePresence", href: "/docs/react/use-presence" }}
        next={{ title: "NativeFirebaseAuth", href: "/docs/react-native/native-auth" }}
      />
    </DocPage>
  );
}
