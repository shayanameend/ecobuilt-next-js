"use client";

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
import { Textarea } from "~/components/ui/textarea";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

const ContactFormSchema = zod.object({
  name: zod.string({
    message: "Name must be string",
  }),
  email: zod
    .string({
      message: "Email must be string",
    })
    .email({
      message: "Invalid email",
    }),
  phone: zod.string({
    message: "Phone must be string",
  }),
  subject: zod.string({
    message: "Subject must be string",
  }),
  message: zod.string({
    message: "Message must be string",
  }),
});

async function contact({
  name,
  email,
  phone,
  subject,
  message,
}: zod.infer<typeof ContactFormSchema>) {
  const response = await axios.post(routes.api.public.contact.url(), {
    name,
    email,
    phone,
    subject,
    message,
  });

  return response.data;
}

export function ContactForm() {
  const form = useForm<zod.infer<typeof ContactFormSchema>>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: contact,
    onSuccess: ({ info }) => {
      toast.success(info.message);
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

  const onSubmit = (data: zod.infer<typeof ContactFormSchema>) => {
    contactMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6")}>
        <div className={cn("flex gap-2 items-start")}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className={cn("flex-1")}>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className={cn("flex-1")}>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="123-456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
            name="subject"
            render={({ field }) => (
              <FormItem className={cn("flex-1")}>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Your Subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={cn("flex gap-2 items-start")}>
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className={cn("flex-1")}>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your Message"
                    {...field}
                    className={cn("resize-none")}
                  />
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
            disabled={contactMutation.isPending}
          >
            {contactMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Send Message</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
