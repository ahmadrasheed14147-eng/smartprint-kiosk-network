import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  LayoutDashboard, Printer, Monitor, Receipt, Users, BarChart3, Settings, Search, Plus, Wifi, WifiOff,
  FileText, Banknote, CheckCircle2, Clock, Menu, X, Droplet, Layers, ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogoMark } from "@/components/site/Logo";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/pricing";
import {
  demoJobs, demoKiosks, demoTxns, dailyJobs, volumeByLocation, peakHours, popularOptions, type Kiosk, type PrintJob, type JobStatus,
} from "@/lib/demo-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — SmartPrint" },
      { name: "description", content: "Manage SmartPrint kiosks, print jobs, transactions and analytics (demo data)." },
      { property: "og:title", content: "Admin Dashboard — SmartPrint" },
      { property: "og:description", content: "Network-wide view of kiosks, jobs and revenue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "jobs", label: "Print Jobs", icon: Printer },
  { id: "kiosks", label: "Kiosks", icon: Monitor },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
] as const;
type Section = (typeof NAV)[number]["id"];

const C = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const fmtDate = (iso: string) => new Date(iso).toLocaleString("en-PK", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function Admin() {
  const [section, setSection] = useState<Section>("overview");
  const [kiosks, setKiosks] = useState<Kiosk[]>(demoKiosks);
  const [mobileNav, setMobileNav] = useState(false);
  const title = NAV.find((n) => n.id === section)!.label;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:flex lg:translate-x-0",
        mobileNav ? "flex translate-x-0" : "hidden -translate-x-full lg:flex")}>
        <div className="flex h-16 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2"><LogoMark /><span className="font-extrabold text-sidebar-accent-foreground">Smart<span className="text-lime">Print</span></span></Link>
          <button className="lg:hidden" onClick={() => setMobileNav(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => { setSection(n.id); setMobileNav(false); }}
              className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                section === n.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground")}>
              <n.icon className={cn("h-4 w-4", section === n.id && "text-lime")} />{n.label}
            </button>
          ))}
        </nav>
        <div className="m-3 rounded-xl bg-sidebar-accent p-4 text-xs">
          <p className="font-semibold text-sidebar-accent-foreground">Demo workspace</p>
          <p className="mt-1">All figures are sample data for demonstration.</p>
        </div>
      </aside>
      {mobileNav && <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={() => setMobileNav(false)} />}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-card px-5">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
            <h1 className="text-lg font-bold">{title}</h1>
            <span className="hidden rounded-full bg-lime px-2.5 py-0.5 text-xs font-semibold text-ink sm:inline">Demo data</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild><Link to="/print">Open customer app</Link></Button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">AR</span>
          </div>
        </header>
        <main className="p-5 md:p-8">
          {section === "overview" && <Overview kiosks={kiosks} />}
          {section === "jobs" && <Jobs />}
          {section === "kiosks" && <Kiosks kiosks={kiosks} setKiosks={setKiosks} />}
          {section === "transactions" && <Transactions />}
          {section === "customers" && <Customers />}
          {section === "analytics" && <Analytics />}
          {section === "settings" && <SettingsPanel />}
        </main>
      </div>
    </div>
  );
}

function Panel({ title, children, className, action }: { title?: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border bg-card p-5 shadow-soft", className)}>
      {title && <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">{title}</h3>{action}</div>}
      {children}
    </div>
  );
}

function Kpi({ label, value, icon: Icon, delta }: { label: string; value: string; icon: React.ElementType; delta?: string }) {
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-primary"><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
      {delta && <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary"><ArrowUpRight className="h-3 w-3" />{delta} vs last week</p>}
    </Panel>
  );
}

const statusStyle: Record<string, string> = {
  Completed: "bg-surface text-primary", Successful: "bg-surface text-primary",
  Printing: "bg-lime/50 text-ink", Queued: "bg-muted text-foreground", Pending: "bg-warning/20 text-foreground",
  Failed: "bg-destructive/10 text-destructive", Refunded: "bg-destructive/10 text-destructive",
};
function Badge({ s }: { s: string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", statusStyle[s])}>{s}</span>;
}

const tooltipStyle = { borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 };

function Overview({ kiosks }: { kiosks: Kiosk[] }) {
  const pending = demoJobs.filter((j) => ["Pending", "Queued", "Printing"].includes(j.status)).length;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi label="Total Print Jobs" value="1,110" icon={Printer} delta="12%" />
        <Kpi label="Total Revenue" value={formatPKR(76760)} icon={Banknote} delta="9%" />
        <Kpi label="Active Kiosks" value={`${kiosks.filter((k) => k.online).length} / ${kiosks.length}`} icon={Monitor} />
        <Kpi label="Pending Jobs" value={String(pending)} icon={Clock} />
        <Kpi label="Completed Jobs" value="1,084" icon={CheckCircle2} delta="11%" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Daily print jobs">
          <div className="h-64"><ResponsiveContainer><BarChart data={dailyJobs}><CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} /><YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--surface)" }} /><Bar dataKey="jobs" fill="var(--chart-1)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Revenue over time (PKR)">
          <div className="h-64"><ResponsiveContainer><AreaChart data={dailyJobs}><CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} /><YAxis tickLine={false} axisLine={false} fontSize={12} width={44} />
            <Tooltip contentStyle={tooltipStyle} /><Area dataKey="revenue" stroke="var(--chart-1)" fill="var(--chart-2)" fillOpacity={0.4} strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
        </Panel>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Printing volume by location (pages)" className="lg:col-span-2">
          <div className="h-56"><ResponsiveContainer><BarChart data={volumeByLocation} layout="vertical"><CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} /><YAxis type="category" dataKey="location" tickLine={false} axisLine={false} fontSize={12} width={100} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--surface)" }} /><Bar dataKey="pages" fill="var(--chart-3)" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Recent jobs">
          <ul className="space-y-3">
            {demoJobs.slice(0, 5).map((j) => (
              <li key={j.id} className="flex items-center justify-between gap-2 text-sm">
                <div className="min-w-0"><p className="truncate font-medium">{j.document}</p><p className="text-xs text-muted-foreground">{j.id} · {j.kiosk}</p></div>
                <Badge s={j.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Jobs() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [kiosk, setKiosk] = useState("all");
  const [sel, setSel] = useState<PrintJob | null>(null);
  const rows = useMemo(() => demoJobs.filter((j) =>
    (status === "all" || j.status === status) && (kiosk === "all" || j.kiosk === kiosk) &&
    [j.id, j.customer, j.document].some((v) => v.toLowerCase().includes(q.toLowerCase()))), [q, status, kiosk]);
  return (
    <Panel>
      <div className="mb-4 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search order, customer or document" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <Select value={status} onValueChange={setStatus}><SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All statuses</SelectItem>{(["Completed", "Printing", "Queued", "Pending", "Failed"] as JobStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
        <Select value={kiosk} onValueChange={setKiosk}><SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All kiosks</SelectItem>{demoKiosks.map((k) => <SelectItem key={k.id} value={k.id}>{k.id}</SelectItem>)}</SelectContent></Select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead><tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
            {["Order ID", "Customer", "Kiosk", "Document", "Pages", "Amount", "Status", "Date"].map((h) => <th key={h} className="px-3 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((j) => (
              <tr key={j.id} onClick={() => setSel(j)} className="cursor-pointer border-b transition-colors last:border-0 hover:bg-surface/60">
                <td className="px-3 py-3 font-mono text-xs font-semibold">{j.id}</td><td className="px-3 py-3">{j.customer}</td>
                <td className="px-3 py-3 font-mono text-xs">{j.kiosk}</td><td className="max-w-48 truncate px-3 py-3">{j.document}</td>
                <td className="px-3 py-3">{j.pages * j.copies}</td><td className="px-3 py-3 font-medium">{formatPKR(j.amount)}</td>
                <td className="px-3 py-3"><Badge s={j.status} /></td><td className="px-3 py-3 text-muted-foreground">{fmtDate(j.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <div className="py-14 text-center text-sm text-muted-foreground"><FileText className="mx-auto mb-2 h-6 w-6" />No jobs match your filters.</div>}
      </div>
      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent>
          {sel && (<>
            <DialogHeader><DialogTitle className="font-mono">{sel.id}</DialogTitle><DialogDescription>{sel.document}</DialogDescription></DialogHeader>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {[["Customer", sel.customer], ["Phone", sel.phone], ["Kiosk", sel.kiosk], ["Status", <Badge key="b" s={sel.status} />],
                ["Pages × copies", `${sel.pages} × ${sel.copies}`], ["Options", `${sel.size} · ${sel.color}`], ["Amount", formatPKR(sel.amount)], ["Date", fmtDate(sel.date)]]
                .map(([k, v]) => <div key={String(k)}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 font-medium">{v}</dd></div>)}
            </dl>
            <DialogFooter><Button variant="outline" onClick={() => { toast.success(`Reprint queued for ${sel.id} (demo)`); setSel(null); }}>Reprint (demo)</Button></DialogFooter>
          </>)}
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

function Level({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-1 text-muted-foreground"><Icon className="h-3 w-3" />{label}</span><span className="font-semibold">{value}%</span></div>
      <div className="mt-1 h-1.5 rounded-full bg-muted"><div className={cn("h-1.5 rounded-full", value < 25 ? "bg-destructive" : value < 50 ? "bg-warning" : "bg-primary")} style={{ width: `${value}%` }} /></div>
    </div>
  );
}

function Kiosks({ kiosks, setKiosks }: { kiosks: Kiosk[]; setKiosks: React.Dispatch<React.SetStateAction<Kiosk[]>> }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: "", location: "", city: "Islamabad" });
  const [err, setErr] = useState("");
  const submit = () => {
    const id = form.id.trim().toUpperCase();
    if (!/^SP-[A-Z]{3}-\d{3}$/.test(id)) return setErr("Kiosk ID must look like SP-LHR-001.");
    if (kiosks.some((k) => k.id === id)) return setErr("A kiosk with this ID already exists.");
    if (form.location.trim().length < 3) return setErr("Enter a location name.");
    setKiosks((k) => [...k, { id, location: form.location.trim(), city: form.city, online: true, currentJob: null, paper: 100, toner: 100, lastActive: "Just now" }]);
    toast.success(`Kiosk ${id} added (demo)`);
    setOpen(false); setForm({ id: "", location: "", city: "Islamabad" }); setErr("");
  };
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Machine status is simulated.</p>
        <Button onClick={() => setOpen(true)}><Plus /> Add Kiosk</Button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {kiosks.map((k) => (
          <Panel key={k.id}>
            <div className="flex items-start justify-between">
              <div><p className="font-mono text-sm font-bold">{k.id}</p><p className="mt-0.5 text-sm text-muted-foreground">{k.location} · {k.city}</p></div>
              <button onClick={() => setKiosks((all) => all.map((x) => x.id === k.id ? { ...x, online: !x.online, lastActive: "Just now" } : x))}
                className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", k.online ? "bg-surface text-primary" : "bg-destructive/10 text-destructive")}
                title="Toggle simulated status">
                {k.online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}{k.online ? "Online" : "Offline"}
              </button>
            </div>
            <div className="mt-5 rounded-lg bg-muted/60 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Current job</p>
              <p className="font-medium">{k.currentJob ?? "Idle"}</p>
            </div>
            <div className="mt-4 space-y-3"><Level label="Paper" value={k.paper} icon={Layers} /><Level label="Toner" value={k.toner} icon={Droplet} /></div>
            <p className="mt-4 text-xs text-muted-foreground">Last active: {k.lastActive}</p>
          </Panel>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add kiosk</DialogTitle><DialogDescription>Register a new kiosk in the demo network.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label htmlFor="kid">Kiosk ID</Label><Input id="kid" className="mt-1.5" placeholder="SP-LHR-001" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} /></div>
            <div><Label htmlFor="kloc">Location</Label><Input id="kloc" className="mt-1.5" placeholder="LUMS Library" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div><Label>City</Label>
              <Select value={form.city} onValueChange={(v) => setForm({ ...form, city: v })}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            {err && <p className="text-sm text-destructive">{err}</p>}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Add kiosk</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Transactions() {
  const [method, setMethod] = useState("all");
  const rows = demoTxns.filter((t) => method === "all" || t.method === method);
  return (
    <Panel title="Demo payment records" action={
      <Select value={method} onValueChange={setMethod}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
        <SelectContent><SelectItem value="all">All methods</SelectItem>{["JazzCash", "Easypaisa", "Bank card"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select>}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead><tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">{["Transaction ID", "Order ID", "Method", "Amount", "Status", "Date"].map((h) => <th key={h} className="px-3 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>{rows.map((t) => (
            <tr key={t.id} className="border-b last:border-0 hover:bg-surface/60">
              <td className="px-3 py-3 font-mono text-xs">{t.id}</td><td className="px-3 py-3 font-mono text-xs">{t.orderId}</td><td className="px-3 py-3">{t.method}</td>
              <td className="px-3 py-3 font-medium">{formatPKR(t.amount)}</td><td className="px-3 py-3"><Badge s={t.status} /></td><td className="px-3 py-3 text-muted-foreground">{fmtDate(t.date)}</td>
            </tr>))}</tbody>
        </table>
      </div>
    </Panel>
  );
}

function Customers() {
  const map = new Map<string, { name: string; jobs: number; spent: number; last: string }>();
  demoJobs.forEach((j) => { const c = map.get(j.customer) ?? { name: j.customer, jobs: 0, spent: 0, last: j.date }; c.jobs++; c.spent += j.amount; map.set(j.customer, c); });
  return (
    <Panel title="Customers (demo)">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...map.values()].map((c) => (
          <div key={c.name} className="flex items-center gap-3 rounded-xl border p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-sm font-semibold text-primary">{c.name.split(" ").map((s) => s[0]).join("")}</span>
            <div className="text-sm"><p className="font-semibold">{c.name}</p><p className="text-xs text-muted-foreground">{c.jobs} jobs · {formatPKR(c.spent)}</p></div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Analytics() {
  const active = demoKiosks.map((k) => ({ id: k.id, jobs: demoJobs.filter((j) => j.kiosk === k.id).length * 37 })).sort((a, b) => b.jobs - a.jobs);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Printing volume (jobs / day)">
        <div className="h-60"><ResponsiveContainer><AreaChart data={dailyJobs}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} /><YAxis width={32} fontSize={12} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} /><Area dataKey="jobs" stroke="var(--chart-3)" fill="var(--chart-4)" fillOpacity={0.3} strokeWidth={2} /></AreaChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="Revenue (PKR / day)">
        <div className="h-60"><ResponsiveContainer><BarChart data={dailyJobs}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} /><YAxis width={44} fontSize={12} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--surface)" }} /><Bar dataKey="revenue" fill="var(--chart-1)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </Panel>
      <Panel title="Popular printing options">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-48 w-48"><ResponsiveContainer><PieChart><Pie data={popularOptions} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>{popularOptions.map((_, i) => <Cell key={i} fill={C[i]} />)}</Pie><Tooltip contentStyle={tooltipStyle} /></PieChart></ResponsiveContainer></div>
          <ul className="space-y-2 text-sm">{popularOptions.map((o, i) => <li key={o.name} className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: C[i] }} />{o.name}<span className="ml-auto pl-4 font-semibold">{o.value}%</span></li>)}</ul>
        </div>
      </Panel>
      <Panel title="Most active kiosks">
        <ul className="space-y-4">{active.map((k, i) => (
          <li key={k.id}><div className="flex justify-between text-sm"><span className="font-mono font-medium">{i + 1}. {k.id}</span><span className="font-semibold">{k.jobs} jobs</span></div>
            <div className="mt-1.5 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${(k.jobs / active[0]!.jobs) * 100}%` }} /></div></li>))}</ul>
      </Panel>
      <Panel title="Peak usage times" className="lg:col-span-2">
        <div className="h-56"><ResponsiveContainer><BarChart data={peakHours}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} /><YAxis width={32} fontSize={12} tickLine={false} axisLine={false} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--surface)" }} /><Bar dataKey="jobs" radius={[6, 6, 0, 0]}>{peakHours.map((h, i) => <Cell key={i} fill={h.jobs > 60 ? "var(--chart-1)" : "var(--chart-2)"} />)}</Bar></BarChart></ResponsiveContainer></div>
      </Panel>
    </div>
  );
}

function SettingsPanel() {
  return (
    <Panel title="Workspace settings" className="max-w-2xl">
      <div className="space-y-4">
        <div><Label>Organisation name</Label><Input className="mt-1.5" defaultValue="SmartPrint Pakistan" /></div>
        <div><Label>Support email</Label><Input className="mt-1.5" defaultValue="hello@smartprint.pk" /></div>
        <p className="rounded-lg bg-surface p-3 text-xs text-muted-foreground">Payment gateways, SMS and kiosk hardware integrations are not connected in this MVP.</p>
        <Button onClick={() => toast.success("Settings saved (demo)")}>Save changes</Button>
      </div>
    </Panel>
  );
}
