import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
