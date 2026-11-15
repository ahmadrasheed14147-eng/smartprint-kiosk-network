import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SmartPrint — SmartPrint" },
      { name: "description", content: "SmartPrint is building a network of self-service printing kiosks across Pakistan." },
      { property: "og:title", content: "About SmartPrint — SmartPrint" },
      { property: "og:description", content: "SmartPrint is building a network of self-service printing kiosks across Pakistan." },
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
        <h1 className="text-4xl font-extrabold tracking-tight">About SmartPrint</h1>
        <div className="mt-8 space-y-5 leading-relaxed text-muted-foreground">
          <p>SmartPrint is a Pakistani technology startup building self-service printing infrastructure for universities, libraries and public spaces.</p>
          <p>Students and citizens still queue at photocopy shops for simple prints. We replace that with a software platform: upload from your phone, pay digitally and collect from an automated kiosk.</p>
          <p>This website is an MVP demonstration. Payments, SMS and kiosk hardware are simulated while we work with hardware and payment partners.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
