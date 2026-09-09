"use client";

import { Check, Copy } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconFade } from "./icon-fade";

export function CopyButton({
  copied,
  onCopy,
  subject,
  className,
}: {
  copied: boolean;
  onCopy: () => void;
  subject: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? `Copied ${subject}` : `Copy ${subject}`}
      className={cn(
        "flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground outline-none transition-[background-color,color,transform] duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.96]",
        className,
      )}
    >
      <span className="relative flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ opacity: 0, y: -8, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 8, filter: "blur(2px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.25 }}
          >
            {copied ? "Copied" : "Copy"}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="relative size-3.5 shrink-0">
        <IconFade show={copied}>
          <Check className="size-full" />
        </IconFade>
        <IconFade show={!copied}>
          <Copy className="size-full" />
        </IconFade>
      </span>
    </button>
  );
}

export function CodeBlock({
  label,
  actions,
  code,
  children,
  className,
}: {
  label?: ReactNode;
  actions?: ReactNode;
  code: string;
  children?: ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<
    "none" | "start" | "middle" | "end"
  >("none");

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const checkScroll = () => {
      if (el.scrollWidth - el.clientWidth <= 2) {
        setScrollState("none");
      } else if (el.scrollLeft <= 2) {
        setScrollState("start");
      } else if (
        Math.ceil(el.scrollLeft + el.clientWidth) >=
        el.scrollWidth - 2
      ) {
        setScrollState("end");
      } else {
        setScrollState("middle");
      }
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });

    const observer = new ResizeObserver(() => checkScroll());
    observer.observe(el);
    if (el.firstElementChild) {
      observer.observe(el.firstElementChild);
    }

    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, []);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-border bg-card ${className ?? ""}`}
    >
      <div className="flex items-center justify-between border-b border-border bg-muted py-2 pr-2 pl-4">
        <div className="font-mono text-xs text-muted-foreground">{label}</div>
        <div className="flex items-center gap-2">
          {actions}
          <CopyButton copied={copied} onCopy={copy} subject="code" />
        </div>
      </div>

      <div
        ref={scrollRef}
        data-scroll={scrollState}
        className="scroll-fade-x overflow-x-auto font-mono text-[13px] leading-relaxed [&>pre]:m-0! [&>pre]:w-max! [&>pre]:min-w-full! [&>pre]:bg-transparent! [&>pre]:p-4! [&>pre]:font-mono! [&_code]:font-mono!"
      >
        {children}
      </div>
    </div>
  );
}
