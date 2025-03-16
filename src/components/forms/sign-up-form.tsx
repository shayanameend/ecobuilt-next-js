"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

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
import { routes } from "~/lib/routes";
import { OtpType } from "~/lib/types";
import { cn } from "~/lib/utils";

const SignUpFormSchema = zod.object({
  email: zod
    .string({
      message: "Email must be a string",
    })
    .email({
      message: "Invalid Email",
    }),
  password: zod.string({
    message: "Password must be a string",
  }),
});

async function signUp({ email, password }: zod.infer<typeof SignUpFormSchema>) {
  const response = await axios.post(routes.api.auth.signUp.url(), {
    email,
    password,
  });

  return response.data;
}

export function SignUpForm() {
  const router = useRouter();

  const form = useForm<zod.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: ({ data, info }) => {
      toast.success(info.message);

      sessionStorage.setItem("token", data.token);

      router.push(`${routes.app.auth.verifyOtp.url()}?type=${OtpType.VERIFY}`);
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

  const onSubmit = (data: zod.infer<typeof SignUpFormSchema>) => {
    signUpMutation.mutate(data);
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
        <div className={cn("space-x-4")}>
          <Button
            variant="default"
            size="lg"
            className={cn("w-full")}
            type="submit"
            disabled={signUpMutation.isPending}
          >
            {signUpMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Sign Up</span>
          </Button>
        </div>
        <div>
          <p
            className={cn(
              "text-muted-foreground text-center text-base font-medium",
            )}
          >
            Already have an account?{" "}
            <Link
              href={routes.app.auth.signIn.url()}
              className={cn("text-primary")}
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
