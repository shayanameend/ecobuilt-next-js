import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default function DashboardPage() {
  return (
    <>
      <div className={cn("space-y-8 p-4")}>
        <div className={cn("space-y-2")}>
          <h2
            className={cn("text-black/75 text-3xl font-bold", domine.className)}
          >
            Dashboard
          </h2>
          <p className={"text-muted-foreground text-base font-medium"}>
            Welcome to the vendor dashboard. Here you can manage your content,
            monitor analytics, and configure system settings.
          </p>
        </div>
        {/* <SignInForm /> */}
      </div>
    </>
  );
}
