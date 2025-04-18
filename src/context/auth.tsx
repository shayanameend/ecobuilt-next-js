"use client";

import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import { type AuthType, Role, UserStatus } from "~/lib/types";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";

import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import {
  adminRoutes,
  authRoutes,
  publicRoutes,
  routes,
  userRoutes,
  vendorRoutes,
} from "~/lib/routes";
import { cn } from "~/lib/utils";

const AuthContext = createContext<{
  isLoading: boolean;
  token: string | null;
  auth: AuthType | null;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setToken: Dispatch<SetStateAction<string | null>>;
  setAuth: Dispatch<SetStateAction<AuthType | null>>;
}>({
  isLoading: true,
  token: null,
  auth: null,
  setIsLoading: () => {},
  setToken: () => {},
  setAuth: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

async function refresh() {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    routes.api.auth.refresh.url(),
    {},
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export function AuthProvider({ children }: Readonly<PropsWithChildren>) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [auth, setAuth] = useState<AuthType | null>(null);

  const refreshMutation = useMutation({
    mutationFn: refresh,
    onSuccess: ({ data }) => {
      setToken(data.token);
      setAuth(data.user);

      localStorage.setItem("token", data.token);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }

      setToken(null);
      setAuth(null);

      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const localToken = localStorage.getItem("token");

    if (localToken) {
      refreshMutation.mutate();
    } else {
      setIsLoading(false);
    }
  }, [refreshMutation.mutate]);

  useEffect(() => {
    const localToken = localStorage.getItem("token");

    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.some(
      (route) =>
        pathname === route ||
        (pathname.startsWith(route) && route !== routes.app.public.home.url()),
    );
    const isProfileRoute = pathname.startsWith(
      routes.app.unspecified.profile.url(),
    );
    const isAdminRoute = adminRoutes.some((route) =>
      pathname.startsWith(route),
    );
    const isVendorRoute = vendorRoutes.some((route) =>
      pathname.startsWith(route),
    );
    const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));

    console.log({
      isLoading,
      auth,
      pathname,
      isAuthRoute,
      isPublicRoute,
      isProfileRoute,
      isAdminRoute,
      isVendorRoute,
      isUserRoute,
    });

    if (!localToken && isPublicRoute) {
      return;
    }

    if (!localToken && !isAuthRoute) {
      return router.push(routes.app.auth.signIn.url());
    }

    if (!isLoading && auth) {
      if (isAuthRoute) {
        let url: string;

        switch (auth.role) {
          case Role.SUPER_ADMIN:
          case Role.ADMIN:
            url = routes.app.admin.dashboard.url();
            break;
          case Role.VENDOR:
            url = routes.app.vendor.dashboard.url();
            break;
          case Role.USER:
            url = routes.app.user.settings.url();
            break;
          default:
            url = routes.app.unspecified.profile.url();
            break;
        }

        return router.push(url);
      }

      if (!isProfileRoute && auth.role === Role.UNSPECIFIED) {
        return router.push(routes.app.unspecified.profile.url());
      }

      if (isProfileRoute && auth.role !== Role.UNSPECIFIED) {
        let url: string;

        switch (auth.role) {
          case Role.SUPER_ADMIN:
          case Role.ADMIN:
            url = routes.app.admin.dashboard.url();
            break;
          case Role.VENDOR:
            url = routes.app.vendor.dashboard.url();
            break;
          case Role.USER:
            url = routes.app.user.settings.url();
            break;
          default:
            url = routes.app.unspecified.profile.url();
            break;
        }

        return router.push(url);
      }

      if (!isPublicRoute && auth.status !== UserStatus.APPROVED) {
        return router.push(routes.app.unspecified.status.url());
      }

      if (!isPublicRoute && auth.isDeleted) {
        return router.push(routes.app.unspecified.status.url());
      }

      if (
        pathname === routes.app.unspecified.status.url() &&
        auth.status === UserStatus.APPROVED &&
        !auth.isDeleted
      ) {
        return router.push(routes.app.public.home.url());
      }

      if (
        isAdminRoute &&
        auth.role !== Role.SUPER_ADMIN &&
        auth.role !== Role.ADMIN
      ) {
        return router.push(routes.app.public.home.url());
      }

      if (isVendorRoute && auth.role !== Role.VENDOR) {
        return router.push(routes.app.public.home.url());
      }

      if (isUserRoute && auth.role !== Role.USER) {
        return router.push(routes.app.public.home.url());
      }
    }
  }, [pathname, router.push, isLoading, auth]);

  if (!isLoading) {
    return (
      <AuthContext.Provider
        value={{
          isLoading,
          token,
          auth,
          setIsLoading,
          setToken,
          setAuth,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <div className={cn("flex items-center justify-center min-h-svh")}>
      <Loader2Icon className={cn("size-8 text-primary animate-spin")} />
    </div>
  );
}
