import { SignInForm } from "~/components/forms/sign-in-form";
import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default function SignInPage() {
  return (
    <div className={cn("flex-1 self-center space-y-8 md:p-4")}>
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
      <SignInForm />
    </div>
  );
}
