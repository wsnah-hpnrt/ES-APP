import type { Metadata } from "next";

import "@/styles/globals.css";
import ActivityTracker from "@/components/ActivityTracker";

export const metadata: Metadata = {
  title: { template: "HPNRT ES-APP | %s", default: "HPNRT ES-APP" },
  description: "HPNRT ES-APP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ActivityTracker />
        {children}
      </body>
    </html>
  );
}
