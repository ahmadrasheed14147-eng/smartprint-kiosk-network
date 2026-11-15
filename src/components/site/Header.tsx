import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const links = [
  { label: "How It Works", href: "/#how" },
  { label: "Features", href: "/#features" },
  { label: "Locations", href: "/#locations" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{l.label}</a>
          ))}
          <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">About</Link>
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild><Link to="/admin">Sign In</Link></Button>
          <Button asChild><Link to="/print">Start Printing</Link></Button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-medium">{l.label}</a>)}
            <Link to="/about" className="font-medium">About</Link>
            <Link to="/admin" className="font-medium">Sign In</Link>
            <Button asChild><Link to="/print">Start Printing</Link></Button>
          </div>
        </div>
      )}
    </header>
  );
}
