import type { MultipleResponseType } from "~/lib/types";

import { CardDescription, CardFooter } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { AdminPagination } from "./admin-pagination";

interface AdminTableFooterProps {
  currentPage: number;
  meta?: Partial<MultipleResponseType<any>["meta"]>;
  onPageChange: (page: number) => void;
  itemName?: string;
  className?: string;
}

export function AdminTableFooter({
  currentPage,
  meta,
  onPageChange,
  itemName = "items",
  className,
}: AdminTableFooterProps) {
  return (
    <CardFooter className={cn("flex items-center gap-8", className)}>
      <CardDescription>
        <p>
          Showing{" "}
          {(meta?.limit || 0) < (meta?.total || 0)
            ? meta?.limit || 0
            : meta?.total || 0}{" "}
          of {meta?.total || 0} {itemName}
        </p>
      </CardDescription>
      <AdminPagination
        currentPage={currentPage}
        meta={meta}
        onPageChange={onPageChange}
      />
    </CardFooter>
  );
}
