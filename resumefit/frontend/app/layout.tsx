import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = { title: "ResumeFit", description: "Evidence-based resume evaluation" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><Nav /><main className="mx-auto max-w-6xl px-6 py-10">{children}</main></body></html>;
}
