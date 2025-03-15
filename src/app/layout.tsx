import type { PropsWithChildren } from "react";

import "~/styles/globals.css";
import { RootHeader } from "./_components/root-header";

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body>
        <RootHeader />
        {children}
      </body>
    </html>
  );
}
