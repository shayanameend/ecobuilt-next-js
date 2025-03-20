"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

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
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

const UpdatePasswordFormSchema = zod.object({
  password: zod.string({
    message: "Password must be a string",
  }),
});

async function updatePassword({
  password,
}: zod.infer<typeof UpdatePasswordFormSchema>) {
  const response = await axios.post(routes.api.auth.updatePassword.url(), {
    password,
  });

  return response.data;
}

export function UpdatePasswordForm() {
  const router = useRouter();

  const form = useForm<zod.infer<typeof UpdatePasswordFormSchema>>({
    resolver: zodResolver(UpdatePasswordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      sessionStorage.removeItem("token");

      router.push(routes.app.auth.signIn.url());
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

  const onSubmit = (data: zod.infer<typeof UpdatePasswordFormSchema>) => {
    updatePasswordMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6")}>
        <div className={cn("flex gap-2 items-start")}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className={cn("flex-1")}>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
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
            disabled={updatePasswordMutation.isPending}
          >
            {updatePasswordMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Update Password</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
