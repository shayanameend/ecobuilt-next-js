"use client";

import type {
  AdminProfileType,
  AuthType,
  SingleResponseType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import {
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  ShieldIcon,
  TagIcon,
} from "lucide-react";

import { AdminPageLayout } from "~/app/(panels)/_components/admin-page-layout";

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
import { cn } from "~/lib/utils";
import { UpdateAdminProfileForm } from "./_components/update-admin-profile-form";

async function getAdminProfile({ token }: { token: string | null }) {
  const response = await axios.get(routes.api.admin.profile.url(), {
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
      profile: AdminProfileType & {
        auth: AuthType;
      };
    }>
  >({
    queryKey: ["profile"],
    queryFn: () => getAdminProfile({ token }),
  });

  return (
    <AdminPageLayout
      title="Settings"
      description="Manage your account settings, and update profile information."
      isLoading={profileQueryIsLoading}
      isError={profileQueryIsError || !profileQuery?.data?.profile}
      errorTitle="Error Loading Profile"
      errorDescription="We couldn't load your profile information. Please try again later."
      actions={
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
      }
    >
      <div className={cn("flex flex-col lg:flex-row gap-6 items-start")}>
        <Card className={cn("w-full lg:flex-1 min-w-0 self-start")}>
          <CardHeader>
            <CardTitle>
              <h3 className={cn("text-2xl font-bold")}>Update Profile</h3>
            </CardTitle>
            <CardDescription>
              <p className={cn("text-muted-foreground text-sm font-medium")}>
                Update your admin profile information.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpdateAdminProfileForm profile={profileQuery?.data?.profile!} />
          </CardContent>
        </Card>
        <Card className={cn("hidden lg:block lg:flex-1 min-w-0 self-start")}>
          <CardHeader>
            <CardTitle>
              <h3 className={cn("text-2xl font-bold")}>Profile Information</h3>
            </CardTitle>
            <CardDescription>
              <p className={cn("text-muted-foreground text-sm font-medium")}>
                Your admin profile information.
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
                        ? new Date(
                            profileQuery.data.profile.auth.createdAt,
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
      </div>
    </AdminPageLayout>
  );
}
