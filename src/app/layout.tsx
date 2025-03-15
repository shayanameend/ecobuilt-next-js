import type { PropsWithChildren } from "react";

import { RootHeader } from "./_components/root-header";
import { RootProvider } from "./_components/root-provider";

import "~/styles/globals.css";

export default async function RootLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          <RootHeader />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
