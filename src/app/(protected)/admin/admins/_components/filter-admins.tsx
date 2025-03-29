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
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

const FilterAdminsFormSchema = zod.object({
  phone: zod.string().optional(),
  status: zod.string().optional(),
  sort: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .enum(["LATEST", "OLDEST"], {
        message: "Sort must be one of 'LATEST', 'OLDEST'",
      })
      .optional(),
  ),
  isVerified: zod
    .preprocess(
      (val) => (val === "true" ? true : val === "false" ? false : val),
      zod.boolean({
        message: "isVerified must be a boolean",
      }),
    )
    .optional(),
  isDeleted: zod
    .preprocess(
      (val) => (val === "true" ? true : val === "false" ? false : val),
      zod.boolean({
        message: "isDeleted must be a boolean",
      }),
    )
    .optional(),
});

export function FilterAdmins() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterAdminsOpen, setIsFilterAdminsOpen] = useState(false);

  const currentPhone = searchParams.get("phone") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentIsVerified = searchParams.get("isVerified") !== "false";
  const currentIsDeleted = searchParams.get("isDeleted") === "true";

  const form = useForm<zod.infer<typeof FilterAdminsFormSchema>>({
    resolver: zodResolver(FilterAdminsFormSchema),
    defaultValues: {
      phone: currentPhone,
      status: currentStatus,
      sort: currentSort as "LATEST" | "OLDEST" | undefined,
      isVerified: currentIsVerified,
      isDeleted: currentIsDeleted,
    },
  });

  useEffect(() => {
    form.reset({
      phone: currentPhone,
      status: currentStatus,
      sort: currentSort as "LATEST" | "OLDEST" | undefined,
      isVerified: currentIsVerified,
      isDeleted: currentIsDeleted,
    });
  }, [
    form.reset,
    currentPhone,
    currentStatus,
    currentSort,
    currentIsVerified,
    currentIsDeleted,
  ]);

  const onSubmit = (data: zod.infer<typeof FilterAdminsFormSchema>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (data.phone) {
      params.set("phone", data.phone);
    } else {
      params.delete("phone");
    }

    if (data.status) {
      params.set("status", data.status);
    } else {
      params.delete("status");
    }

    if (data.sort) {
      params.set("sort", data.sort);
    } else {
      params.delete("sort");
    }

    if (data.isVerified !== undefined) {
      params.set("isVerified", data.isVerified.toString());
    } else {
      params.delete("isVerified");
    }

    if (data.isDeleted !== undefined) {
      params.set("isDeleted", data.isDeleted.toString());
    } else {
      params.delete("isDeleted");
    }

    params.delete("page");

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl);

    setIsFilterAdminsOpen(false);
  };

  const resetFilters = () => {
    form.reset({
      phone: "",
      status: "",
      sort: undefined,
      isVerified: true,
      isDeleted: false,
    });

    const newUrl = window.location.pathname;

    router.push(newUrl);

    setIsFilterAdminsOpen(false);
  };

  return (
    <Dialog open={isFilterAdminsOpen} onOpenChange={setIsFilterAdminsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={
            Object.entries({
              phone: currentPhone,
              status: currentStatus,
              sort: currentSort,
              isVerified: currentIsVerified !== true,
              isDeleted: currentIsDeleted !== false,
            }).some(([_, value]) => value)
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : ""
          }
        >
          <FilterIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Admins</DialogTitle>
          <DialogDescription>
            Refine your admin list using these filters.
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
                name="sort"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Sort by</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className={cn("w-full")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort order" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LATEST">Latest</SelectItem>
                        <SelectItem value="OLDEST">Oldest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2 items-start">
              <FormField
                control={form.control}
                name="isVerified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 flex-1">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="size-4"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Verified Admins</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isDeleted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 flex-1">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="size-4"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Deleted Admins</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
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
