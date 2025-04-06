"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { Button } from "~/components/ui/button";
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

const FilterFormSchema = zod.object({
  categoryId: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .string({
        message: "Category ID must be a string",
      })
      .length(24, {
        message: "Category ID must be a 24-character string",
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
  sort: zod.preprocess(
    (val) => (val === "" ? undefined : val),
    zod
      .enum(["LATEST", "OLDEST"], {
        message: "Sort must be one of 'LATEST', 'OLDEST'",
      })
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

export function OrdersSidebar() {
  const { token } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentVendorName = searchParams.get("vendorName") || "";
  const currentMinTotalPrice = searchParams.get("minTotalPrice")
    ? Number(searchParams.get("minTotalPrice"))
    : 0;
  const currentMaxTotalPrice = searchParams.get("maxTotalPrice")
    ? Number(searchParams.get("maxTotalPrice"))
    : 0;

  const form = useForm<zod.infer<typeof FilterFormSchema>>({
    resolver: zodResolver(FilterFormSchema),
    defaultValues: {
      categoryId: currentCategoryId,
      status: currentStatus as OrderStatus | undefined,
      sort: currentSort as "LATEST" | "OLDEST" | undefined,
      vendorName: currentVendorName,
      minTotalPrice: currentMinTotalPrice,
      maxTotalPrice: currentMaxTotalPrice,
    },
  });

  useEffect(() => {
    form.reset({
      categoryId: currentCategoryId,
      status: currentStatus as OrderStatus | undefined,
      sort: currentSort as "LATEST" | "OLDEST" | undefined,
      vendorName: currentVendorName,
      minTotalPrice: currentMinTotalPrice,
      maxTotalPrice: currentMaxTotalPrice,
    });
  }, [
    form.reset,
    currentCategoryId,
    currentStatus,
    currentSort,
    currentVendorName,
    currentMinTotalPrice,
    currentMaxTotalPrice,
  ]);

  const {
    data: categoriesQuery,
    isLoading: categoriesQueryIsLoading,
    isError: categoriesQueryIsError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories({ token }),
  });

  const onSubmit = (data: zod.infer<typeof FilterFormSchema>) => {
    const params = new URLSearchParams(searchParams.toString());

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
  };

  const resetFilters = () => {
    form.reset({
      categoryId: "",
      status: undefined,
      sort: undefined,
      vendorName: "",
      minTotalPrice: undefined,
      maxTotalPrice: undefined,
    });

    const newUrl = window.location.pathname;
    router.push(newUrl);
  };

  return (
    <aside className={cn("hidden md:block w-64 py-8 px-4")}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-5")}
        >
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={categoriesQueryIsLoading || categoriesQueryIsError}
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
                      categoriesQuery.data.categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
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
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className={cn("w-full")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
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

          <FormField
            control={form.control}
            name="sort"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className={cn("w-full")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort By" />
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

          <FormField
            control={form.control}
            name="minTotalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
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
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className={cn("flex-1")}
              type="button"
              onClick={resetFilters}
            >
              Reset
            </Button>

            <Button variant="default" className={cn("flex-1")} type="submit">
              Apply
            </Button>
          </div>
        </form>
      </Form>
    </aside>
  );
}
