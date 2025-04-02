"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilterIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

const FilterCategoriesFormSchema = zod.object({
  status: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .enum(["PENDING", "REJECTED", "APPROVED"], {
        message: "Status must be one of 'PENDING', 'REJECTED', 'APPROVED'",
      })
      .optional(),
  ),
  isDeleted: zod
    .preprocess(
      (val) => (val === "true" ? true : val === "false" ? false : val),
      zod.boolean({
        message: "isDeleted must be a boolean",
      }),
    )
    .optional(),
});

export function FilterCategories() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterCategoriesOpen, setIsFilterCategoriesOpen] = useState(false);

  const currentStatus = searchParams.get("status") || "";
  const currentIsDeleted = searchParams.get("isDeleted") || "false";

  const form = useForm<zod.infer<typeof FilterCategoriesFormSchema>>({
    resolver: zodResolver(FilterCategoriesFormSchema),
    defaultValues: {
      status: currentStatus as "PENDING" | "REJECTED" | "APPROVED" | undefined,
      isDeleted: currentIsDeleted === "true",
    },
  });

  useEffect(() => {
    form.reset({
      status: currentStatus as "PENDING" | "REJECTED" | "APPROVED" | undefined,
      isDeleted: currentIsDeleted === "true",
    });
  }, [form, currentStatus, currentIsDeleted]);

  const onSubmit = (data: zod.infer<typeof FilterCategoriesFormSchema>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (data.status) {
      params.set("status", data.status);
    } else {
      params.delete("status");
    }

    if (data.isDeleted !== undefined) {
      params.set("isDeleted", data.isDeleted.toString());
    } else {
      params.delete("isDeleted");
    }

    const name = searchParams.get("name");
    if (name) {
      params.set("name", name);
    }

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(newUrl);

    setIsFilterCategoriesOpen(false);
  };

  const resetFilters = () => {
    form.reset({
      status: undefined,
      isDeleted: false,
    });

    const name = searchParams.get("name");
    const params = new URLSearchParams();
    if (name) {
      params.set("name", name);
    }

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(newUrl);

    setIsFilterCategoriesOpen(false);
  };

  const hasActiveFilters = currentStatus !== "" || currentIsDeleted !== "false";

  return (
    <Dialog
      open={isFilterCategoriesOpen}
      onOpenChange={setIsFilterCategoriesOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={
            hasActiveFilters
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : ""
          }
        >
          <FilterIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Categories</DialogTitle>
          <DialogDescription>
            Refine your category list using these filters.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-6")}
          >
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className={cn("w-full")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isDeleted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="size-4"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Show Deleted Categories</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className={cn("w-1/3")}
                type="button"
                onClick={resetFilters}
              >
                <span>Reset</span>
              </Button>
              <Button
                variant="default"
                size="lg"
                className={cn("w-2/3")}
                type="submit"
              >
                <span>Apply</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
