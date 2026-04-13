import Link from "next/link";
import { Github } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-orange-500/20">
              R
            </div>
            <span className="font-bold text-xl tracking-tight">Refirebase</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#docs" className="hover:text-primary transition-colors">Docs</Link>
            <Link href="https://github.com/refirebase/refirebase" className="hover:text-primary transition-colors">GitHub</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="https://github.com/refirebase/refirebase" 
            target="_blank"
            className="p-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <Github className="w-5 h-5" />
          </Link>
          <Link 
            href="/playground" 
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Try it out
          </Link>
        </div>
      </div>
    </nav>
  );
}
