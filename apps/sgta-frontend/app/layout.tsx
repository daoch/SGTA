import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import { QueryClientProvider } from "@/lib/react-query/query-client-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SGTA",
  description: "Sistema de Gestión de Tesis Académicas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      dir="ltr"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className={"tsqd-parent-container"}>
        <QueryClientProvider>
          <AuthProvider>{children}</AuthProvider>
          <ToastContainer position="bottom-right" autoClose={5000} />
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
