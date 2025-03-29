import type { PropsWithChildren } from "react";

import { RootHeader } from "../_components/root-header";

export default function PublicLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <RootHeader />
      {children}
    </>
  );
}
