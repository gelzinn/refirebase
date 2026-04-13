"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code, Sparkles } from "lucide-react";
import Link from "next/link";

export function Hero() {
  const codeSnippet = `const { db } = new Refirebase();

// No more boilerplate
const users = await db.firestore.get("users", {
  where: { role: "admin" }
});`;

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] hero-gradient pointer-events-none" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-primary text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            <span>Introducing Refirebase 0.1.24</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            Firebase development, <br />
            <span className="text-primary italic">simplified.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            O jeito mais fácil de gerenciar Firestore, Auth e Storage. Sem boilerplate, apenas código limpo e intuitivo.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              href="#get-started" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              Começar agora <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="https://github.com/refirebase/refirebase" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
            >
              <Code className="w-4 h-4" /> Ver no GitHub
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-3xl mx-auto rounded-2xl border border-white/10 glass p-1 shadow-2xl shadow-black/50 overflow-hidden bg-black/40"
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[10px] text-muted-foreground ml-auto font-mono">example.ts</span>
          </div>
          <pre className="p-6 text-left text-sm md:text-base font-mono overflow-x-auto">
            <code className="text-orange-400">
              {codeSnippet}
            </code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
