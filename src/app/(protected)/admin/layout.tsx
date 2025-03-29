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
import { useAuthContext } from "~/context/auth";

const items = [
  {
    title: routes.app.admin.dashboard.label,
    icon: LayoutDashboardIcon,
    url: routes.app.admin.dashboard.url(),
  },
  {
    title: routes.app.admin.categories.label,
    icon: FolderTreeIcon,
    url: routes.app.admin.categories.url(),
  },
  {
    title: routes.app.admin.products.label,
    icon: PackageIcon,
    url: routes.app.admin.products.url(),
  },
  {
    title: routes.app.admin.orders.label,
    icon: ShoppingCartIcon,
    url: routes.app.admin.orders.url(),
  },
  {
    title: routes.app.admin.users.label,
    icon: UsersIcon,
    url: routes.app.admin.users.url(),
  },
  {
    title: routes.app.admin.vendors.label,
    icon: UsersIcon,
    url: routes.app.admin.vendors.url(),
  },
  {
    title: routes.app.admin.settings.label,
    icon: SettingsIcon,
    url: routes.app.admin.settings.url(),
  },
];

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  const { auth } = useAuthContext();

  if (
    auth?.role === "SUPER_ADMIN" &&
    !items.find((item) => item.title === routes.app.superAdmin.admins.label)
  ) {
    const vendorIndex = items.findIndex(
      (item) => item.title === routes.app.admin.vendors.label,
    );
    items.splice(vendorIndex + 1, 0, {
      title: routes.app.superAdmin.admins.label,
      icon: UsersIcon,
      url: routes.app.superAdmin.admins.url(),
    });
  }
  return (
    <main className={cn("py-7 px-7 min-h-svh w-full flex")}>
      <DashboardSidebar items={items} />
      {children}
    </main>
  );
}
