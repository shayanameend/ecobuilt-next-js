import type { FC } from "react";

import Image from "next/image";
import Link from "next/link";

import { LogOutIcon } from "lucide-react";

import { assets } from "~/assets";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

interface Item {
  title: string;
  icon: FC;
  url: string;
}

export function DashboardSidebar({
  items,
}: {
  items: Item[];
}) {
  return (
    <Sidebar>
      <SidebarHeader className={cn("flex items-center justify-center p-6")}>
        <Image
          priority
          src={assets.pictures.app.logo.src}
          alt={assets.pictures.app.logo.alt}
          width={96}
          height={96}
          className={cn("w-24 object-cover")}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Link href={routes.app.public.root.url()}>
          <Button className={cn("w-full")}>
            <LogOutIcon />
            <span>Back</span>
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
