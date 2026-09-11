import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import SiteEffects from "../components/SiteEffects";
import { currentUser } from "../lib/auth";

export const metadata: Metadata = {
  title: "Mading SMK N 1 Dukuhturi",
  description:
    "Smezine — wadah literasi, jurnalistik, dan kreativitas digital siswa Ekstrakurikuler Mading SMK N 1 Dukuhturi.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* pasang tema duluan biar gak kedip */}
        <Script id="smezine-theme" strategy="beforeInteractive">
          {`try{document.documentElement.dataset.theme=localStorage.getItem('smezine-theme')||'dark'}catch(e){document.documentElement.dataset.theme='dark'}`}
        </Script>
        <Navbar isAdmin={!!user} />
        <ThemeToggle />
        {children}
        <Footer />
        <SiteEffects />
      </body>
    </html>
  );
}
