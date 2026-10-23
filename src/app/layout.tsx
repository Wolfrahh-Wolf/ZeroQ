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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
