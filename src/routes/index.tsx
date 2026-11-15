import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, QrCode, Upload, CreditCard, PackageCheck, ShieldCheck, SlidersHorizontal, Wallet,
  KeyRound, Cpu, MapPin, Activity, GraduationCap, Library, Hospital, Landmark, Scale, ShoppingBag,
  Building2, FileText, CheckCircle2, Wifi,
} from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartPrint — Self-service printing kiosks in Pakistan" },
      { name: "description", content: "Upload documents, choose preferences, pay digitally and collect prints from a nearby SmartPrint kiosk. No queues." },
      { property: "og:title", content: "SmartPrint — Self-service printing kiosks" },
      { property: "og:description", content: "Upload, configure, pay and collect your prints from a nearby kiosk. No queues." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const steps = [
  { icon: QrCode, title: "Scan the QR Code", text: "Connect to a nearby SmartPrint kiosk." },
  { icon: Upload, title: "Upload Your Documents", text: "Upload PDFs, images and supported documents." },
  { icon: SlidersHorizontal, title: "Configure & Pay", text: "Select copies, paper size, colour and printing preferences." },
  { icon: PackageCheck, title: "Collect Your Prints", text: "Verify your session and collect your documents." },
];
const features = [
  { icon: QrCode, title: "QR-based sessions", text: "Each kiosk has a unique code that starts a private printing session." },
  { icon: ShieldCheck, title: "Secure uploads", text: "Documents are tied to your session and removed after printing." },
  { icon: SlidersHorizontal, title: "Multiple print options", text: "A4 or A3, colour or B&W, single or double-sided, page ranges." },
  { icon: Wallet, title: "Digital payments", text: "Designed for JazzCash, Easypaisa and bank cards." },
  { icon: KeyRound, title: "OTP collection", text: "A one-time code ensures only you can release your prints." },
  { icon: Cpu, title: "Automated processing", text: "Jobs are queued and printed without staff involvement." },
  { icon: MapPin, title: "Multiple locations", text: "A growing network of kiosks across campuses and cities." },
  { icon: Activity, title: "Central monitoring", text: "Paper, toner and uptime for every machine in one dashboard." },
];
const places = [
  { icon: GraduationCap, title: "Universities & colleges", text: "Assignments, theses and notes between classes." },
  { icon: Library, title: "Libraries", text: "Print research material without waiting for staff." },
  { icon: Hospital, title: "Hospitals", text: "Reports and forms for patients and families." },
  { icon: Landmark, title: "Government offices", text: "Application forms and document copies on the spot." },
  { icon: Scale, title: "Courts", text: "Case files and affidavits printed securely." },
  { icon: ShoppingBag, title: "Shopping malls", text: "Convenient printing for everyday errands." },
  { icon: Building2, title: "Corporate offices", text: "Shared, tracked printing for teams and visitors." },
];

function HeroMockup() {
  return (
    <div className="relative mx-auto flex h-[440px] w-full max-w-md items-end justify-center">
      <div className="absolute inset-x-6 bottom-0 top-10 rounded-[2rem] bg-surface" />
      {/* Kiosk */}
      <div className="relative z-0 mr-[-40px] flex h-[380px] w-48 flex-col rounded-t-3xl rounded-b-lg bg-ink p-4 shadow-soft">
        <div className="flex items-center gap-2"><LogoMark className="h-6 w-6" /><span className="text-xs font-bold text-ink-foreground">SmartPrint</span></div>
        <div className="mt-4 rounded-xl bg-ink-foreground/10 p-3 text-center">
          <div className="mx-auto grid h-20 w-20 grid-cols-5 gap-0.5 rounded-md bg-card p-1.5">
            {Array.from({ length: 25 }).map((_, i) => (
              <span key={i} className={[0,1,3,4,5,9,12,15,19,20,21,23,24,7,17].includes(i) ? "bg-ink" : "bg-card"} />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-ink-foreground/70">Scan to connect</p>
          <p className="font-mono text-[11px] font-semibold text-lime">SP-ISB-001</p>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-ink-foreground/70"><Wifi className="h-3 w-3 text-lime" /> Online</div>
        <div className="mt-auto rounded-md bg-ink-foreground/10 p-2">
          <div className="h-2 rounded-full bg-ink" />
          <div className="mx-auto mt-1 h-6 w-3/4 rounded-b-sm bg-card" />
        </div>
      </div>
      {/* Phone */}
      <div className="relative z-10 mb-6 h-[360px] w-44 rounded-[2rem] border-[6px] border-ink bg-card p-3 shadow-soft">
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-ink/20" />
        <p className="text-[11px] font-bold">Upload documents</p>
        <p className="text-[9px] text-muted-foreground">Kiosk SP-ISB-001</p>
        <div className="mt-3 rounded-xl border-2 border-dashed border-primary/40 bg-surface p-3 text-center">
          <Upload className="mx-auto h-5 w-5 text-primary" />
          <p className="mt-1 text-[9px] font-medium">Drop PDF or image</p>
        </div>
        {["Thesis_Ch3.pdf", "Lab_Report.pdf"].map((f, i) => (
          <div key={f} className="mt-2 flex items-center gap-2 rounded-lg border p-2">
            <FileText className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <p className="text-[9px] font-semibold">{f}</p>
              <div className="mt-1 h-1 rounded-full bg-muted"><div className={`h-1 rounded-full bg-primary ${i ? "w-2/3" : "w-full"}`} /></div>
            </div>
            {!i && <CheckCircle2 className="h-3 w-3 text-primary" />}
          </div>
        ))}
        <div className="mt-3 rounded-lg bg-primary py-2 text-center text-[10px] font-semibold text-primary-foreground">Continue · Rs 240</div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" /> Now piloting in Islamabad
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
            Your Documents. Your Way. <span className="text-primary">Instantly.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Upload your documents, choose your printing preferences and collect your prints from a nearby self-service kiosk. No queues. No complicated process.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild><Link to="/print">Start Printing <ArrowRight /></Link></Button>
            <Button size="lg" variant="outline" asChild><a href="#how">See How It Works</a></Button>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            <div><p className="text-2xl font-bold">3</p><p className="text-muted-foreground">Pilot kiosks</p></div>
            <div><p className="text-2xl font-bold">&lt;2 min</p><p className="text-muted-foreground">Upload to print</p></div>
            <div><p className="text-2xl font-bold">24/7</p><p className="text-muted-foreground">Self-service</p></div>
          </div>
        </div>
        <HeroMockup />
      </section>

      <section id="how" className="scroll-mt-20 border-y bg-card py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold text-primary">How it works</p>
          <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">From phone to paper in four simple steps</h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-2xl border bg-background p-6 transition-shadow hover:shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><s.icon className="h-5 w-5" /></span>
                  <span className="font-mono text-sm text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="mt-6 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-primary">Platform</p>
              <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">Everything a modern print network needs</h2>
            </div>
            <p className="max-w-sm text-muted-foreground">One software layer connecting customers, payments and machines.</p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="bg-card p-6">
                <f.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="locations" className="scroll-mt-20 bg-surface py-20">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-sm font-semibold text-primary">Where SmartPrint fits</p>
          <h2 className="mt-2 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">Built for places where people need to print, fast</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {places.map((p) => (
              <div key={p.title} className="group rounded-2xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-soft">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface text-primary transition-colors group-hover:bg-lime"><p.icon className="h-5 w-5" /></span>
                <h3 className="mt-5 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
              </div>
            ))}
            <div className="flex flex-col justify-between rounded-2xl bg-primary p-6 text-primary-foreground">
              <p className="font-semibold">Host a kiosk at your institution</p>
              <a href="mailto:hello@smartprint.pk" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-lime">Get in touch <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="rounded-3xl bg-ink px-8 py-16 text-center md:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-ink-foreground md:text-4xl">
              Printing should be simple. <span className="text-lime">We're making it smarter.</span>
            </h2>
            <Button size="lg" className="mt-8 bg-lime text-ink hover:bg-lime/90" asChild>
              <Link to="/print">Try SmartPrint Demo <ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
