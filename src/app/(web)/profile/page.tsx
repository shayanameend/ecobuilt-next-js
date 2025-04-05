import { CreateProfileForm } from "~/components/forms/create-profile-form";
import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default function ProfilePage() {
  return (
    <div className={cn("flex-1 self-center space-y-8 md:p-4")}>
      <div className={cn("space-y-2 text-center")}>
        <h2
          className={cn("text-black/75 text-3xl font-bold", domine.className)}
        >
          Create Profile
        </h2>
        <p className={"text-muted-foreground text-base font-medium"}>
          Set up your profile to personalize your experience. Tell us about
          yourself and get started with our platform.
        </p>
      </div>
      <CreateProfileForm />
    </div>
  );
}
