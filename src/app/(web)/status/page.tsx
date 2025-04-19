"use client";

import { CalendarIcon, MailsIcon, ShieldIcon, TagIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useAuthContext } from "~/context/auth";
import { domine } from "~/lib/fonts";
import { routes } from "~/lib/routes";
import { UserStatus } from "~/lib/types";
import { cn, formatDate } from "~/lib/utils";

export default function ContactPage() {
  const { auth, setAuth, setToken } = useAuthContext();

  return (
    <div className={cn("flex-1 self-center space-y-8 md:p-4")}>
      <div className={cn("space-y-2 text-center")}>
        <h2
          className={cn("text-black/75 text-3xl font-bold", domine.className)}
        >
          Your Status
        </h2>
        <p className={"text-muted-foreground text-base font-medium"}>
          Interested in checking your status or learning more? Contact EcoBuilt
          Connect today!
        </p>
      </div>
      <Card className={cn("hidden lg:block lg:flex-1 min-w-0 self-start")}>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold">Status Details</h4>
                <Button
                  variant="destructive"
                  size="sm"
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
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <MailsIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">Email:</span>
                  <span className="text-muted-foreground">
                    {auth?.email ?? "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">Status:</span>
                  <Badge
                    variant={
                      auth?.status === UserStatus.APPROVED && !auth?.isDeleted
                        ? "outline"
                        : auth?.status === UserStatus.REJECTED ||
                            auth?.isDeleted
                          ? "destructive"
                          : "default"
                    }
                  >
                    {((auth?.isDeleted && "REJECTED") || auth?.status) ?? "N/A"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TagIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">Role:</span>
                  <Badge variant="outline">{auth?.role ?? "N/A"}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">Registered:</span>
                  <span className="text-muted-foreground">
                    {auth?.createdAt
                      ? formatDate(auth.createdAt, "MMMM d, yyyy")
                      : "N/A"}
                  </span>
                </div>
                <Link
                  href={routes.app.public.contact.url()}
                  className={cn(buttonVariants({ variant: "default" }), "mt-4")}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
