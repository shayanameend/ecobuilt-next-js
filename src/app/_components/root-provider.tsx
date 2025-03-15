"use client";

import type { PropsWithChildren } from "react";

import { Suspense } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "~/components/ui/sonner";

const queryClient = new QueryClient();

export function RootProvider({ children }: Readonly<PropsWithChildren>) {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<>Loading...</>}>{children}</Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}
