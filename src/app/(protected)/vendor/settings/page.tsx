"use client";

import type {
  AuthType,
  SingleResponseType,
  VendorProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";

import { AlertCircle, Loader2Icon } from "lucide-react";
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
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2Icon
                    className={cn("size-8 text-primary animate-spin")}
                  />
                </div>
              ) : (
                <></>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
