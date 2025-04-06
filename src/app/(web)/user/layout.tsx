"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { PackageIcon, ShoppingCartIcon, UserIcon } from "lucide-react";

import type { PropsWithChildren } from "react";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

export default function UserLayout({ children }: Readonly<PropsWithChildren>) {
  const pathname = usePathname();

  const userNavItems = [
    {
      href: routes.app.user.orders.url(),
      label: routes.app.user.orders.label,
      icon: PackageIcon,
      active: pathname === routes.app.user.orders.url(),
    },
    {
      href: routes.app.user.checkout.url(),
      label: routes.app.user.checkout.label,
      icon: ShoppingCartIcon,
      active: pathname === routes.app.user.checkout.url(),
    },
    {
      href: routes.app.user.settings.url(),
      label: routes.app.user.settings.label,
      icon: UserIcon,
      active: pathname === routes.app.user.settings.url(),
    },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <nav>
          <ul className="flex items-center gap-4">
            {userNavItems.map((item) => (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    "hover:bg-muted",
                    item.active
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-b mt-2" />
      </div>
      {children}
    </>
  );
}
