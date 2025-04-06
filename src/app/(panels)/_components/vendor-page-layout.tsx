import type { ReactNode } from "react";

import { AlertCircleIcon, Loader2Icon } from "lucide-react";

import { EmptyState } from "~/app/_components/empty-state";
import { cn } from "~/lib/utils";
import { PageHeader } from "./page-header";

interface VendorPageLayoutProps {
  title: string;
  description: string;
  isLoading?: boolean;
  isError?: boolean;
  errorTitle?: string;
  errorDescription?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function VendorPageLayout({
  title,
  description,
  isLoading = false,
  isError = false,
  errorTitle = "Error",
  errorDescription = "An error occurred. Please try again later.",
  actions,
  children,
}: VendorPageLayoutProps) {
  if (isLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={AlertCircleIcon}
          title={errorTitle}
          description={errorDescription}
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
    <section className={cn("flex-1 space-y-8")}>
      <PageHeader title={title} description={description} actions={actions} />
      <div className={cn("space-y-6")}>{children}</div>
    </section>
  );
}
