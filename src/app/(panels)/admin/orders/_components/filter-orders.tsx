"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { FilterIcon } from "lucide-react";
import * as zod from "zod";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

const FilterOrdersFormSchema = zod.object({
  userId: zod.string().optional(),
  status: zod.string().optional(),
  minPrice: zod.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    zod
      .number({
        message: "Min price must be a number",
      })
      .min(0, {
        message: "Min price must be at least 0",
      })
      .optional(),
  ),
  maxPrice: zod.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    zod
      .number({
        message: "Max price must be a number",
      })
      .min(0, {
        message: "Max price must be at least 0",
      })
      .optional(),
  ),
  sort: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .enum(["LATEST", "OLDEST"], {
        message: "Sort must be one of 'LATEST', 'OLDEST'",
      })
      .optional(),
  ),
});

export function FilterOrders() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterOrdersOpen, setIsFilterOrdersOpen] = useState(false);

  const currentUserId = searchParams.get("userId") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentMinPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const currentMaxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;

  const form = useForm<zod.infer<typeof FilterOrdersFormSchema>>({
    resolver: zodResolver(FilterOrdersFormSchema),
    defaultValues: {
      userId: currentUserId,
      status: currentStatus,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
      sort: currentSort as "LATEST" | "OLDEST" | undefined,
    },
  });

  useEffect(() => {
    form.reset({
      userId: currentUserId,
      status: currentStatus,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
      sort: currentSort as "LATEST" | "OLDEST" | undefined,
    });
  }, [
    form.reset,
    currentUserId,
    currentStatus,
    currentMinPrice,
    currentMaxPrice,
    currentSort,
  ]);

  const onSubmit = (data: zod.infer<typeof FilterOrdersFormSchema>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (data.userId) {
      params.set("userId", data.userId);
    } else {
      params.delete("userId");
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

    if (data.minPrice && data.minPrice > 0) {
      params.set("minPrice", data.minPrice.toString());
    } else {
      params.delete("minPrice");
    }

    if (data.maxPrice && data.maxPrice > 0) {
      params.set("maxPrice", data.maxPrice.toString());
    } else {
      params.delete("maxPrice");
    }

    params.delete("page");

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(newUrl);

    setIsFilterOrdersOpen(false);
  };

  const resetFilters = () => {
    form.reset({
      userId: "",
      status: "",
      sort: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });

    const newUrl = window.location.pathname;

    router.push(newUrl);

    setIsFilterOrdersOpen(false);
  };

  return (
    <Dialog open={isFilterOrdersOpen} onOpenChange={setIsFilterOrdersOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className={
            Object.entries({
              userId: currentUserId,
              status: currentStatus,
              sort: currentSort,
              minPrice: currentMinPrice,
              maxPrice: currentMaxPrice,
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
          <DialogTitle>Filter Orders</DialogTitle>
          <DialogDescription>
            Refine your order list using these filters.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-6")}
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className={cn("flex-1")}>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Filter by user ID" {...field} />
                  </FormControl>
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
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="minPrice"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Min Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Max Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="99.99"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="sort"
              render={({ field }) => (
                <FormItem className={cn("flex-1")}>
                  <FormLabel>Sort</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Default</SelectItem>
                      <SelectItem value="LATEST">Latest</SelectItem>
                      <SelectItem value="OLDEST">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
