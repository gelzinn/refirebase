import {
  DocPage, DocHeader, DocSection, DocCode, P, Code, PropTable, Returns, DocPagination,
} from "@/components/docs/ui";

const EXAMPLE_CODE = `import { db } from 'refirebase';

try {
  await db.firestore.runTransaction(async (tx) => {
    // Read the current balance
    const userDoc = await tx.get('users', 'user123');
    if (!userDoc) throw new Error('User not found');
    
    const newBalance = (userDoc.balance || 0) + 50;

    // Update the balance
    tx.update('users', 'user123', { balance: newBalance });
    
    // Log the transaction
    tx.set('transactions', 'tx456', { amount: 50, type: 'credit' });
  });
  console.log('Transaction completed successfully!');
} catch (error) {
  console.error('Transaction failed: ', error);
}
`;

export default async function RunTransactionPage() {
  return (
    <DocPage>
      <DocHeader title="runTransaction" description="Execute a set of reads and writes atomically." />
      <DocSection title="Overview">
        <P>The <Code>runTransaction</Code> method allows you to execute operations atomically. If a document read within the transaction is modified by a concurrent operation, the transaction will automatically retry. All reads (<Code>tx.get</Code>) must occur before any writes (<Code>tx.set</Code>, <Code>tx.update</Code>, <Code>tx.delete</Code>).</P>
        <DocCode code={EXAMPLE_CODE} lang="ts" label="Running a transaction" />
      </DocSection>
      <DocSection title="Parameters">
        <PropTable rows={[
          { name: "fn", type: "(tx: FirestoreTransaction) => Promise<T>", required: true, description: "An async callback function containing the transaction operations." }
        ]} />
      </DocSection>
      <DocSection title="Return value">
        <Returns type="Promise<T>" description="Returns the result of the callback function. Throws an error if the transaction fails." />
      </DocSection>
      <DocPagination
        prev={{ title: "aggregate", href: "/docs/firestore/aggregate" }}
        next={{ title: "batch", href: "/docs/firestore/batch" }}
      />
    </DocPage>
  );
}
