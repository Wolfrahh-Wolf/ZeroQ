import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "ZeroQ — Campus Pre-Ordering Portal",
    template: "%s | ZeroQ",
  },
  description:
    "ZeroQ converts waiting time into travel time. Pre-order your campus canteen meals during transit and skip the queue entirely.",
  keywords: ["campus canteen", "pre-order", "food ordering", "college", "ZeroQ"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
};

// Inline script content to apply theme before hydration (prevents flash)
const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('zeroq-theme');
    if (stored === 'light') { document.documentElement.classList.remove('dark'); return; }
    if (stored === 'dark') { document.documentElement.classList.add('dark'); return; }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.classList.remove('dark');
      return;
    }
    document.documentElement.classList.add('dark');
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking script: apply theme before React hydrates to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="bg-fluent-neutral-bg-2 dark:bg-[#1a1a1a] text-fluent-text-primary">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
