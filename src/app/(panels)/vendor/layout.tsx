"use client";

import type { PropsWithChildren } from "react";

import {
  FolderTreeIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { DashboardSidebar } from "../_components/dasboard-sidebar";

const items = [
  {
    title: routes.app.vendor.dashboard.label,
    icon: LayoutDashboardIcon,
    url: routes.app.vendor.dashboard.url(),
  },
  {
    title: routes.app.vendor.categories.label,
    icon: FolderTreeIcon,
    url: routes.app.vendor.categories.url(),
  },
  {
    title: routes.app.vendor.products.label,
    icon: PackageIcon,
    url: routes.app.vendor.products.url(),
  },
  {
    title: routes.app.vendor.orders.label,
    icon: ShoppingCartIcon,
    url: routes.app.vendor.orders.url(),
  },
  {
    title: routes.app.vendor.users.label,
    icon: UsersIcon,
    url: routes.app.vendor.users.url(),
  },
  {
    title: routes.app.vendor.settings.label,
    icon: SettingsIcon,
    url: routes.app.vendor.settings.url(),
  },
];

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <main className={cn("py-7 px-7 min-h-svh w-full flex")}>
      <DashboardSidebar items={items} />
      {children}
    </main>
  );
}
