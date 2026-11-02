import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '600'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: "Marginalia",
  description: "Ask questions about your PDFs, get answers grounded in citations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
