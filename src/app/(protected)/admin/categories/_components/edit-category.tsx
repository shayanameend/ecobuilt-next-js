"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { EditIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as zod from "zod";

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

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { CategoryType } from "~/lib/types";

const UpdateCategoryFormSchema = zod.object({
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
  status: zod.enum(["PENDING", "REJECTED", "APPROVED"]),
});

async function updateCategory({
  token,
  id,
  data,
}: {
  token: string | null;
  id: string;
  data: zod.infer<typeof UpdateCategoryFormSchema>;
}) {
  const response = await axios.put(routes.api.admin.categories.url(id), data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export function EditCategory({
  category,
}: {
  category: CategoryType;
}) {
  const queryClient = useQueryClient();

  const { token } = useAuthContext();

  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);

  const form = useForm<zod.infer<typeof UpdateCategoryFormSchema>>({
    resolver: zodResolver(UpdateCategoryFormSchema),
    defaultValues: {
      name: "",
      status: "PENDING",
    },
  });

  useEffect(() => {
    form.setValue("name", category.name);
    form.setValue("status", category.status);
  }, [form, category]);

  const editCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      setIsEditCategoryOpen(false);

      queryClient.invalidateQueries({ queryKey: ["categories"] });
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

  const onSubmit = (data: zod.infer<typeof UpdateCategoryFormSchema>) => {
    editCategoryMutation.mutate({ token, id: category.id, data });
  };

  return (
    <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <EditIcon className="text-green-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Edit a product category for inventory.
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
            <div>
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
            <div>
              <Button
                variant="default"
                size="lg"
                className={cn("w-full")}
                type="submit"
                disabled={editCategoryMutation.isPending}
              >
                {editCategoryMutation.isPending && (
                  <Loader2Icon className={cn("animate-spin")} />
                )}
                <span>Update</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
