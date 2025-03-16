"use client";

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
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { OtpType } from "~/lib/types";
import { cn } from "~/lib/utils";

const VerifyOTPFormSchema = zod.object({
  otp: zod.string({
    message: "OTP must be a string",
  }),
});

async function verifyOtp({
  otp,
  type,
}: zod.infer<typeof VerifyOTPFormSchema> & {
  type: OtpType;
}) {
  const response = await axios.post(
    routes.api.auth.verifyOtp.url(),
    {
      otp,
      type,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );

  return response.data;
}

export function VerifyOTPForm({
  type,
}: Readonly<{
  type: OtpType;
}>) {
  const router = useRouter();

  const { setToken, setAuth } = useAuthContext();

  const form = useForm<zod.infer<typeof VerifyOTPFormSchema>>({
    resolver: zodResolver(VerifyOTPFormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: ({ data, info }) => {
      toast.success(info.message);

      switch (type) {
        case OtpType.VERIFY:
          setToken(data.token);
          setAuth(data.user);

          sessionStorage.removeItem("token");

          localStorage.setItem("token", data.token);
          break;
        case OtpType.RESET:
          router.push(routes.app.auth.updatePassword.url());
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

  const onSubmit = (data: zod.infer<typeof VerifyOTPFormSchema>) => {
    verifyOtpMutation.mutate({ ...data, type });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6")}>
        <div className={cn("flex gap-2 items-start")}>
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className={cn("flex-1")}>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="******" {...field} />
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
            disabled={verifyOtpMutation.isPending}
          >
            {verifyOtpMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Verify OTP</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
