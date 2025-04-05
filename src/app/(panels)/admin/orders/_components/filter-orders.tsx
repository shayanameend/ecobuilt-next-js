"use client";

import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

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

const FilterOrdersFormSchema = zod.object({
  userName: zod.string().optional(),
  productName: zod.string().optional(),
  categoryId: zod.string().optional(),
  status: zod.string().optional(),
  minTotalPrice: zod.preprocess(
    (val) => (val === "" || val === 0 ? undefined : val),
    zod.coerce
      .number({
        message: "Min price must be a number",
      })
      .min(0, {
        message: "Min price must be at least 0",
      })
      .optional(),
  ),
  maxTotalPrice: zod.preprocess(
    (val) => (val === "" || val === 0 ? undefined : val),
    zod.coerce
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

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const currentUserName = searchParams.get("userName") || "";
  const currentProductName = searchParams.get("productName") || "";
  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentMinTotalPrice = searchParams.get("minTotalPrice")
    ? Number(searchParams.get("minTotalPrice"))
    : 0;
  const currentMaxTotalPrice = searchParams.get("maxTotalPrice")
    ? Number(searchParams.get("maxTotalPrice"))
    : 0;

  const form = useForm<zod.infer<typeof FilterOrdersFormSchema>>({
    resolver: zodResolver(FilterOrdersFormSchema),
    defaultValues: {
      userName: currentUserName,
      productName: currentProductName,
      categoryId: currentCategoryId,
      status: currentStatus,
      minTotalPrice: currentMinTotalPrice || undefined,
      maxTotalPrice: currentMaxTotalPrice || undefined,
      sort: currentSort as "LATEST" | "OLDEST" | undefined,
    },
  });

  useEffect(() => {
    form.reset({
      userName: currentUserName,
      productName: currentProductName,
      categoryId: currentCategoryId,
      status: currentStatus,
      minTotalPrice: currentMinTotalPrice || undefined,
      maxTotalPrice: currentMaxTotalPrice || undefined,
      sort: currentSort as "LATEST" | "OLDEST" | undefined,
    });
  }, [
    form.reset,
    currentUserName,
    currentProductName,
    currentCategoryId,
    currentStatus,
    currentMinTotalPrice,
    currentMaxTotalPrice,
    currentSort,
  ]);

  const onSubmit = (data: zod.infer<typeof FilterOrdersFormSchema>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (data.userName) {
      params.set("userName", data.userName);
    } else {
      params.delete("userName");
    }

    if (data.productName) {
      params.set("productName", data.productName);
    } else {
      params.delete("productName");
    }

    if (data.categoryId) {
      params.set("categoryId", data.categoryId);
    } else {
      params.delete("categoryId");
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

    if (data.minTotalPrice && data.minTotalPrice > 0) {
      params.set("minTotalPrice", data.minTotalPrice.toString());
    } else {
      params.delete("minTotalPrice");
    }

    if (data.maxTotalPrice && data.maxTotalPrice > 0) {
      params.set("maxTotalPrice", data.maxTotalPrice.toString());
    } else {
      params.delete("maxTotalPrice");
    }

    params.delete("page");

    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    router.push(newUrl);

    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    form.reset({
      userName: "",
      productName: "",
      categoryId: "",
      status: "",
      minTotalPrice: undefined,
      maxTotalPrice: undefined,
      sort: undefined,
    });

    router.push(window.location.pathname);
    setIsFilterOpen(false);
  };

  const hasActiveFilters = Object.entries({
    userName: currentUserName,
    productName: currentProductName,
    categoryId: currentCategoryId,
    status: currentStatus,
    sort: currentSort,
    minTotalPrice: currentMinTotalPrice,
    maxTotalPrice: currentMaxTotalPrice,
  }).some(([_, value]) => value);

  return (
    <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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
          <FilterIcon className="h-4 w-4" />
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {/* User Name Filter */}
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Filter by customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Name Filter */}
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Filter by product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category ID Filter */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Filter by category ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Filter */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

              {/* Sort Filter */}
              <FormField
                control={form.control}
                name="sort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

              {/* Price Range Filters */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minTotalPrice"
                  render={({ field }) => (
                    <FormItem>
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
                  name="maxTotalPrice"
                  render={({ field }) => (
                    <FormItem>
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
            </div>

            <div className="flex justify-between pt-2">
              <Button type="button" variant="outline" onClick={resetFilters}>
                Reset
              </Button>
              <Button type="submit">Apply Filters</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
