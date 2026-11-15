import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-4 max-w-sm text-sm text-ink-foreground/70">
            Self-service document printing for universities, libraries and public spaces across Pakistan. Print smarter. Anywhere.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/70">
            <li><a href="/#how" className="hover:text-lime">How It Works</a></li>
            <li><a href="/#features" className="hover:text-lime">Features</a></li>
            <li><Link to="/print" className="hover:text-lime">Customer demo</Link></li>
            <li><Link to="/admin" className="hover:text-lime">Admin dashboard</Link></li>
            <li><Link to="/about" className="hover:text-lime">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-ink-foreground/70">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@smartprint.pk</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +92 300 0000000</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Islamabad, Pakistan</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-ink-foreground/60 sm:flex-row sm:justify-between">
          <span>© 2026 SmartPrint. MVP demo — no real payments, SMS or printers are connected.</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-lime">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-lime">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
