"use client";

import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

import { MenuIcon } from "lucide-react";

import { assets } from "~/assets";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { Role } from "~/lib/types";
import { cn } from "~/lib/utils";
import { RootHeaderCartButton } from "./root-header-cart-button";

const navLinks = [
  {
    label: routes.app.public.home.label,
    url: routes.app.public.home.url(),
  },
  {
    label: routes.app.public.products.label,
    url: routes.app.public.products.url(),
  },
  {
    label: routes.app.public.vendors.label,
    url: routes.app.public.vendors.url(),
  },
  {
    label: routes.app.public.community.label,
    url: routes.app.public.community.url(),
  },
  {
    label: routes.app.public.contact.label,
    url: routes.app.public.contact.url(),
  },
];

export function RootHeader() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    setIsSheetOpen(false);
  }, [searchParams, pathname, params]);

  return (
    <header
      className={cn(
        "flex flex-row items-center justify-between gap-6 py-2 px-4 mx-auto max-w-7xl",
      )}
    >
      <Image
        priority
        src={assets.pictures.app.logo.src}
        alt={assets.pictures.app.logo.alt}
        sizes="(max-width: 768px) 56px, 72px"
        className={cn("mt-1 ml-1 w-14 md:w-18 object-cover")}
      />
      <nav>
        <ul className={cn("hidden md:flex gap-4")}>
          {navLinks.map(({ url, label }) => (
            <li key={url}>
              <Button
                variant={
                  pathname === url ||
                  (pathname.startsWith(url) &&
                    url !== routes.app.public.home.url())
                    ? "secondary"
                    : "ghost"
                }
                size="sm"
                onClick={() => {
                  router.push(url);
                }}
              >
                {label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className={cn("flex flex-row items-center gap-4")}>
        <RootHeaderCartButton />
        <RootHeaderCTAButton className={cn("hidden md:inline-flex")} />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild className={cn("md:hidden")}>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className={cn("w-full md:w-96")}>
            <SheetHeader>
              <SheetTitle className={cn("pt-8")}>
                <Input
                  placeholder="Search for porducts..."
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      if (event.currentTarget.value) {
                        router.push(
                          `${routes.app.public.products.url()}/?name=${
                            event.currentTarget.value
                          }`,
                        );
                      } else {
                        router.push(routes.app.public.products.url());
                      }
                    }
                  }}
                />
              </SheetTitle>
              <SheetDescription />
            </SheetHeader>
            <nav className={cn("px-4")}>
              <ul className={cn("flex flex-col gap-1")}>
                {navLinks.map(({ url, label }) => (
                  <li key={url}>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        router.push(url);
                      }}
                      className={cn("text-foreground/65 text-lg")}
                    >
                      {label}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
            <SheetFooter>
              <RootHeaderCTAButton />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function RootHeaderCTAButton({ className }: { className?: string }) {
  const router = useRouter();

  const { auth } = useAuthContext();

  if (auth) {
    return (
      <Button
        variant="default"
        size="lg"
        className={className}
        onClick={() => {
          let url: string;

          switch (auth.role) {
            case Role.SUPER_ADMIN:
            case Role.ADMIN:
              url = routes.app.admin.dashboard.url();
              break;
            case Role.VENDOR:
              url = routes.app.vendor.dashboard.url();
              break;
            case Role.USER:
              url = routes.app.user.settings.url();
              break;
            default:
              url = routes.app.unspecified.profile.url();
              break;
          }

          router.push(url);
        }}
      >
        Dashboard
      </Button>
    );
  }

  return (
    <Button
      variant="default"
      size="lg"
      className={className}
      onClick={() => {
        router.push(routes.app.auth.signIn.url());
      }}
    >
      Sign In
    </Button>
  );
}
