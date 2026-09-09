"use client";

import { type ReactNode, useEffect, useState } from "react";
import { highlightToReact } from "@/lib/highlight";
import { CodeBlock } from "./code-block";

export function ClientHighlightedCodeBlock({
  code,
  lang,
  label,
  className,
}: {
  code: string;
  lang: string;
  label?: ReactNode;
  className?: string;
}) {
  const [highlighted, setHighlighted] = useState<ReactNode>(
    <pre>{code}</pre>,
  );

  useEffect(() => {
    let cancelled = false;

    highlightToReact(code, lang).then((node) => {
      if (!cancelled) setHighlighted(node);
    });

    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return (
    <CodeBlock code={code} label={label} className={className}>
      {highlighted}
    </CodeBlock>
  );
}
