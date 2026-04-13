import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      
      {/* CTA Section */}
      <section id="get-started" className="py-24 border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Pronto para acelerar?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 font-mono text-sm">
              bun add refirebase
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black/40">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center font-bold text-white text-xs">
              R
            </div>
            <span className="font-bold">Refirebase</span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="https://github.com/refirebase/refirebase" className="hover:text-primary transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="#" className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
              <Twitter className="w-4 h-4" />
            </Link>
            <Link href="https://github.com/refirebase/refirebase" className="p-2 rounded-full hover:bg-white/5 transition-colors text-muted-foreground hover:text-white">
              <Github className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-8 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Refirebase. Built for developers by gelzin.com
        </div>
      </footer>
    </main>
  );
}
