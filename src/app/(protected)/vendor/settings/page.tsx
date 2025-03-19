"use client";

import {
  FilterIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";

import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";
import { useAuthContext } from "~/context/auth";

export default function ProductsPage() {
  const { setToken, setAuth } = useAuthContext();

  return (
    <>
      <section className={cn("flex-1 space-y-8")}>
        <div className={cn("flex items-center justify-between gap-6")}>
          <div className={cn("space-y-2")}>
            <h2
              className={cn(
                "text-black/75 text-3xl font-bold",
                domine.className,
              )}
            >
              Settings
            </h2>
            <p className={cn("text-muted-foreground text-base font-medium")}>
              Manage your account settings, and update profile information.
            </p>
          </div>
          <div>
            <Button
              variant="destructive"
              size="default"
              onClick={() => {
                setToken(null);
                setAuth(null);

                sessionStorage.removeItem("token");
                localStorage.removeItem("token");
              }}
            >
              <span>Log Out</span>
            </Button>
          </div>
        </div>
        <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-2")}>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Vendor Profile
                </h3>
              </CardTitle>
              <CardDescription>
                <p className={cn("text-muted-foreground text-sm font-medium")}>
                  Update your vendor profile information.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Profile Information
                </h3>
              </CardTitle>
              <CardDescription>
                <p className={cn("text-muted-foreground text-sm font-medium")}>
                  Your vendor profile information.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
