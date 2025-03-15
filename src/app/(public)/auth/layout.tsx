import type { PropsWithChildren } from "react";

import { googleMap } from "~/lib/constants";
import { cn } from "~/lib/utils";

export default function AuthLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <main>
      <section
        className={cn(
          // "p-14 md:px-24 min-h-[calc(100svh_-_7rem)] flex gap-12 justify-center bg-black",
        )}
      >
        {children}
        {/* <div
          className={cn(
            // "hidden md:block flex-1 lg:flex-[2] my-4 mx-2 rounded-lg overflow-hidden",
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
        </div> */}
      </section>
    </main>
  );
}
