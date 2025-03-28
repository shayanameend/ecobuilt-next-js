import type { PropsWithChildren } from 'react';

import {
  FolderTreeIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from 'lucide-react';

import { routes } from '~/lib/routes';
import { cn } from '~/lib/utils';
import { DashboardSidebar } from '../_components/dasboard-sidebar';

const items = [
  {
    title: routes.app.admin.root.label,
    icon: LayoutDashboardIcon,
    url: routes.app.admin.root.url(),
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
    title: routes.app.admin.settings.label,
    icon: SettingsIcon,
    url: routes.app.admin.settings.url(),
  },
];

export default function DashboardLayout({
  children,
}: Readonly<PropsWithChildren>) {
  return (
    <main className={cn('py-7 px-7 min-h-svh w-full flex')}>
      <DashboardSidebar items={items} />
      {children}
    </main>
  );
}
