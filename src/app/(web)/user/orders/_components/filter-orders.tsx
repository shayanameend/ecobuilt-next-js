"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { FilterIcon, Loader2Icon } from "lucide-react";
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
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { OrderStatus } from "~/lib/types";
import { cn } from "~/lib/utils";

const FilterOrdersFormSchema = zod.object({
  categoryId: zod.string().optional(),
  sort: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .enum(["LATEST", "OLDEST", "PRICE_HIGH_TO_LOW", "PRICE_LOW_TO_HIGH"], {
        message:
          "Sort must be one of 'LATEST', 'OLDEST', 'PRICE_HIGH_TO_LOW', 'PRICE_LOW_TO_HIGH'",
      })
      .optional(),
  ),
  status: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .enum(
        [
          OrderStatus.PENDING,
          OrderStatus.REJECTED,
          OrderStatus.APPROVED,
          OrderStatus.CANCELLED,
          OrderStatus.PROCESSING,
          OrderStatus.IN_TRANSIT,
          OrderStatus.DELIVERED,
        ],
        {
          message:
            "Status must be one of 'PENDING', 'REJECTED', 'APPROVED', 'CANCELLED', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED'",
        },
      )
      .optional(),
  ),
  vendorName: zod.string().optional(),
  minTotalPrice: zod.preprocess(
    (val) => (val === "" || val === 0 ? undefined : val),
    zod.coerce
      .number({
        message: "Min Price must be a number",
      })
      .min(1, {
        message: "Min Price must be a positive number",
      })
      .optional(),
  ),
  maxTotalPrice: zod.preprocess(
    (val) => (val === "" || val === 0 ? undefined : val),
    zod.coerce
      .number({
        message: "Max Price must be a number",
      })
      .min(1, {
        message: "Max Price must be a positive number",
      })
      .optional(),
  ),
});

async function getCategories({ token }: { token: string | null }) {
  const response = await axios.get(routes.api.public.categories.url(), {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  return response.data;
}

export function FilterOrders() {
  const { token } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isFilterOrdersOpen, setIsFilterOrdersOpen] = useState(false);

  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentVendorName = searchParams.get("vendorName") || "";
  const currentMinPrice = searchParams.get("minTotalPrice")
    ? Number(searchParams.get("minTotalPrice"))
    : 0;
  const currentMaxPrice = searchParams.get("maxTotalPrice")
    ? Number(searchParams.get("maxTotalPrice"))
    : 0;

  const form = useForm<zod.infer<typeof FilterOrdersFormSchema>>({
    resolver: zodResolver(FilterOrdersFormSchema),
    defaultValues: {
      categoryId: currentCategoryId,
      sort: currentSort as
        | "LATEST"
        | "OLDEST"
        | "PRICE_HIGH_TO_LOW"
        | "PRICE_LOW_TO_HIGH"
        | undefined,
      status: currentStatus as OrderStatus | undefined,
      vendorName: currentVendorName,
      minTotalPrice: currentMinPrice,
      maxTotalPrice: currentMaxPrice,
    },
  });

  useEffect(() => {
    form.reset({
      categoryId: currentCategoryId,
      sort: currentSort as
        | "LATEST"
        | "OLDEST"
        | "PRICE_HIGH_TO_LOW"
        | "PRICE_LOW_TO_HIGH"
        | undefined,
      status: currentStatus as OrderStatus | undefined,
      vendorName: currentVendorName,
      minTotalPrice: currentMinPrice,
      maxTotalPrice: currentMaxPrice,
    });
  }, [
    form.reset,
    currentCategoryId,
    currentSort,
    currentStatus,
    currentVendorName,
    currentMinPrice,
    currentMaxPrice,
  ]);

  const {
    data: categoriesQuery,
    isLoading: categoriesQueryIsLoading,
    isError: categoriesQueryIsError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ token }),
  });

  const onSubmit = (data: zod.infer<typeof FilterOrdersFormSchema>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (data.categoryId) {
      params.set("categoryId", data.categoryId);
    } else {
      params.delete("categoryId");
    }

    if (data.sort) {
      params.set("sort", data.sort);
    } else {
      params.delete("sort");
    }

    if (data.status) {
      params.set("status", data.status);
    } else {
      params.delete("status");
    }

    if (data.vendorName) {
      params.set("vendorName", data.vendorName);
    } else {
      params.delete("vendorName");
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

    setIsFilterOrdersOpen(false);
  };

  const resetFilters = () => {
    form.reset({
      categoryId: "",
      sort: undefined,
      status: undefined,
      vendorName: "",
      minTotalPrice: undefined,
      maxTotalPrice: undefined,
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
              categoryId: currentCategoryId,
              sort: currentSort,
              status: currentStatus,
              vendorName: currentVendorName,
              minTotalPrice: currentMinPrice,
              maxTotalPrice: currentMaxPrice,
            }).some(([_, value]) => value)
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : ""
          }
        >
          <FilterIcon className="size-4" />
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
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className={cn("flex-[2]")}>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={
                        categoriesQueryIsLoading || categoriesQueryIsError
                      }
                    >
                      <FormControl className={cn("w-full")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesQueryIsLoading && (
                          <div className="flex items-center justify-center p-2">
                            <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                            <span>Loading categories...</span>
                          </div>
                        )}
                        {categoriesQueryIsError && (
                          <div className="text-destructive p-2">
                            Failed to load categories
                          </div>
                        )}
                        {!categoriesQueryIsLoading &&
                          !categoriesQueryIsError &&
                          categoriesQuery?.data?.categories &&
                          categoriesQuery.data.categories.map(
                            (category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ),
                          )}
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
                name="sort"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Sort By</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className={cn("w-full")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LATEST">Latest</SelectItem>
                        <SelectItem value="OLDEST">Oldest</SelectItem>
                        <SelectItem value="PRICE_HIGH_TO_LOW">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="PRICE_LOW_TO_HIGH">
                          Price: Low to High
                        </SelectItem>
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
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={OrderStatus.PENDING}>
                          Pending
                        </SelectItem>
                        <SelectItem value={OrderStatus.APPROVED}>
                          Approved
                        </SelectItem>
                        <SelectItem value={OrderStatus.PROCESSING}>
                          Processing
                        </SelectItem>
                        <SelectItem value={OrderStatus.IN_TRANSIT}>
                          In Transit
                        </SelectItem>
                        <SelectItem value={OrderStatus.DELIVERED}>
                          Delivered
                        </SelectItem>
                        <SelectItem value={OrderStatus.CANCELLED}>
                          Cancelled
                        </SelectItem>
                        <SelectItem value={OrderStatus.REJECTED}>
                          Rejected
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="vendorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Search by vendor name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="minTotalPrice"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Min Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
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
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Max Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
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
