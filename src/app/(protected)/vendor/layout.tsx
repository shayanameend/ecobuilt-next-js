import type { PropsWithChildren } from "react";
import { cn } from "~/lib/utils";

export default function DashbaordLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <main
      className={cn(
        "py-7 px-7 min-h-[calc(100svh_-_5rem)] md:min-h-[calc(100svh_-_6rem)]",
      )}
    >
      {children}
    </main>
  );
}
