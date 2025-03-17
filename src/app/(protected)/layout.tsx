import type { PropsWithChildren } from "react";

import { SidebarProvider } from "~/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <>
      <SidebarProvider>{children}</SidebarProvider>
    </>
  );
}
