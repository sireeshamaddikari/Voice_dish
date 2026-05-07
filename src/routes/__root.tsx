import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page is off the menu.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something burned in the kitchen</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tandoor.ai — AI Restaurant Ordering: Voice, WhatsApp & Web" },
      { name: "description", content: "Automate restaurant ordering with Voice AI calls, WhatsApp bots, and a beautiful web menu. Real-time kitchen, analytics & payments." },
      { name: "author", content: "Tandoor.ai" },
      { property: "og:title", content: "Tandoor.ai — AI Restaurant Ordering: Voice, WhatsApp & Web" },
      { property: "og:description", content: "Automate restaurant ordering with Voice AI calls, WhatsApp bots, and a beautiful web menu. Real-time kitchen, analytics & payments." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Tandoor.ai — AI Restaurant Ordering: Voice, WhatsApp & Web" },
      { name: "twitter:description", content: "Automate restaurant ordering with Voice AI calls, WhatsApp bots, and a beautiful web menu. Real-time kitchen, analytics & payments." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/325d965f-e013-4552-a5b4-a71ad13bfc48/id-preview-62815ef5--9c6ea3a4-e7bb-480c-9e80-aff68dd56731.lovable.app-1778150005939.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/325d965f-e013-4552-a5b4-a71ad13bfc48/id-preview-62815ef5--9c6ea3a4-e7bb-480c-9e80-aff68dd56731.lovable.app-1778150005939.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
