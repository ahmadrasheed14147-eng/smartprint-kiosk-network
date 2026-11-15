import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SmartPrint" },
      { name: "description", content: "Terms for using the SmartPrint platform." },
      { property: "og:title", content: "Terms of Service — SmartPrint" },
      { property: "og:description", content: "Terms for using the SmartPrint platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="text-4xl font-extrabold tracking-tight">Terms of Service</h1>
        <div className="mt-8 space-y-5 leading-relaxed text-muted-foreground">
          <p>SmartPrint is currently an MVP demo. No real payments are taken and no physical prints are produced.</p>
          <p>Users are responsible for the content they print and must not print material that is unlawful or infringes copyright.</p>
          <p>Sample prices shown are illustrative and may change before launch.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
