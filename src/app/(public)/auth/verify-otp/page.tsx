import type { OtpType } from "~/lib/types";

import { VerifyOTPForm } from "~/components/forms/verify-otp-form";
import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default async function VerifyOTPPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    type: OtpType;
  }>;
}>) {
  const { type } = await searchParams;

  return (
    <div className={cn("flex-1 self-center space-y-8 md:p-4")}>
      <div className={cn("space-y-2 text-center")}>
        <h2
          className={cn("text-black/75 text-3xl font-bold", domine.className)}
        >
          Verify OTP
        </h2>
        <p className={"text-muted-foreground text-base font-medium"}>
          We've sent a verification code to your email. Please enter the 6-digit
          code below to complete the verification process.
        </p>
      </div>
      <VerifyOTPForm type={type} />
    </div>
  );
}
