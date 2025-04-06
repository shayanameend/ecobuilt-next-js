import type { ReactNode } from "react";

import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between")}>
      <div className={cn("space-y-2")}>
        <h2
          className={cn("text-black/75 text-3xl font-bold", domine.className)}
        >
          {title}
        </h2>
        <p className={cn("text-muted-foreground text-base font-medium")}>
          {description}
        </p>
      </div>
      {actions && (
        <div className={cn("flex items-center gap-2")}>{actions}</div>
      )}
    </div>
  );
}
