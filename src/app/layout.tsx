import type { PropsWithChildren } from "react";

import Script from "next/script";

import { RootProvider } from "./_components/root-provider";

import "~/styles/globals.css";

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>
        <RootProvider>{children}</RootProvider>
        <Script
          src="//code.tidio.co/kqf9guvqo5gtjv8urt7mcen7j2hqtcmc.js"
          strategy="afterInteractive" // Or "lazyOnload"
          async
        />
      </body>
    </html>
  );
}
