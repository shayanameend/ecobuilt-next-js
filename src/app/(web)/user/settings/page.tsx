"use client";

import type {
  AuthType,
  SingleResponseType,
  UserProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import {
  AlertCircleIcon,
  CalendarIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldIcon,
  TagIcon,
} from "lucide-react";

import { EmptyState } from "~/app/_components/empty-state";

import { UpdateVendorProfileForm } from "~/app/(web)/user/settings/_components/update-vendor-profile-form";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
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

import { routes } from "~/lib/routes";
import { UserStatus } from "~/lib/types";
import { cn, formatDate } from "~/lib/utils";

async function getVendorProfile({ token }: { token: string | null }) {
  const response = await axios.get(routes.api.user.profile.url(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function SettingsPage() {
  const { token, setToken, setAuth } = useAuthContext();

  const {
    data: profileQuery,
    isLoading: profileQueryIsLoading,
    isError: profileQueryIsError,
  } = useQuery<
    SingleResponseType<{
      profile: UserProfileType & {
        auth: AuthType;
      };
    }>
  >({
    queryKey: ["profile"],
    queryFn: () => getVendorProfile({ token }),
  });

  if (profileQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (profileQueryIsError || !profileQuery?.data?.profile) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={AlertCircleIcon}
          title="Error Loading Profile"
          description="We couldn't load your profile information. Please try again later."
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
          }}
          className="w-full max-w-md"
        />
      </section>
    );
  }

  return (
    <>
      <section className={cn("flex-1 space-y-8 py-8 px-4 max-w-7xl mx-auto")}>
        <div className={cn("flex items-center justify-between gap-6")}>
          <div className={cn("space-y-2")}>
            <h2 className={cn("text-black/75 text-3xl font-bold")}>Settings</h2>
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
        <div className={cn("flex flex-col lg:flex-row gap-6 items-start")}>
          <Card className={cn("w-full lg:flex-1 min-w-0 self-start")}>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold")}>Update Profile</h3>
              </CardTitle>
              <CardDescription>
                <p className={cn("text-muted-foreground text-sm font-medium")}>
                  Update your profile information.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateVendorProfileForm profile={profileQuery?.data?.profile!} />
            </CardContent>
          </Card>
          <Card className={cn("hidden lg:block lg:flex-1 min-w-0 self-start")}>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold")}>
                  Profile Information
                </h3>
              </CardTitle>
              <CardDescription>
                <p className={cn("text-muted-foreground text-sm font-medium")}>
                  Your profile information.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className={cn("size-32 border-2 border-primary/20")}>
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_FILE_URL}/${profileQuery?.data?.profile?.pictureId}`}
                      alt={profileQuery?.data?.profile?.name ?? "JD"}
                      width={128}
                      height={128}
                      className={cn("object-cover")}
                    />
                    <AvatarFallback>
                      {profileQuery?.data?.profile?.name
                        ? profileQuery.data.profile.name
                            .split(" ")
                            .map((part) => part.charAt(0).toUpperCase())
                            .join("")
                        : "JD"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className={cn("text-center text-xl font-semibold")}>
                    {profileQuery?.data?.profile?.name ?? ""}
                  </h3>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-base font-semibold">Contact Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MailIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium">Email:</span>
                      <span className="text-muted-foreground">
                        {profileQuery?.data?.profile?.auth?.email ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium">Phone:</span>
                      <span className="text-muted-foreground">
                        {profileQuery?.data?.profile?.phone ?? "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="size-4 text-muted-foreground mt-0.5" />
                      <span className="font-medium">Location:</span>
                      <span className="text-muted-foreground">
                        {[
                          profileQuery?.data?.profile?.deliveryAddress,
                          profileQuery?.data?.profile?.city,
                          profileQuery?.data?.profile?.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="text-base font-semibold">Account Details</h4>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <ShieldIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium">Status:</span>
                      <Badge
                        variant={
                          profileQuery?.data?.profile?.auth?.status ===
                          UserStatus.APPROVED
                            ? "default"
                            : "outline"
                        }
                      >
                        {profileQuery?.data?.profile?.auth?.status ?? "N/A"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TagIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium">Role:</span>
                      <Badge variant="outline">
                        {profileQuery?.data?.profile?.auth?.role ?? "N/A"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium">Registered:</span>
                      <span className="text-muted-foreground">
                        {profileQuery?.data?.profile?.auth?.createdAt
                          ? formatDate(
                              profileQuery.data.profile.auth.createdAt,
                              "MMMM d, yyyy",
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
