"use client";

import type { ChangeEvent } from "react";

import type {
  ProductType,
  PublicCategoryType,
  SingleResponseType,
  VendorProfileType,
} from "~/lib/types";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { CameraIcon, EditIcon, Loader2Icon, XIcon } from "lucide-react";
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

const UpdateProductFormSchema = zod.object({
  pictureIds: zod
    .array(
      zod.string().min(36, {
        message: "Picture ID is invalid",
      }),
    )
    .max(5, { message: "Maximum 5 pictures ids are allowed" }),
  pictures: zod
    .array(
      zod.any().refine((file) => file !== undefined, {
        message: "Picture is required",
      }),
    )
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
    })
    .optional(),
  description: zod
    .string({
      message: "Description must be a string",
    })
    .min(3, {
      message: "Description must be at least 3 characters long",
    })
    .max(255, {
      message: "Description must be at most 255 characters long",
    })
    .optional(),
  sku: zod
    .string({
      message: "SKU must be a string",
    })
    .min(3, {
      message: "SKU must be at least 3 characters long",
    })
    .max(255, {
      message: "SKU must be at most 255 characters long",
    })
    .optional(),
  stock: zod.coerce
    .number({
      message: "Stock must be a number",
    })
    .int({
      message: "Stock must be an integer",
    })
    .min(0, {
      message: "Stock must be a non-negative number",
    })
    .optional(),
  price: zod.coerce
    .number({
      message: "Price must be a number",
    })
    .min(1, {
      message: "Price must be a positive number",
    })
    .optional(),
  salePrice: zod.preprocess(
    (val) => (val === "" || val === 0 ? undefined : val),
    zod.coerce
      .number({
        message: "Sale price must be a number",
      })
      .min(0, {
        message: "Sale price must be a non-negative number",
      })
      .optional(),
  ),
  categoryId: zod
    .string({
      message: "Category ID must be a string",
    })
    .length(24, {
      message: "Category ID must be a 24-character string",
    })
    .optional(),
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

async function updateProduct({
  token,
  id,
  data,
}: {
  token: string | null;
  id: string;
  data: zod.infer<typeof UpdateProductFormSchema>;
}) {
  const formData = new FormData();

  for (const pictureId of data.pictureIds) {
    formData.append("pictureIds", pictureId);
  }

  for (const file of data.pictures) {
    formData.append("pictures", file);
  }

  if (data.name) {
    formData.append("name", data.name);
  }
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.sku) {
    formData.append("sku", data.sku);
  }
  if (data.stock !== undefined) {
    formData.append("stock", data.stock.toString());
  }
  if (data.price !== undefined) {
    formData.append("price", data.price.toString());
  }
  if (data.salePrice !== undefined) {
    formData.append("salePrice", data.salePrice.toString());
  }
  if (data.categoryId) {
    formData.append("categoryId", data.categoryId);
  }

  const response = await axios.put(
    routes.api.vendor.products.url(id),
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

export function EditProduct({
  product,
}: {
  product: ProductType & {
    category: PublicCategoryType;
    vendor: VendorProfileType;
  };
}) {
  const queryClient = useQueryClient();

  const { token } = useAuthContext();

  const [formResetKey, setFormResetKey] = useState(0);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [productImages, setProductImages] = useState<string[]>([]);

  const form = useForm<zod.infer<typeof UpdateProductFormSchema>>({
    resolver: zodResolver(UpdateProductFormSchema),
    defaultValues: {
      pictureIds: [],
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

  useEffect(() => {
    form.setValue("name", product.name);
    form.setValue("description", product.description);
    form.setValue("sku", product.sku);
    form.setValue("stock", product.stock);
    form.setValue("price", product.price);
    form.setValue("salePrice", product.salePrice ?? 0);
    form.setValue("categoryId", product.category.id);

    const imageUrls = product.pictureIds.map(
      (pictureId) => `${process.env.NEXT_PUBLIC_FILE_URL}/${pictureId}`,
    );

    setProductImages(imageUrls);
  }, [form.setValue, product]);

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

      form.setValue("pictures", limitedFileArray, { shouldValidate: true });

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
    const currentPictures = form.getValues("pictures");

    const updatedPictures = currentPictures.filter(
      (_, index) => index !== indexToRemove,
    );

    form.setValue("pictures", updatedPictures, { shouldValidate: true });

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

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      setIsEditProductOpen(false);

      queryClient.invalidateQueries({ queryKey: ["products"] });
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

  const onSubmit = (data: zod.infer<typeof UpdateProductFormSchema>) => {
    updateProductMutation.mutate({ token, id: product.id, data });
  };

  return (
    <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <EditIcon />
          <span>Edit</span>
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
                      <Input type="number" placeholder="10" {...field} />
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
                      <Input type="number" placeholder="99.99" {...field} />
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
                    <FormLabel>Sale Price (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="79.99" {...field} />
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
                disabled={updateProductMutation.isPending}
              >
                {updateProductMutation.isPending && (
                  <Loader2Icon className={cn("animate-spin")} />
                )}
                <span>Update Product</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
