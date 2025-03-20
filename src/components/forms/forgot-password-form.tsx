"use client";

import Link from "next/link";
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
import { OtpType } from "~/lib/types";
import { cn } from "~/lib/utils";

const ForgotPasswordFormSchema = zod.object({
  email: zod
    .string({
      message: "Email must be a string",
    })
    .email({
      message: "Invalid Email",
    }),
});

async function forgotPassword({
  email,
}: zod.infer<typeof ForgotPasswordFormSchema>) {
  const response = await axios.post(routes.api.auth.forgotPassword.url(), {
    email,
  });

  return response.data;
}

export function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<zod.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: ({ data, info }) => {
      toast.success(info.message);

      sessionStorage.setItem("token", data.token);

      router.push(`${routes.app.auth.verifyOtp.url()}?type=${OtpType.RESET}`);
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

  const onSubmit = (data: zod.infer<typeof ForgotPasswordFormSchema>) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6")}>
        <div className={cn("flex gap-2 items-start")}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className={cn("flex-1")}>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="john@domain.com" {...field} />
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
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Forgot Password</span>
          </Button>
        </div>
        <div>
          <p
            className={cn(
              "text-muted-foreground text-center text-base font-medium",
            )}
          >
            Don't have an account?{" "}
            <Link
              href={routes.app.auth.signUp.url()}
              className={cn("text-primary")}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
