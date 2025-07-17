import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { Providers } from "@/providers";
import { AlertRenderer } from "@/components/core/alert";
import { createMetadata } from "@/utils/meta";
import "@/styles/main.scss";
import "@/styles/layout/index.scss";
import Script from "next/script";
import { headers } from 'next/headers';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";


const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  display: "swap",
});


const montserrat = Montserrat({
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = createMetadata({
  metaTitle: "Home Page",
  metaDescription: "",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers())?.get('x-nonce') ?? '';

  return (
    <html lang="en" data-template="design-system-documentation">
      <head>
        <Script
          nonce={nonce}
          id="inline-secure"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `console.log("Secure script running with nonce");`
          }}
        />
      </head>
      <body className={montserrat.className}>
        <Providers>
          <Header />
          <main >
            {children}
          </main>
          <Footer />
          <AlertRenderer />
        </Providers>
      </body>
    </html>
  );
}
