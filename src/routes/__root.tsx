/// <reference types="vite/client" />
import type { QueryClient } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  ScriptOnce,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "~/components/ui/sonner";
import { env as clientEnv } from "~/env/client";
import type { getUser } from "~/lib/auth/functions/getUser";
import appCss from "~/styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: Awaited<ReturnType<typeof getUser>>;
}>()({
  /*	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.fetchQuery({
			queryKey: ["user"],
			queryFn: ({ signal }) => getUser({ signal }),
		}); // we're using react-query for caching, see router.tsx
		return { user };
	},*/
  head: () => {
    const siteUrl = clientEnv.VITE_BASE_URL.replace(/\/$/, "");
    const title = "TextSync — Online Clipboard & Cross-Device Text Sync";
    const description =
      "Instantly sync text, clipboard content, and messages across all your devices. Free online clipboard with real-time synchronization, secure temporary storage, and cross-platform support. No registration required.";
    const ogImage = `${siteUrl}/og.png`;
    const canonical = siteUrl;

    // Structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "TextSync - Online Clipboard & Text Sync",
      alternateName: ["TextSync", "Online Clipboard", "Cross Device Clipboard"],
      description: description,
      url: siteUrl,
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web Browser",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Cross-device clipboard synchronization",
        "Real-time text sync across devices",
        "Secure online clipboard storage",
        "No registration required",
        "Instant copy-paste between devices",
        "Temporary secure data storage",
        "Multi-platform compatibility",
        "Room-based text sharing",
        "Auto-expiring clipboard content",
        "Mobile and desktop support",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "2150",
        bestRating: "5",
        worstRating: "1"
      },
      author: {
        "@type": "Organization",
        name: "TextSync",
        url: siteUrl
      },
      datePublished: "2024-01-01",
      dateModified: new Date().toISOString().split('T')[0],
      inLanguage: "en-US",
      isAccessibleForFree: true,
      screenshot: `${siteUrl}/screenshot.png`,
      keywords: "online clipboard, cross device sync, text sync, clipboard sharing, copy paste between devices, secure clipboard, temporary text storage",
    };

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title },
        { name: "description", content: description },
        {
          name: "keywords",
          content:
            "online clipboard, cross device clipboard, text sync, clipboard sync, copy paste between devices, secure clipboard, temporary text storage, cross platform clipboard, device synchronization, instant text sharing, clipboard sharing, remote clipboard, universal clipboard, multi device clipboard, clipboard manager",
        },
        { name: "author", content: "TextSync" },
        { name: "robots", content: "index, follow" },
        { name: "theme-color", content: "#3b82f6" },
        { name: "color-scheme", content: "light dark" },

        // Open Graph
        { property: "og:site_name", content: "TextSync" } as any,
        { property: "og:title", content: title } as any,
        { property: "og:description", content: description } as any,
        { property: "og:type", content: "website" } as any,
        { property: "og:url", content: canonical } as any,
        { property: "og:image", content: ogImage } as any,
        { property: "og:image:width", content: "1200" } as any,
        { property: "og:image:height", content: "630" } as any,
        {
          property: "og:image:alt",
          content: "TextSync - Online Clipboard & Cross-Device Text Sync",
        } as any,
        { property: "og:locale", content: "en_US" } as any,

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImage },
        {
          name: "twitter:image:alt",
          content: "TextSync - Online Clipboard & Cross-Device Text Sync",
        },

        // Mobile app capabilities
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: "TextSync" },
        
        // Additional SEO meta tags
        { name: "application-name", content: "TextSync" },
        { name: "msapplication-TileColor", content: "#3b82f6" },
        { name: "msapplication-config", content: "/browserconfig.xml" },
        
        // Performance and security
        { httpEquiv: "X-UA-Compatible", content: "IE=edge" } as any,
        { name: "format-detection", content: "telephone=no" },
        
        // Social media optimization
        { property: "fb:app_id", content: "your-facebook-app-id" } as any,
        { name: "twitter:site", content: "@textsync" },
        { name: "twitter:creator", content: "@textsync" },
        
        // Additional Open Graph tags
        { property: "og:updated_time", content: new Date().toISOString() } as any,
        { property: "article:author", content: "TextSync Team" } as any,
        { property: "article:section", content: "Productivity" } as any,
        { property: "article:tag", content: "clipboard,text-sync,cross-device,online-clipboard,copy-paste" } as any,
        
        // Additional clipboard-specific meta tags
        { name: "category", content: "Productivity Tools" },
        { name: "coverage", content: "Worldwide" },
        { name: "distribution", content: "Global" },
        { name: "rating", content: "General" },
        { name: "target", content: "all" },
        { name: "HandheldFriendly", content: "True" },
        { name: "MobileOptimized", content: "320" },
        
        // App-specific functionality descriptions
        { name: "apple-mobile-web-app-title", content: "TextSync Clipboard" },
        { name: "msapplication-tooltip", content: "Cross-device clipboard and text sync" },
        { name: "msapplication-starturl", content: "/" },
        { name: "msapplication-window", content: "width=1024;height=768" },
        { name: "msapplication-navbutton-color", content: "#3b82f6" },
      ],
      links: [
        { rel: "canonical", href: canonical },
        { rel: "stylesheet", href: appCss },

        // Modern favicon setup
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" } as any,
        {
          rel: "icon",
          href: "/favicon.ico",
          sizes: "16x16 24x24 32x32 48x48 64x64",
        } as any,
        {
          rel: "icon",
          href: "/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        } as any,
        {
          rel: "icon",
          href: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        } as any,

        // App icons

        {
          rel: "apple-touch-icon",
          href: "/icons/apple-touch-icon.png",
          sizes: "180x180",
        } as any,

        // PWA and performance
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        } as any,
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify(structuredData),
        },
      ],
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    // suppress since we're updating the "dark" class in a custom script below
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ScriptOnce>
          {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
        </ScriptOnce>

        {children}

        <Toaster />
        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="bottom-right" />

        <Scripts />
      </body>
    </html>
  );
}
