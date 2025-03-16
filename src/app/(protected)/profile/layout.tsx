import type { PropsWithChildren } from "react";

import { googleMap } from "~/lib/config";
import { cn } from "~/lib/utils";

export default function ProfileLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <main>
      <section
        className={cn(
          "py-14 px-7 md:px-24 min-h-[calc(100svh_-_5rem)] md:min-h-[calc(100svh_-_6rem)] flex gap-12 justify-center",
        )}
      >
        {children}
        <div
          className={cn(
            "hidden md:block flex-1 lg:flex-[2] rounded-lg overflow-hidden",
          )}
        >
          <iframe
            title={googleMap.title}
            width="100%"
            height="100%"
            loading="eager"
            allowFullScreen
            src={googleMap.src}
          />
        </div>
      </section>
    </main>
  );
}
