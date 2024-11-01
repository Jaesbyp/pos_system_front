import "./globals.css";
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { Inter } from "next/font/google";

import Toaster from "./Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pos System",
  description: "A pos system for general stores",
  icon: "/favicon.ico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
