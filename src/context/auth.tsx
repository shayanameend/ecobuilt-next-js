"use client";

import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
import type { AuthType } from "~/lib/types";

import { createContext, useContext, useEffect, useState } from "react";

import { useMutation } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";

import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

const AuthContext = createContext<{
  isLoading: boolean;
  auth: AuthType | null;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setAuth: Dispatch<SetStateAction<AuthType | null>>;
}>({
  isLoading: true,
  auth: null,
  setIsLoading: () => {},
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
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState<AuthType | null>(null);

  const refreshMutation = useMutation({
    mutationFn: refresh,
    onSuccess: ({ data }) => {
      setAuth(data.user);

      localStorage.setItem("token", data.token);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }

      setAuth(null);

      sessionStorage.removeItem("token");
      localStorage.removeItem("token");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      refreshMutation.mutate();
    } else {
      setIsLoading(false);
    }
  }, [refreshMutation.mutate]);

  if (!isLoading) {
    return (
      <AuthContext.Provider
        value={{
          isLoading,
          auth,
          setIsLoading,
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
