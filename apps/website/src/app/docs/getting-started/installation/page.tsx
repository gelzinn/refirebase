import {
  DocPage,
  DocHeader,
  DocSection,
  DocCode,
  P,
  Code,
  Callout,
  DocPagination,
} from "@/components/docs/ui";

const INSTALL_CODE = `# npm
npm install refirebase

# yarn
yarn add refirebase

# pnpm
pnpm add refirebase

# bun
bun add refirebase`;

const OPTIONAL_DEPS = `# For refirebase/react (optional — already included if you have react)
# react >= 18 is a peer dep

# For refirebase/admin (server only)
npm install firebase-admin`;

export default async function InstallationPage() {
  return (
    <DocPage>
      <DocHeader
        title="Installation"
        description="Add refirebase to your project in one command."
      />

      <DocSection title="Install the package">
        <P>
          Install <Code>refirebase</Code> using your preferred package manager.
          It ships with the Firebase JS SDK as a direct dependency, so you{" "}
          <strong>do not</strong> need to install <Code>firebase</Code>{" "}
          separately.
        </P>
        <DocCode code={INSTALL_CODE} lang="bash" label="terminal" />
      </DocSection>

      <DocSection title="Optional dependencies">
        <P>
          The <Code>refirebase/react</Code> hooks require React 18+, and{" "}
          <Code>refirebase/admin</Code> requires{" "}
          <Code>firebase-admin</Code> which is a server-only optional peer
          dependency.
        </P>
        <DocCode code={OPTIONAL_DEPS} lang="bash" label="terminal" />
        <Callout type="tip">
          For React Native / Expo projects the same imports work out of the box
          — no separate alias needed. Metro automatically resolves{" "}
          <Code>refirebase</Code> and <Code>refirebase/react</Code> to the
          native bundle via the <Code>react-native</Code> export condition.
        </Callout>
      </DocSection>

      <DocSection title="TypeScript">
        <P>
          Refirebase is written in TypeScript and ships type declarations. No{" "}
          <Code>@types/refirebase</Code> package is needed.
        </P>
        <Callout type="note">
          Minimum supported TypeScript version is <Code>5.0</Code>. Node.js{" "}
          <Code>{">=18"}</Code> is required.
        </Callout>
      </DocSection>

      <DocPagination
        next={{ title: "Configuration", href: "/docs/getting-started/configuration" }}
      />
    </DocPage>
  );
}
