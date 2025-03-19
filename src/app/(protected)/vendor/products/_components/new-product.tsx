"use client";

import type { PublicCategoryType, SingleResponseType } from "~/lib/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import zod from "zod";

import { toast } from "sonner";
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
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

const CreateProductFormSchema = zod.object({
  name: zod
    .string({
      message: "Name must be a string",
    })
    .min(3, {
      message: "Name must be at least 3 characters long",
    })
    .max(255, {
      message: "Name must be at most 255 characters long",
    }),
  description: zod
    .string({
      message: "Description must be a string",
    })
    .min(3, {
      message: "Description must be at least 3 characters long",
    })
    .max(255, {
      message: "Description must be at most 255 characters long",
    }),
  sku: zod
    .string({
      message: "SKU must be a string",
    })
    .min(3, {
      message: "SKU must be at least 3 characters long",
    })
    .max(255, {
      message: "SKU must be at most 255 characters long",
    }),
  stock: zod.coerce
    .number({
      message: "Stock must be a number",
    })
    .int({
      message: "Stock must be an integer",
    })
    .min(0, {
      message: "Stock must be a non-negative number",
    }),
  price: zod.coerce
    .number({
      message: "Price must be a number",
    })
    .min(1, {
      message: "Price must be a positive number",
    }),
  salePrice: zod.coerce
    .number({
      message: "Sale price must be a number",
    })
    .min(1, {
      message: "Sale price must be a positive number",
    })
    .optional(),
  categoryId: zod
    .string({
      message: "Category ID must be a string",
    })
    .length(24, {
      message: "Category ID must be a 24-character string",
    }),
});

async function getCategories({
  token,
}: {
  token: string | null;
}) {
  const response = await axios.get(routes.api.public.categories.url(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

async function createProduct({
  token,
  data,
}: { token: string | null; data: zod.infer<typeof CreateProductFormSchema> }) {
  const response = await axios.post(routes.api.vendor.products.url(), data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export function NewProduct() {
  const { token } = useAuthContext();

  const [isNewProductOpen, setIsNewProductOpen] = useState(false);

  const form = useForm<zod.infer<typeof CreateProductFormSchema>>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      stock: 0,
      price: 0,
      salePrice: 0,
      categoryId: "",
    },
  });

  const {
    data: categoriesQuery,
    isLoading: categoriesQueryIsLoading,
    isError: categoriesQueryIsError,
  } = useQuery<
    SingleResponseType<{
      categories: PublicCategoryType[];
    }>
  >({
    queryKey: ["categories"],
    queryFn: () => getCategories({ token }),
  });

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      setIsNewProductOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      form.reset();
    },
  });

  const onSubmit = (data: zod.infer<typeof CreateProductFormSchema>) => {
    createProductMutation.mutate({ token, data });
  };

  return (
    <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="default">
          <span>New Product</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
          <DialogDescription>
            Add a new product for your inventory.
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
                name="name"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Steel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={cn("space-x-4")}>
              <Button
                variant="default"
                size="lg"
                className={cn("w-full")}
                type="submit"
                disabled={createProductMutation.isPending}
              >
                {createProductMutation.isPending && (
                  <Loader2Icon className={cn("animate-spin")} />
                )}
                <span>Create Product</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
