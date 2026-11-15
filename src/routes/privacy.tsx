import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SmartPrint" },
      { name: "description", content: "How SmartPrint handles your documents and data." },
      { property: "og:title", content: "Privacy Policy — SmartPrint" },
      { property: "og:description", content: "How SmartPrint handles your documents and data." },
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
        <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <div className="mt-8 space-y-5 leading-relaxed text-muted-foreground">
          <p>Documents you upload are used only to fulfil your print job. In this demo, files stay in your browser session and are never sent to a server.</p>
          <p>In production, documents will be deleted automatically after collection or session expiry. We will never sell personal data.</p>
          <p>Contact hello@smartprint.pk with any privacy questions.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
