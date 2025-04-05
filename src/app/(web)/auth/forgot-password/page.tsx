import { ForgotPasswordForm } from "~/components/forms/forgot-password-form";
import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default function ForgotPasswordPage() {
  return (
    <div className={cn("flex-1 self-center space-y-8 md:p-4")}>
      <div className={cn("space-y-2 text-center")}>
        <h2
          className={cn("text-black/75 text-3xl font-bold", domine.className)}
        >
          Forgot Password
        </h2>
        <p className={"text-muted-foreground text-base font-medium"}>
          Enter your email address and we'll send you a link to reset your
          password. You'll be back to using your account in no time.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
