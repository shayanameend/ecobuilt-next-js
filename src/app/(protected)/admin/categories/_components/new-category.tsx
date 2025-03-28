"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { Loader2Icon } from "lucide-react";
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

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

const CreateCategoryFormSchema = zod.object({
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
});

async function createCategory({
  token,
  data,
}: { token: string | null; data: zod.infer<typeof CreateCategoryFormSchema> }) {
  const response = await axios.post(routes.api.admin.categories.url(), data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export function NewCategory() {
  const queryClient = useQueryClient();

  const { token } = useAuthContext();

  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);

  const form = useForm<zod.infer<typeof CreateCategoryFormSchema>>({
    resolver: zodResolver(CreateCategoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      setIsNewCategoryOpen(false);

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

  const onSubmit = (data: zod.infer<typeof CreateCategoryFormSchema>) => {
    createCategoryMutation.mutate({ token, data });
  };

  return (
    <Dialog open={isNewCategoryOpen} onOpenChange={setIsNewCategoryOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="default">
          <span>New Category</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Category</DialogTitle>
          <DialogDescription>
            Add a new product category for your inventory.
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
              <Button
                variant="default"
                size="lg"
                className={cn("w-full")}
                type="submit"
                disabled={createCategoryMutation.isPending}
              >
                {createCategoryMutation.isPending && (
                  <Loader2Icon className={cn("animate-spin")} />
                )}
                <span>Add</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
