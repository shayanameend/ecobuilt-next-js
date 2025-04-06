import type { ReactNode } from "react";

import { AlertCircleIcon, Loader2Icon } from "lucide-react";

import { EmptyState } from "~/app/_components/empty-state";
import { cn } from "~/lib/utils";
import { PageHeader } from "./page-header";

interface AdminPageLayoutProps {
  title: string;
  description: string;
  actions?: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorTitle?: string;
  errorDescription?: string;
  errorAction?: {
    label: string;
    onClick: () => void;
  };
  children: ReactNode;
}

export function AdminPageLayout({
  title,
  description,
  actions,
  isLoading = false,
  isError = false,
  errorTitle = "Error Loading Data",
  errorDescription = "We couldn't load the requested data. Please try again later.",
  errorAction = {
    label: "Retry",
    onClick: () => window.location.reload(),
  },
  children,
}: AdminPageLayoutProps) {
  if (isLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
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
          action={errorAction}
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
