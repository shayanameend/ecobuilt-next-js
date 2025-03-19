"use client";

import type {
  AuthType,
  SingleResponseType,
  VendorProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";

import { AlertCircle, Loader2Icon, Upload } from "lucide-react";
import { Button } from "~/components/ui/button";

import { UpdateVendorProfileForm } from "~/app/(protected)/vendor/settings/_components/update-vendor-profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useAuthContext } from "~/context/auth";
import { domine } from "~/lib/fonts";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

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

        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load profile information. Please try again later.
            </AlertDescription>
          </Alert>
        )}

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
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2Icon
                    className={cn("size-8 text-primary animate-spin")}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
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
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    {data?.data?.profile?.auth?.email ?? ""}
                  </p>
                  <p
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    {data?.data?.profile?.description ?? ""}
                  </p>
                  <p
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    Phone: {data?.data?.profile?.phone ?? "N/A"}
                  </p>
                  <p
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    Address: {data?.data?.profile?.pickupAddress ?? "N/A"}
                  </p>
                  <p
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    Postal Code: {data?.data?.profile?.postalCode ?? "N/A"}
                  </p>
                  <p
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    City: {data?.data?.profile?.city ?? "N/A"}
                  </p>
                  <p
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    Status: {data?.data?.profile?.auth?.status ?? "N/A"}
                  </p>
                  <p
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    Role: {data?.data?.profile?.auth?.role ?? "N/A"}
                  </p>
                  <p
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    Verified:{" "}
                    {data?.data?.profile?.auth?.isVerified ? "Yes" : "No"}
                  </p>
                  <p
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    Deleted:{" "}
                    {data?.data?.profile?.auth?.isDeleted ? "Yes" : "No"}
                  </p>
                  <p
                    className={cn("text-muted-foreground text-center text-sm")}
                  >
                    Created At:{" "}
                    {data?.data?.profile?.auth?.createdAt
                      ? new Date(
                          data.data.profile.auth.createdAt,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              )}
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
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2Icon
                    className={cn("size-8 text-primary animate-spin")}
                  />
                </div>
              ) : (
                <UpdateVendorProfileForm profile={data?.data?.profile} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
