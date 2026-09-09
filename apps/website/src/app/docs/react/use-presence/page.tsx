import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, Callout, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const BASIC = `import { usePresence } from 'refirebase/react';

function OnlineIndicator({ userId }) {
  const { isOnline } = usePresence('presence/' + userId);

  return (
    <span
      className={isOnline ? 'text-green-500' : 'text-gray-400'}
    >
      {isOnline ? 'Online' : 'Offline'}
    </span>
  );
}`;

const CUSTOM_VALUE = `// Store a rich presence object
const { isOnline } = usePresence('rooms/abc/members/' + userId, {
  uid: userId,
  joinedAt: new Date().toISOString(),
});`;

export default async function UsePresencePage() {
  return (
    <DocPage>
      <DocHeader
        title="usePresence"
        description="Real-time online/offline presence using Realtime Database."
        badge="new"
      />

      <DocSection title="Usage">
        <P>
          <Code>usePresence</Code> writes the user's online state to a Realtime
          Database path and automatically removes it on disconnect using
          Firebase's <Code>onDisconnect</Code> mechanism.
        </P>
        <DocCode code={BASIC} lang="tsx" label="usePresence" />
      </DocSection>

      <DocSection title="Custom presence value">
        <P>Pass a second argument to store any value instead of a simple boolean.</P>
        <DocCode code={CUSTOM_VALUE} lang="tsx" label="custom value" />
      </DocSection>

      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "path", type: "string", required: true, description: "Realtime Database path to store the presence value." },
          { name: "userValue", type: "unknown", description: "Value to write when online.", default: "true" },
        ]} />
      </DocSection>

      <DocSection title="Return value">
        <PropTable rows={[
          { name: "isOnline", type: "boolean", description: "True when the presence value exists in the database." },
        ]} />
      </DocSection>

      <DocPagination
        prev={{ title: "useUploadTask", href: "/docs/react/use-upload-task" }}
        next={{ title: "React Native — Overview", href: "/docs/react-native/overview" }}
      />
    </DocPage>
  );
}
