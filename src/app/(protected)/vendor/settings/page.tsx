"use client";

import type {
  AuthType,
  SingleResponseType,
  VendorProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { Calendar, Mail, MapPin, Phone, Shield, Tag } from "lucide-react";

import { UpdateVendorProfileForm } from "~/app/(protected)/vendor/settings/_components/update-vendor-profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useAuthContext } from "~/context/auth";
import { domine } from "~/lib/fonts";
import { routes } from "~/lib/routes";
import { UserStatus } from "~/lib/types";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";

async function getVendorProfile({
  token,
}: {
  token: string | null;
}) {
  const response = await axios.get(routes.api.vendor.profile.url(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function SettingsPage() {
  const { token, setToken, setAuth } = useAuthContext();

  const { data, isLoading, isError } = useQuery<
    SingleResponseType<{
      profile: VendorProfileType & {
        auth: AuthType;
      };
    }>
  >({
    queryKey: ["profile"],
    queryFn: () => getVendorProfile({ token }),
  });

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
          <Card className={cn("hidden lg:flex")}>
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
            <CardContent>
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className={cn("size-32 border-2 border-primary/20")}>
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_FILE_URL}/${data?.data?.profile?.pictureId}`}
                      alt={data?.data?.profile?.name ?? "JD"}
                      width={128}
                      height={128}
                      className={cn("object-cover")}
                    />
                    <AvatarFallback>
                      {data?.data?.profile?.name
                        ? data.data.profile.name
                            .split(" ")
                            .map((part) => part.charAt(0).toUpperCase())
                            .join("")
                        : "JD"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className={cn("text-center text-xl font-semibold")}>
                    {data?.data?.profile?.name ?? ""}
                  </h3>
                  <p
                    className={cn(
                      "text-muted-foreground text-center text-sm max-w-md",
                    )}
                  >
                    {data?.data?.profile?.description ??
                      "No description provided"}
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-base font-semibold">Contact Details</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span className="text-muted-foreground">
                        {data?.data?.profile?.auth?.email ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span className="text-muted-foreground">
                        {data?.data?.profile?.phone ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="size-4 text-muted-foreground mt-0.5" />
                      <span className="font-medium">Location:</span>
                      <span className="text-muted-foreground">
                        {[
                          data?.data?.profile?.pickupAddress,
                          data?.data?.profile?.city,
                          data?.data?.profile?.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <h4 className="text-base font-semibold">Account Status</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <Tag className="size-4 text-muted-foreground" />
                      <span className="font-medium">Role:</span>
                      <Badge variant="outline">
                        {data?.data?.profile?.auth?.role ?? "N/A"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="size-4 text-muted-foreground" />
                      <span className="font-medium">Status:</span>
                      <Badge
                        variant={
                          data?.data?.profile?.auth?.status ===
                          UserStatus.APPROVED
                            ? "default"
                            : "outline"
                        }
                      >
                        {data?.data?.profile?.auth?.status ?? "N/A"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="font-medium">Created:</span>
                      <span className="text-muted-foreground">
                        {data?.data?.profile?.auth?.createdAt
                          ? new Date(
                              data.data.profile.auth.createdAt,
                            ).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Update Profile
                </h3>
              </CardTitle>
              <CardDescription>
                <p className={cn("text-muted-foreground text-sm font-medium")}>
                  Update your vendor profile information.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateVendorProfileForm profile={data?.data?.profile} />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
