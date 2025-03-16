import { SignUpForm } from "~/components/forms/sign-up-form";
import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default function SignUpPage() {
  return (
    <div className={cn("flex-1 self-center space-y-8 md:p-4")}>
      <div className={cn("space-y-2 text-center")}>
        <h2
          className={cn("text-black/75 text-3xl font-bold", domine.className)}
        >
          Sign Up
        </h2>
        <p className={"text-muted-foreground text-base font-medium"}>
          Create an account to start your journey with us. Join our marketplace
          and discover the endless possibilities we offer.
        </p>
      </div>
      <SignUpForm />
    </div>
  );
}
