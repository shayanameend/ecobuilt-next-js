"use client";

import type { ChangeEvent } from "react";

import type { PublicCategoryType, SingleResponseType } from "~/lib/types";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { CameraIcon, Loader2Icon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
import { Textarea } from "~/components/ui/textarea";
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

const CreateProductFormSchema = zod.object({
  pictures: zod
    .array(
      zod.any().refine((file) => file !== undefined, {
        message: "Picture is required",
      }),
    )
    .min(1, { message: "At least 1 picture is required" })
    .max(5, { message: "Maximum 5 pictures are allowed" }),
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
  const formData = new FormData();

  if (data.pictures && data.pictures.length > 0) {
    for (const file of data.pictures) {
      formData.append("pictures", file);
    }
  }

  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("sku", data.sku);
  formData.append("stock", data.stock.toString());
  formData.append("price", data.price.toString());
  if (data.salePrice) formData.append("salePrice", data.salePrice.toString());
  formData.append("categoryId", data.categoryId);

  const response = await axios.post(
    routes.api.vendor.products.url(),
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export function NewProduct() {
  const queryClient = useQueryClient();

  const { token } = useAuthContext();

  const [formResetKey, setFormResetKey] = useState(0);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);

  const form = useForm<zod.infer<typeof CreateProductFormSchema>>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      pictures: [],
      name: "",
      description: "",
      sku: "",
      stock: 0,
      price: 0,
      salePrice: 0,
      categoryId: "",
    },
  });

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const fileArray = Array.from(files);

      const limitedFileArray = fileArray.slice(0, 5);

      if (fileArray.length > 5) {
        toast.warning(
          "Maximum 5 images allowed. Only the first 5 were selected.",
        );
      }

      form.setValue("pictures", limitedFileArray);

      const newImagePreviews: string[] = [];

      const totalFiles = limitedFileArray.length;

      for (const file of limitedFileArray) {
        const reader = new FileReader();

        reader.onload = () => {
          newImagePreviews.push(reader.result as string);

          if (newImagePreviews.length === totalFiles) {
            setProductImages(newImagePreviews);
          }
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const handleImageRemove = (indexToRemove: number) => {
    // Get current pictures array from form
    const currentPictures = form.getValues("pictures");

    // Remove the image at the specified index
    const updatedPictures = currentPictures.filter(
      (_, index) => index !== indexToRemove,
    );

    // Update form values
    form.setValue("pictures", updatedPictures, { shouldValidate: true });

    // Update image previews
    setProductImages(
      productImages.filter((_, index) => index !== indexToRemove),
    );
  };

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

      queryClient.invalidateQueries({ queryKey: ["categories", "products"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      setProductImages([]);

      form.reset();

      setFormResetKey((prev) => prev + 1);
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
      <DialogContent className="sm:max-w-[768px]">
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
              <div className="flex-[2] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-64">
                <div className="flex flex-wrap gap-2 justify-center">
                  {productImages.length > 0 ? (
                    productImages.map((img, index) => (
                      <div key={img} className="relative">
                        <Avatar
                          className={cn(
                            "rounded-xl size-20 border-2 border-primary/20",
                          )}
                        >
                          <AvatarImage
                            src={img}
                            alt={`Product image ${index + 1}`}
                            width={80}
                            height={80}
                            className={cn("object-cover")}
                          />
                          <AvatarFallback className={cn("rounded-xl")}>
                            {index + 1}
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="absolute -top-1 -right-1 size-4 rounded-full"
                          onClick={() => handleImageRemove(index)}
                        >
                          <XIcon className="size-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <CameraIcon className="h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        No images selected
                      </p>
                    </div>
                  )}
                </div>
                <div className="relative group cursor-pointer mt-4">
                  <Button type="button" variant="outline">
                    <CameraIcon className="size-4" />
                    {productImages.length > 0
                      ? "Change Images"
                      : "Upload Images"}
                  </Button>
                  <Input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="pictures"
                  render={() => (
                    <FormItem>
                      <FormMessage className="text-center" />
                    </FormItem>
                  )}
                />
              </div>
              <div className={cn("flex-[3] space-y-6")}>
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
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem className={cn("flex-1")}>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="STL-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className={cn("flex gap-2 items-start")}>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className={cn("flex-1")}>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description"
                            {...field}
                            className={cn("resize-none")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className={cn("flex gap-2 items-start")}>
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem className={cn("flex-[2]")}>
                        <FormLabel>Category</FormLabel>
                        <Select
                          key={formResetKey}
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={
                            categoriesQueryIsLoading || categoriesQueryIsError
                          }
                        >
                          <FormControl className={cn("w-full")}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
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
                                (category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={category.id}
                                  >
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
              </div>
            </div>
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="99.99"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Sale Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="79.99"
                        {...field}
                      />
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
