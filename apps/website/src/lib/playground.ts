import type { RefirebaseConfig } from "refirebase";

export const PLAYGROUND_STORAGE_KEY = "refirebase.playground.config";

export const CONFIG_FIELDS = [
  { key: "apiKey", label: "apiKey", required: true },
  { key: "authDomain", label: "authDomain", required: true },
  { key: "projectId", label: "projectId", required: true },
  { key: "storageBucket", label: "storageBucket", required: true },
  { key: "messagingSenderId", label: "messagingSenderId", required: true },
  { key: "appId", label: "appId", required: true },
  { key: "databaseURL", label: "databaseURL", required: false },
  { key: "measurementId", label: "measurementId", required: false },
] as const;

export type PlaygroundConfig = Pick<
  RefirebaseConfig,
  | "apiKey"
  | "authDomain"
  | "projectId"
  | "storageBucket"
  | "messagingSenderId"
  | "appId"
  | "databaseURL"
  | "measurementId"
>;

export const EMPTY_CONFIG: PlaygroundConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  databaseURL: "",
  measurementId: "",
};

export function isConfigReady(config: PlaygroundConfig | null): boolean {
  if (!config) return false;
  return CONFIG_FIELDS.filter((field) => field.required).every(
    (field) => Boolean(config[field.key]?.trim()),
  );
}

export function parseFirebaseSnippet(input: string): Partial<PlaygroundConfig> {
  const trimmed = input.trim();
  if (!trimmed) return {};

  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    return pickConfig(parsed);
  } catch {
    const result: Partial<PlaygroundConfig> = {};
    for (const field of CONFIG_FIELDS) {
      const match = trimmed.match(
        new RegExp(`${field.key}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`),
      );
      if (match?.[1]) {
        result[field.key] = match[1];
      }
    }
    return result;
  }
}

function pickConfig(source: Record<string, unknown>): Partial<PlaygroundConfig> {
  const result: Partial<PlaygroundConfig> = {};
  for (const field of CONFIG_FIELDS) {
    const value = source[field.key];
    if (typeof value === "string" && value.trim()) {
      result[field.key] = value.trim();
    }
  }
  return result;
}

export const PLAYGROUND_NAV = [
  {
    title: "Playground",
    url: "/playground",
    items: [
      { title: "Credentials", url: "/playground", hash: "credentials" },
      { title: "Privacy", url: "/playground", hash: "privacy" },
    ],
  },
  {
    title: "Auth",
    url: "/playground/auth",
    items: [
      { title: "Google", url: "/playground/auth", hash: "google" },
      { title: "Email", url: "/playground/auth", hash: "email" },
      { title: "Sign out", url: "/playground/auth", hash: "sign-out" },
    ],
  },
  {
    title: "Firestore",
    url: "/playground/firestore",
    items: [
      { title: "Query", url: "/playground/firestore", hash: "query" },
      { title: "Subscribe", url: "/playground/firestore", hash: "subscribe" },
      { title: "Add", url: "/playground/firestore", hash: "add" },
    ],
  },
  {
    title: "Realtime",
    url: "/playground/realtime",
    items: [
      { title: "Get", url: "/playground/realtime", hash: "get" },
      { title: "onValue", url: "/playground/realtime", hash: "on-value" },
    ],
  },
  {
    title: "Storage",
    url: "/playground/storage",
    items: [
      { title: "Upload", url: "/playground/storage", hash: "upload" },
      { title: "Bytes", url: "/playground/storage", hash: "bytes" },
    ],
  },
  {
    title: "React",
    url: "/playground/react",
    items: [
      { title: "useUser", url: "/playground/react", hash: "use-user" },
      { title: "useCollection", url: "/playground/react", hash: "use-collection" },
    ],
  },
] as const;

function quote(value: string) {
  return `'${value.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

export function initSnippetFromConfig(config: PlaygroundConfig): string {
  const lines = CONFIG_FIELDS.filter(
    (field) => field.required || Boolean(config[field.key]?.trim()),
  ).map((field) => {
    const value = config[field.key]?.trim();
    return `  ${field.key}: ${value ? quote(value) : "'...'"},`;
  });

  return `import { Refirebase } from 'refirebase';

const { db, auth } = new Refirebase({
${lines.join("\n")}
});`;
}

export const PLAYGROUND_SNIPPETS = {
  init: `import { Refirebase } from 'refirebase';

const { db, auth } = new Refirebase({
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
});`,
  auth: `await auth.handleProviderSignIn('google');
await auth.handleEmailSignIn(email, password);
await auth.handleSignOut();`,
  firestore: `const users = await db.firestore.get('users', {
  orderBy: [{ field: 'created_at', direction: 'desc' }],
  limit: 10,
});

const stop = db.firestore.subscribe('users', (docs) => {
  console.log(docs);
});`,
  realtime: `const status = await db.realtime.get('app_status');

const stop = await db.realtime.onValue('app_status', (value) => {
  console.log(value);
});`,
  storage: `const uploaded = await db.storage.upload(
  \`playground/\${file.name}\`,
  file,
);

const bytes = await db.storage.getBytes(uploaded.path);`,
  react: `import {
  RefirebaseProvider,
  useCollection,
  useUser,
} from 'refirebase/react';

function Inbox() {
  const { user } = useUser();
  const { data } = useCollection('messages');
  
  return <pre>{JSON.stringify({ user, data }, null, 2)}</pre>;
}`,
} as const;
