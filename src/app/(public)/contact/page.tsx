import { ContactForm } from "~/components/forms/contact-form";
import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default function ContactPage() {
  return (
    <div className={cn("flex-1 self-center space-y-8 md:p-4")}>
      <div className={cn("space-y-2 text-center")}>
        <h2
          className={cn("text-black/75 text-3xl font-bold", domine.className)}
        >
          Contact Us
        </h2>
        <p className={"text-muted-foreground text-base font-medium"}>
          Interested in partnering with us or learning more? Contact EcoBuilt
          Connect today!
        </p>
      </div>
      <ContactForm />
    </div>
  );
}
