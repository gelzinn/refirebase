import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const PUSH_CODE = `import { db } from '@/lib/firebase';

// Push a new child with an auto-generated key
const result = await db.realtime.push('messages', {
  text: 'Hello!',
  uid: 'user-123',
  sentAt: Date.now(),
});

console.log(result.key); // '-NxYZ123abc...' (auto key)`;

const CHILD_ADDED = `// Listen for new children as they arrive
const stop = db.realtime.onChildAdded('messages', (snapshot) => {
  const key = snapshot.key;      // auto-generated key
  const value = snapshot.val();  // message data
  addMessageToUI(key, value);
});

// Clean up
stop();`;

const CHILD_CHANGED = `const stop = db.realtime.onChildChanged('messages', (snapshot) => {
  updateMessageInUI(snapshot.key, snapshot.val());
});`;

const ON_VALUE = `// One-shot + subscription combined
// Fires immediately with current data, then on every change
const stop = await db.realtime.onValue('inbox/user-123', (value) => {
  renderInbox(value);
});

// Unsubscribe
stop();`;

const PRESENCE = `// Mark user as online
await db.realtime.set('presence/user-123', true);

// Auto-remove on disconnect
db.realtime.onDisconnect('presence/user-123').remove();`;

export default async function RealtimePushPage() {
  return (
    <DocPage>
      <DocHeader
        title="push"
        description="push, onChildAdded, onChildChanged — list and chat patterns."
        badge="new"
      />

      <DocSection title="push — new list item">
        <P>
          <Code>push</Code> adds a child with a unique, server-generated key
          that sorts chronologically. Ideal for chat messages, activity feeds,
          and any list where order matters.
        </P>
        <DocCode code={PUSH_CODE} lang="ts" label="db.realtime.push" />
      </DocSection>

      <DocSection title="onChildAdded">
        <P>
          Listen for new items added to a list in real time. Fires once for
          each existing child, then again for each new one.
        </P>
        <DocCode code={CHILD_ADDED} lang="ts" label="onChildAdded" />
      </DocSection>

      <DocSection title="onChildChanged">
        <DocCode code={CHILD_CHANGED} lang="ts" label="onChildChanged" />
      </DocSection>

      <DocSection title="onValue (full path)">
        <DocCode code={ON_VALUE} lang="ts" label="onValue" />
      </DocSection>

      <DocSection title="Presence pattern">
        <DocCode code={PRESENCE} lang="ts" label="presence" />
        <Callout type="tip">
          For React, use the{" "}
          <a href="/docs/react/use-presence" className="underline">usePresence</a>{" "}
          hook which handles cleanup automatically.
        </Callout>
      </DocSection>

      <DocSection title="push parameters">
        <PropTable rows={[
          { name: "path", type: "string", required: true, description: "Path to the list, e.g. 'messages' or 'rooms/abc/messages'." },
          { name: "data", type: "T", required: true, description: "Data to write to the new child node." },
        ]} />
      </DocSection>

      <DocSection title="push return value">
        <Returns type="Promise<{ key: string | null } | { error }>" description="key is the auto-generated Firebase push key, e.g. -NxYZ123abc." />
      </DocSection>

      <DocPagination
        prev={{ title: "onValue", href: "/docs/realtime/on-value" }}
        next={{ title: "onDisconnect", href: "/docs/realtime/on-disconnect" }}
      />
    </DocPage>
  );
}
