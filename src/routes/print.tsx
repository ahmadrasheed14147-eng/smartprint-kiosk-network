import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, CheckCircle2, CreditCard, FileImage, FileText, Loader2, Minus, Plus,
  Printer, RotateCcw, ShieldCheck, Smartphone, Trash2, Upload, Wallet, AlertCircle, KeyRound, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";
import {
  defaultPrefs, estimateCost, formatPKR, parseRange, selectedPageCount, SAMPLE_RATES, type PrintPrefs,
} from "@/lib/pricing";

export const Route = createFileRoute("/print")({
  head: () => ({
    meta: [
      { title: "Start Printing — SmartPrint Demo" },
      { name: "description", content: "Try the SmartPrint customer journey: connect to a kiosk, upload, configure, pay and collect." },
      { property: "og:title", content: "Start Printing — SmartPrint Demo" },
      { property: "og:description", content: "Connect, upload, configure, pay and collect — the full SmartPrint demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrintFlow,
});

const KIOSK = { id: "SP-ISB-001", location: "Islamabad University", detail: "Main Library, Ground Floor", status: "Online" };
const ACCEPT = ["application/pdf", "image/jpeg", "image/png"];
const MAX_MB = 20;

interface UFile { id: string; file: File; name: string; size: number; kind: "pdf" | "image"; progress: number; pages: number | null; error?: string }

const fmtSize = (b: number) => (b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);
const rid = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");

function countPdfPages(buf: ArrayBuffer): number {
  const text = new TextDecoder("latin1").decode(buf);
  const m = text.match(/\/Type\s*\/Page(?![s\w])/g);
  return Math.max(1, m?.length ?? 1);
}

const STEPS = ["Connect", "Upload", "Preferences", "Payment", "Verify", "Status"];

function PrintFlow() {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<UFile[]>([]);
  const [prefs, setPrefs] = useState<Record<string, PrintPrefs>>({});
  const [order, setOrder] = useState<{ orderId: string; txnId: string; otp: string; method: string; total: number } | null>(null);

  const reset = () => { setStep(0); setFiles([]); setPrefs({}); setOrder(null); };
  const readyFiles = files.filter((f) => f.pages !== null && !f.error);

  const lines = readyFiles.map((f) => {
    const p = prefs[f.id] ?? defaultPrefs;
    const pages = selectedPageCount(p, f.pages!);
    return { f, p, pages, cost: estimateCost(p, pages) };
  });
  const total = lines.reduce((s, l) => s + l.cost, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Logo />
          <span className="rounded-full bg-lime px-3 py-1 text-xs font-semibold text-ink">Demo session</span>
        </div>
      </header>
      {step > 0 && (
        <div className="border-b bg-card">
          <ol className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-5 py-3">
            {STEPS.map((s, i) => (
              <li key={s} className={cn("flex shrink-0 items-center gap-2 text-xs font-medium", i <= step ? "text-foreground" : "text-muted-foreground")}>
                <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border text-[11px]",
                  i < step && "border-primary bg-primary text-primary-foreground", i === step && "border-primary text-primary")}>
                  {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
                </span>
                {s}
                {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
              </li>
            ))}
          </ol>
        </div>
      )}
      <main className="mx-auto max-w-5xl px-5 py-10">
        {step === 0 && <Connect onStart={() => setStep(1)} />}
        {step === 1 && <UploadStep files={files} setFiles={setFiles} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
        {step === 2 && <PrefsStep lines={lines} prefs={prefs} setPrefs={setPrefs} total={total} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
        {step === 3 && <PaymentStep lines={lines} total={total} onBack={() => setStep(2)}
          onPaid={(method) => { setOrder({ orderId: `SP-${rid(5)}`, txnId: `DEMO-TXN-${rid(8)}`, otp: rid(6), method, total }); setStep(4); }} />}
        {step === 4 && order && <OtpStep order={order} onVerified={() => setStep(5)} />}
        {step === 5 && order && <StatusStep order={order} onReset={reset} />}
      </main>
    </div>
  );
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border bg-card p-6 shadow-soft", className)}>{children}</div>;
}

function KioskInfo() {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-surface p-4">
      <Printer className="mt-0.5 h-5 w-5 text-primary" />
      <div className="text-sm">
        <p className="font-semibold">{KIOSK.location} · <span className="font-mono">{KIOSK.id}</span></p>
        <p className="text-muted-foreground">{KIOSK.detail}</p>
      </div>
    </div>
  );
}

function Connect({ onStart }: { onStart: () => void }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="mx-auto max-w-md">
      <Card className="p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Printer className="h-7 w-7" /></span>
        <h1 className="mt-6 text-2xl font-bold tracking-tight">Welcome to SmartPrint</h1>
        <p className="mt-2 text-sm text-muted-foreground">You've scanned the QR code on a SmartPrint kiosk. Start a session to upload and print your documents.</p>
        <dl className="mt-8 divide-y rounded-xl border text-left text-sm">
          <div className="flex justify-between p-4"><dt className="text-muted-foreground">Kiosk ID</dt><dd className="font-mono font-semibold">{KIOSK.id}</dd></div>
          <div className="flex justify-between p-4"><dt className="text-muted-foreground">Location</dt><dd className="font-semibold">{KIOSK.location}</dd></div>
          <div className="flex justify-between p-4"><dt className="text-muted-foreground">Status</dt>
            <dd className="flex items-center gap-1.5 font-semibold text-primary"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" /><span className="h-2 w-2 rounded-full bg-primary" /></span>{KIOSK.status}</dd></div>
        </dl>
        <Button size="lg" className="mt-8 w-full" disabled={loading} onClick={() => { setLoading(true); setTimeout(onStart, 700); }}>
          {loading ? <><Loader2 className="animate-spin" /> Connecting…</> : <>Start Printing <ArrowRight /></>}
        </Button>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Info className="h-3.5 w-3.5" /> Demo kiosk — no physical printer is connected.</p>
      </Card>
    </div>
  );
}

function UploadStep({ files, setFiles, onBack, onNext }: {
  files: UFile[]; setFiles: React.Dispatch<React.SetStateAction<UFile[]>>; onBack: () => void; onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const addFiles = useCallback((list: FileList | File[]) => {
    const errs: string[] = [];
    const accepted: UFile[] = [];
    for (const file of Array.from(list)) {
      if (!ACCEPT.includes(file.type)) { errs.push(`${file.name}: unsupported format. Use PDF, JPG or PNG.`); continue; }
      if (file.size > MAX_MB * 1024 * 1024) { errs.push(`${file.name}: larger than ${MAX_MB} MB.`); continue; }
      accepted.push({ id: crypto.randomUUID(), file, name: file.name, size: file.size, kind: file.type === "application/pdf" ? "pdf" : "image", progress: 0, pages: null });
    }
    setErrors(errs);
    setFiles((prev) => [...prev, ...accepted]);
    for (const u of accepted) {
      const reader = new FileReader();
      reader.onprogress = (e) => e.lengthComputable && setFiles((p) => p.map((f) => f.id === u.id ? { ...f, progress: Math.round((e.loaded / e.total) * 90) } : f));
      reader.onerror = () => setFiles((p) => p.map((f) => f.id === u.id ? { ...f, error: "Could not read file" } : f));
      reader.onload = () => {
        const pages = u.kind === "pdf" ? countPdfPages(reader.result as ArrayBuffer) : 1;
        // brief delay so the progress bar is visible on small files
        setTimeout(() => setFiles((p) => p.map((f) => f.id === u.id ? { ...f, progress: 100, pages } : f)), 500 + Math.random() * 600);
      };
      reader.readAsArrayBuffer(u.file);
    }
  }, [setFiles]);

  const busy = files.some((f) => f.pages === null && !f.error);
  const ready = files.filter((f) => f.pages !== null && !f.error).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Upload your documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">PDF, JPG, JPEG or PNG · up to {MAX_MB} MB each · multiple files allowed</p>
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
          className={cn("mt-6 flex flex-col items-center rounded-2xl border-2 border-dashed bg-card px-6 py-12 text-center transition-colors",
            drag ? "border-primary bg-surface" : "border-border hover:border-primary/50")}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface text-primary"><Upload className="h-6 w-6" /></span>
          <p className="mt-4 font-semibold">Drag and drop files here</p>
          <p className="text-sm text-muted-foreground">or</p>
          <Button variant="outline" className="mt-3" onClick={() => inputRef.current?.click()}>Browse files</Button>
          <input ref={inputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden"
            onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }} />
        </div>
        {errors.length > 0 && (
          <div className="mt-4 space-y-1 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {errors.map((e) => <p key={e} className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{e}</p>)}
          </div>
        )}
        <div className="mt-6 space-y-3">
          {files.length === 0 && <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">No documents yet. Add a file to continue.</p>}
          {files.map((f) => (
            <div key={f.id} className="flex items-center gap-4 rounded-xl border bg-card p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-primary">
                {f.kind === "pdf" ? <FileText className="h-5 w-5" /> : <FileImage className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{f.name}</p>
                <p className="text-xs text-muted-foreground">
                  {fmtSize(f.size)} · {f.error ? <span className="text-destructive">{f.error}</span> : f.pages === null ? `Uploading ${f.progress}%` : `${f.pages} page${f.pages > 1 ? "s" : ""} · Ready`}
                </p>
                {f.pages === null && !f.error && <div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${f.progress}%` }} /></div>}
              </div>
              {f.pages !== null && <CheckCircle2 className="h-5 w-5 text-primary" />}
              <Button variant="ghost" size="icon" aria-label={`Remove ${f.name}`} onClick={() => setFiles((p) => p.filter((x) => x.id !== f.id))}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <aside className="space-y-4">
        <KioskInfo />
        <Card className="p-5 text-sm">
          <p className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" /> Your files stay private</p>
          <p className="mt-2 text-muted-foreground">In this demo, documents stay in your browser and are never sent to a server. Removing a file deletes it from the session.</p>
        </Card>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}><ArrowLeft /> Back</Button>
          <Button className="flex-1" disabled={!ready || busy} onClick={onNext}>{busy ? "Uploading…" : "Continue"} <ArrowRight /></Button>
        </div>
      </aside>
    </div>
  );
}

function Seg<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="grid grid-flow-col gap-1 rounded-xl bg-muted p-1">
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)}
          className={cn("rounded-lg px-3 py-2 text-sm font-medium transition-all", value === o.v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

type Line = { f: UFile; p: PrintPrefs; pages: number; cost: number };

function PrefsStep({ lines, prefs, setPrefs, total, onBack, onNext }: {
  lines: Line[]; prefs: Record<string, PrintPrefs>; setPrefs: React.Dispatch<React.SetStateAction<Record<string, PrintPrefs>>>;
  total: number; onBack: () => void; onNext: () => void;
}) {
  const [activeId, setActiveId] = useState(lines[0]?.f.id);
  const active = lines.find((l) => l.f.id === activeId) ?? lines[0];
  if (!active) return null;
  const p = active.p;
  const set = (patch: Partial<PrintPrefs>) => setPrefs((all) => ({ ...all, [active.f.id]: { ...(all[active.f.id] ?? defaultPrefs), ...patch } }));
  const rangeInvalid = p.rangeMode === "custom" && parseRange(p.customRange, active.f.pages!) === null;
  const anyInvalid = lines.some((l) => l.pages === 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Printing preferences</h1>
        <p className="mt-1 text-sm text-muted-foreground">Settings apply to the selected document.</p>
        {lines.length > 1 && (
          <div className="mt-6 flex gap-2 overflow-x-auto">
            {lines.map((l) => (
              <button key={l.f.id} onClick={() => setActiveId(l.f.id)}
                className={cn("shrink-0 rounded-lg border px-3 py-2 text-left text-xs", l.f.id === active.f.id ? "border-primary bg-surface" : "bg-card hover:border-primary/40")}>
                <p className="max-w-40 truncate font-semibold">{l.f.name}</p><p className="text-muted-foreground">{formatPKR(l.cost)}</p>
              </button>
            ))}
          </div>
        )}
        <Card className="mt-6 space-y-6">
          <div className="flex items-center gap-3 border-b pb-5">
            <FileText className="h-5 w-5 text-primary" />
            <div className="min-w-0"><p className="truncate font-semibold">{active.f.name}</p><p className="text-xs text-muted-foreground">{active.f.pages} pages in document</p></div>
          </div>
          <Field label="Paper size"><Seg value={p.paperSize} onChange={(v) => set({ paperSize: v })} options={[{ v: "A4", label: "A4" }, { v: "A3", label: "A3" }]} /></Field>
          <Field label="Colour"><Seg value={p.color} onChange={(v) => set({ color: v })} options={[{ v: "bw", label: "Black & White" }, { v: "color", label: "Colour" }]} /></Field>
          <Field label="Sides"><Seg value={p.sides} onChange={(v) => set({ sides: v })} options={[{ v: "single", label: "Single-sided" }, { v: "double", label: "Double-sided" }]} /></Field>
          <Field label="Copies">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" disabled={p.copies <= 1} onClick={() => set({ copies: p.copies - 1 })} aria-label="Fewer copies"><Minus /></Button>
              <span className="w-10 text-center text-lg font-bold">{p.copies}</span>
              <Button variant="outline" size="icon" disabled={p.copies >= 20} onClick={() => set({ copies: p.copies + 1 })} aria-label="More copies"><Plus /></Button>
              <span className="text-xs text-muted-foreground">Max 20</span>
            </div>
          </Field>
          <Field label="Page range">
            <Seg value={p.rangeMode} onChange={(v) => set({ rangeMode: v })} options={[{ v: "all", label: "All pages" }, { v: "custom", label: "Custom pages" }]} />
            {p.rangeMode === "custom" && (
              <div className="mt-3">
                <Input placeholder={`e.g. 1-3, 5 (max ${active.f.pages})`} value={p.customRange} onChange={(e) => set({ customRange: e.target.value })} aria-invalid={rangeInvalid} />
                {rangeInvalid && <p className="mt-1.5 text-xs text-destructive">Enter pages between 1 and {active.f.pages}, like 1-3, 5.</p>}
              </div>
            )}
          </Field>
        </Card>
      </div>
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <Card className="p-5">
          <p className="text-sm font-semibold">Estimate</p>
          <dl className="mt-4 space-y-2 text-sm">
            <Row k="Selected document" v={<span className="max-w-36 truncate">{active.f.name}</span>} />
            <Row k="Pages to print" v={active.pages} />
            <Row k="Copies" v={p.copies} />
            <Row k="This document" v={formatPKR(active.cost)} />
          </dl>
          <div className="mt-4 flex items-end justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">Estimated total ({lines.length} file{lines.length > 1 ? "s" : ""})</span>
            <span className="text-2xl font-bold">{formatPKR(total)}</span>
          </div>
          <p className="mt-3 rounded-lg bg-surface p-3 text-xs text-muted-foreground">
            Sample prices: B&W Rs {SAMPLE_RATES.bw}/page, Colour Rs {SAMPLE_RATES.color}/page, A3 ×{SAMPLE_RATES.a3Multiplier}, double-sided 10% off. Illustrative only.
          </p>
        </Card>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}><ArrowLeft /> Back</Button>
          <Button className="flex-1" disabled={anyInvalid || total === 0} onClick={onNext}>Review order <ArrowRight /></Button>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-2 text-sm font-medium">{label}</p>{children}</div>;
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="flex font-medium">{v}</dd></div>;
}

const METHODS = [
  { id: "JazzCash", icon: Smartphone, desc: "Mobile wallet" },
  { id: "Easypaisa", icon: Wallet, desc: "Mobile wallet" },
  { id: "Bank card", icon: CreditCard, desc: "Visa / Mastercard / PayPak" },
];

function PaymentStep({ lines, total, onBack, onPaid }: { lines: Line[]; total: number; onBack: () => void; onPaid: (m: string) => void }) {
  const [method, setMethod] = useState("JazzCash");
  const [paying, setPaying] = useState(false);
  const label = (p: PrintPrefs) => `${p.paperSize} · ${p.color === "bw" ? "B&W" : "Colour"} · ${p.sides === "single" ? "Single" : "Double"}-sided · ${p.copies} cop${p.copies > 1 ? "ies" : "y"}`;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Order summary & payment</h1>
        <Card className="p-0">
          {lines.map((l) => (
            <div key={l.f.id} className="flex items-start justify-between gap-4 border-b p-5 last:border-0">
              <div className="min-w-0">
                <p className="truncate font-semibold">{l.f.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{l.pages} page{l.pages > 1 ? "s" : ""}{l.p.rangeMode === "custom" ? ` (${l.p.customRange})` : ""} · {label(l.p)}</p>
              </div>
              <p className="font-semibold">{formatPKR(l.cost)}</p>
            </div>
          ))}
        </Card>
        <KioskInfo />
        <div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">Payment method</p>
            <span className="rounded-full bg-lime px-2.5 py-0.5 text-xs font-semibold text-ink">DEMO PAYMENT</span>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {METHODS.map((m) => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={cn("rounded-xl border bg-card p-4 text-left transition-all", method === m.id ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40")}>
                <m.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">{m.id}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <Card className="p-5">
          <div className="flex items-end justify-between"><span className="text-sm text-muted-foreground">Estimated total</span><span className="text-3xl font-bold">{formatPKR(total)}</span></div>
          <p className="mt-1 text-xs text-muted-foreground">Sample price · via {method}</p>
          <Button size="lg" className="mt-5 w-full" disabled={paying} onClick={() => { setPaying(true); setTimeout(() => onPaid(method), 1600); }}>
            {paying ? <><Loader2 className="animate-spin" /> Processing demo payment…</> : "Confirm Demo Payment"}
          </Button>
          <p className="mt-3 flex gap-2 text-xs text-muted-foreground"><Info className="h-4 w-4 shrink-0" /> No money is charged. Real JazzCash, Easypaisa and card gateways are not yet integrated.</p>
        </Card>
        <Button variant="outline" onClick={onBack} disabled={paying}><ArrowLeft /> Back</Button>
      </aside>
    </div>
  );
}

function OtpStep({ order, onVerified }: { order: { orderId: string; txnId: string; otp: string; total: number; method: string }; onVerified: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const verify = () => {
    if (code.length !== 6) return setError("Enter all 6 digits.");
    if (code !== order.otp) return setError("That code doesn't match. Check the OTP shown above.");
    onVerified();
  };
  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
      <Card>
        <div className="flex items-center gap-2 text-primary"><CheckCircle2 className="h-5 w-5" /><span className="text-sm font-semibold">Demo payment successful</span></div>
        <dl className="mt-5 space-y-3 text-sm">
          <Row k="Order ID" v={<span className="font-mono">{order.orderId}</span>} />
          <Row k="Transaction ID" v={<span className="font-mono">{order.txnId}</span>} />
          <Row k="Status" v={<span className="text-primary">Paid (demo)</span>} />
          <Row k="Amount" v={`${formatPKR(order.total)} · ${order.method}`} />
        </dl>
        <div className="mt-6"><KioskInfo /></div>
        <ol className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li>1. Walk to kiosk <span className="font-mono text-foreground">{KIOSK.id}</span>.</li>
          <li>2. Enter your 6-digit OTP on the kiosk screen (or below for this demo).</li>
          <li>3. Collect your documents from the output tray.</li>
        </ol>
      </Card>
      <Card className="flex flex-col">
        <KeyRound className="h-6 w-6 text-primary" />
        <h1 className="mt-4 text-xl font-bold">Collection OTP</h1>
        <p className="mt-1 text-sm text-muted-foreground">Shown on screen for this demo — no SMS is sent.</p>
        <div className="mt-5 rounded-xl bg-ink py-5 text-center font-mono text-4xl font-bold tracking-[0.4em] text-lime">{order.otp}</div>
        <label className="mt-6 text-sm font-medium" htmlFor="otp">Enter OTP to release prints</label>
        <Input id="otp" inputMode="numeric" maxLength={6} placeholder="••••••" value={code}
          onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && verify()}
          className="mt-2 h-12 text-center font-mono text-xl tracking-[0.4em]" />
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        <Button size="lg" className="mt-4" onClick={verify}>Verify & print</Button>
      </Card>
    </div>
  );
}

const STATES = ["Order Received", "Payment Confirmed", "Queued for Printing", "Printing", "Completed"];

function StatusStep({ order, onReset }: { order: { orderId: string }; onReset: () => void }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= STATES.length - 1) return;
    const t = setTimeout(() => setIdx((i) => i + 1), idx === 3 ? 2600 : 1300);
    return () => clearTimeout(t);
  }, [idx]);
  const done = idx === STATES.length - 1;
  return (
    <div className="mx-auto max-w-xl">
      <Card className="p-8">
        {done ? (
          <div className="text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime text-ink"><CheckCircle2 className="h-8 w-8" /></span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight">Your prints are ready!</h1>
            <p className="mt-2 text-sm text-muted-foreground">Collect them from the output tray at the kiosk.</p>
          </div>
        ) : (
          <div className="text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <h1 className="mt-4 text-xl font-bold">{STATES[idx]}…</h1>
            <p className="mt-1 text-xs text-muted-foreground">Simulated job progress</p>
          </div>
        )}
        <ol className="mt-8 space-y-0">
          {STATES.map((s, i) => (
            <li key={s} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className={cn("flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
                  i < idx || done ? "border-primary bg-primary text-primary-foreground" : i === idx ? "border-primary text-primary" : "border-border text-muted-foreground")}>
                  {i < idx || done ? <CheckCircle2 className="h-4 w-4" /> : i === idx ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
                {i < STATES.length - 1 && <span className={cn("h-8 w-0.5", i < idx ? "bg-primary" : "bg-border")} />}
              </div>
              <p className={cn("pt-1 text-sm", i <= idx ? "font-semibold" : "text-muted-foreground")}>{s}</p>
            </li>
          ))}
        </ol>
        <dl className="mt-6 space-y-2 rounded-xl bg-surface p-4 text-sm">
          <Row k="Order ID" v={<span className="font-mono">{order.orderId}</span>} />
          <Row k="Kiosk" v={`${KIOSK.id} · ${KIOSK.location}`} />
          <Row k="Collect at" v={KIOSK.detail} />
        </dl>
        {done && (
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button className="flex-1" onClick={onReset}><RotateCcw /> Start New Session</Button>
            <Button variant="outline" asChild><Link to="/">Back to home</Link></Button>
          </div>
        )}
      </Card>
    </div>
  );
}
