import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { MultipleResponseType } from "~/lib/types";

import { PackageIcon } from "lucide-react";
import { EmptyState } from "~/app/_components/empty-state";
import { Card, CardContent } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

interface UserDataTableProps<T> {
  data: T[] | undefined;
  columns: {
    header: string;
    cell: (item: T) => ReactNode;
  }[];
  emptyState?: {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
}

export function UserDataTable<T>({
  data,
  columns,
  emptyState = {
    title: "No items found",
    description:
      "Try adjusting your search or filter to find what you're looking for.",
    icon: PackageIcon,
  },
}: UserDataTableProps<T>) {
  const isEmpty = !data || data.length === 0;

  return (
    <Card>
      <CardContent className={cn(isEmpty ? "p-6" : "p-0")}>
        {isEmpty ? (
          <EmptyState
            icon={emptyState.icon || PackageIcon}
            title={emptyState.title || "No items found"}
            description={
              emptyState.description ||
              "Try adjusting your search or filter to find what you're looking for."
            }
            action={emptyState.action}
            className="w-full"
          />
        ) : (
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead key={index} className="px-4 py-3">
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className="px-4 py-3">
                        {column.cell(item)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
