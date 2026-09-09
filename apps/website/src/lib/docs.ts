// Navigation structure for the docs
export type DocSection = {
  title: string;
  slug: string;
  items: DocItem[];
};

export type DocItem = {
  title: string;
  slug: string;
  badge?: "new" | "beta";
};

export const DOC_SECTIONS: DocSection[] = [
  {
    title: "Getting Started",
    slug: "getting-started",
    items: [
      { title: "Installation", slug: "installation" },
      { title: "Configuration", slug: "configuration" },
      { title: "Quick Start", slug: "quick-start" },
    ],
  },
  {
    title: "Firestore",
    slug: "firestore",
    items: [
      { title: "get", slug: "get" },
      { title: "add", slug: "add" },
      { title: "set", slug: "set" },
      { title: "update", slug: "update" },
      { title: "delete", slug: "delete" },
      { title: "subscribe", slug: "subscribe" },
      { title: "getGroup", slug: "get-group", badge: "new" },
      { title: "count", slug: "count", badge: "new" },
      { title: "aggregate", slug: "aggregate", badge: "new" },
      { title: "runTransaction", slug: "run-transaction" },
      { title: "batch", slug: "batch" },
    ],
  },
  {
    title: "Realtime Database",
    slug: "realtime",
    items: [
      { title: "get", slug: "get" },
      { title: "set", slug: "set" },
      { title: "update", slug: "update" },
      { title: "delete", slug: "delete" },
      { title: "onValue", slug: "on-value" },
      { title: "push", slug: "push", badge: "new" },
      { title: "onChildAdded", slug: "on-child-added", badge: "new" },
      { title: "onDisconnect", slug: "on-disconnect" },
    ],
  },
  {
    title: "Storage",
    slug: "storage",
    items: [
      { title: "upload", slug: "upload" },
      { title: "uploadWithProgress", slug: "upload-with-progress", badge: "new" },
      { title: "getUrl", slug: "get-url" },
      { title: "getBytes", slug: "get-bytes" },
      { title: "getBlob", slug: "get-blob" },
      { title: "delete", slug: "delete" },
    ],
  },
  {
    title: "Authentication",
    slug: "auth",
    items: [
      { title: "handleProviderSignIn", slug: "provider-sign-in" },
      { title: "handleEmailSignIn", slug: "email-sign-in" },
      { title: "handleEmailSignUp", slug: "email-sign-up", badge: "new" },
      { title: "handlePasswordReset", slug: "password-reset", badge: "new" },
      { title: "handleEmailVerification", slug: "email-verification", badge: "new" },
      { title: "updateProfile", slug: "update-profile", badge: "new" },
      { title: "deleteAccount", slug: "delete-account", badge: "new" },
      { title: "linkProvider", slug: "link-provider", badge: "new" },
      { title: "handleSignOut", slug: "sign-out" },
      { title: "getAccessToken", slug: "get-access-token" },
    ],
  },
  {
    title: "React Hooks",
    slug: "react",
    items: [
      { title: "RefirebaseProvider", slug: "provider" },
      { title: "useRefirebase", slug: "use-refirebase" },
      { title: "useAuth", slug: "use-auth", badge: "new" },
      { title: "useUser", slug: "use-user" },
      { title: "useCollection", slug: "use-collection" },
      { title: "useDocument", slug: "use-document" },
      { title: "useValue", slug: "use-value" },
      { title: "usePagination", slug: "use-pagination", badge: "new" },
      { title: "useUploadTask", slug: "use-upload-task", badge: "new" },
      { title: "usePresence", slug: "use-presence", badge: "new" },
    ],
  },
  {
    title: "React Native / Expo",
    slug: "react-native",
    items: [
      { title: "Overview", slug: "overview", badge: "new" },
      { title: "RefirebaseNative", slug: "refirebase-native", badge: "new" },
      { title: "NativeFirebaseAuth", slug: "native-auth", badge: "new" },
      { title: "uriToBlob", slug: "uri-to-blob", badge: "new" },
      { title: "React Native Hooks", slug: "hooks", badge: "new" },
    ],
  },
  {
    title: "Admin SDK",
    slug: "admin",
    items: [
      { title: "Setup", slug: "setup" },
      { title: "Firestore", slug: "firestore" },
      { title: "Realtime Database", slug: "realtime" },
      { title: "Storage", slug: "storage" },
      { title: "Auth", slug: "auth" },
    ],
  },
  {
    title: "Error Handling",
    slug: "errors",
    items: [
      { title: "RefirebaseError", slug: "refirebase-error", badge: "new" },
      { title: "isRefirebaseError", slug: "is-refirebase-error", badge: "new" },
      { title: "Error Codes", slug: "error-codes", badge: "new" },
    ],
  },
  {
    title: "Guides",
    slug: "guides",
    items: [
      { title: "TypeScript Schema", slug: "typescript-schema" },
      { title: "Firebase Emulators", slug: "emulators" },
      { title: "Next.js Setup", slug: "nextjs" },
      { title: "Expo Setup", slug: "expo", badge: "new" },
    ],
  },
];

export function findDocItem(section: string, item: string) {
  const sec = DOC_SECTIONS.find((s) => s.slug === section);
  if (!sec) return null;
  return sec.items.find((i) => i.slug === item) ?? null;
}
