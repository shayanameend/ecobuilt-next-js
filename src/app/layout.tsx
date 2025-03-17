import type { PropsWithChildren } from "react";

import { RootProvider } from "./_components/root-provider";

import "~/styles/globals.css";

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
