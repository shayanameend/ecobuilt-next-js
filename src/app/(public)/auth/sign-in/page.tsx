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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { domine } from "~/lib/fonts";
import { routes } from "~/lib/routes";
import { OtpType } from "~/lib/types";
import { cn } from "~/lib/utils";

const SignInFormSchema = zod.object({
  email: zod
    .string({
      message: "Email is Required",
    })
    .email({
      message: "Invalid Email",
    }),
  password: zod
    .string({
      message: "Password is Required",
    })
    .nonempty({
      message: "Password is Required",
    }),
});

async function signIn({ email, password }: zod.infer<typeof SignInFormSchema>) {
  const response = await axios.post(routes.api.auth.signIn.url(), {
    email,
    password,
  });

  return response.data;
}

export default function SignInPage() {
  const router = useRouter();

  const form = useForm<zod.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: ({ data, info }) => {
      toast.success(info.message);

      switch (info.message) {
        case "OTP Sent Successfully!":
          sessionStorage.setItem("token", data.token);

          router.push(
            `${routes.app.auth.verifyOtp.url()}?type=${OtpType.VERIFY}`,
          );
          break;
        case "Sign In Successfull!":
          sessionStorage.removeItem("token");

          localStorage.setItem("token", data.token);
          break;
      }
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

  const onSubmit = (data: zod.infer<typeof SignInFormSchema>) => {
    signInMutation.mutate(data);
  };

  return (
    <div className={cn("flex-1 space-y-8 md:p-4")}>
      <div className={cn("space-y-2 text-center")}>
        <h2
          className={cn("text-black/75 text-3xl font-bold", domine.className)}
        >
          Sign In
        </h2>
        <p className={"text-muted-foreground text-base font-medium"}>
          Welcome back! Sign in to access exclusive features and content. Let's
          get you logged in so you can continue where you left off.
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("space-y-6")}
        >
          <div className={cn("flex gap-2 items-start")}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className={cn("flex-1")}>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@domain.com" {...field} />
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
                  <FormDescription className={cn("text-right")}>
                    <Link
                      href={routes.app.auth.forgotPassword.url()}
                      className={cn("underline underline-offset-4")}
                    >
                      Forgot Password?
                    </Link>
                  </FormDescription>
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
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending && (
                <Loader2Icon className={cn("animate-spin")} />
              )}
              <span>Sign In</span>
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
                className={cn("text-primary underline underline-offset-4")}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
