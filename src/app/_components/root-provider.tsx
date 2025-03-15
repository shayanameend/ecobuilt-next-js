"use client";

import type { PropsWithChildren } from "react";

import { Suspense } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Loader2Icon } from "lucide-react";

import { Toaster } from "~/components/ui/sonner";
import { AuthProvider } from "~/context/auth";
import { cn } from "~/lib/utils";

const queryClient = new QueryClient();

export function RootProvider({ children }: Readonly<PropsWithChildren>) {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className={cn("flex items-center justify-center min-h-svh")}>
            <Loader2Icon className={cn("size-8 text-primary animate-spin")} />
          </div>
        }
      >
        <AuthProvider>{children}</AuthProvider>
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}
