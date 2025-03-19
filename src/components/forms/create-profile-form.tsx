"use client";

import type { ChangeEvent } from "react";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { CameraIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as zod from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useAuthContext } from "~/context/auth";
import { supportedCities, supportedRoles } from "~/lib/config";
import { routes } from "~/lib/routes";
import { Role } from "~/lib/types";
import { cn } from "~/lib/utils";

const CreateProfileFormSchema = zod
  .object({
    picture: zod.any().refine((file) => file !== undefined, {
      message: "Picture is required",
    }),
    name: zod
      .string({
        message: "Name must be a string",
      })
      .min(3, {
        message: "Name must be at least 3 characters",
      })
      .max(255, {
        message: "Name must be at most 255 characters",
      }),
    description: zod.string().optional(),
    role: zod.enum(supportedRoles, {
      message: `Role must be either ${supportedRoles.join(", ")}`,
    }),
    phone: zod
      .string({
        message: "Phone must be a string",
      })
      .min(3, {
        message: "Phone must be at least 3 characters",
      })
      .max(255, {
        message: "Phone must be at most 255 characters",
      }),
    postalCode: zod.string().optional(),
    city: zod.string().optional(),
    deliveryAddress: zod.string().optional(),
    pickupAddress: zod.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "USER") {
      if (!data.postalCode) {
      }

      if (!data.city) {
      }

      if (!data.deliveryAddress) {
      }
    }

    if (data.role === "VENDOR") {
      if (!data.description) {
      }

      if (!data.postalCode) {
      }

      if (!data.city) {
      }

      if (!data.pickupAddress) {
      }
    }
  });

async function createProfile({
  token,
  data,
}: {
  token: string | null;
  data: FormData;
}) {
  const response = await axios.post(routes.api.public.profile.url(), data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export function CreateProfileForm() {
  const router = useRouter();

  const { token } = useAuthContext();

  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined,
  );

  const form = useForm<zod.infer<typeof CreateProfileFormSchema>>({
    resolver: zodResolver(CreateProfileFormSchema),
    defaultValues: {
      picture: undefined,
      name: "",
      description: "",
      role: "USER",
      phone: "",
      postalCode: "",
      city: "",
      deliveryAddress: "",
      pickupAddress: "",
    },
    mode: "onChange",
  });

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      form.setValue("picture", file);

      const reader = new FileReader();

      reader.onload = () => {
        setProfileImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const createProfileMutation = useMutation({
    mutationFn: createProfile,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      router.push(routes.app.public.root.url());
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      setProfileImage(undefined);

      form.reset();
    },
  });

  const onSubmit = (data: zod.infer<typeof CreateProfileFormSchema>) => {
    const formData = new FormData();

    // biome-ignore lint/complexity/noForEach: <>
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "picture" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    createProfileMutation.mutate({
      token,
      data: formData,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6")}>
        <div
          className={cn(
            "relative top-4 flex flex-col gap-2 items-center justify-center",
          )}
        >
          <div className="relative group">
            <Avatar className={cn("size-32 border-2 border-primary/20")}>
              <AvatarImage
                src={profileImage}
                alt={form.getValues("name")}
                width={128}
                height={128}
                className={cn("object-cover")}
              />
              <AvatarFallback>
                {form.watch("name")
                  ? form
                      .watch("name")
                      .split(" ")
                      .map((part) => part.charAt(0).toUpperCase())
                      .join("")
                  : "JD"}
              </AvatarFallback>
            </Avatar>

            <label
              htmlFor="profile-image-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
            >
              <CameraIcon className="h-8 w-8 text-white" />
            </label>
          </div>

          <Input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          <FormField
            control={form.control}
            name="picture"
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
        </div>
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
        </div>
        {form.watch("role") === Role.VENDOR && (
          <div className={cn("flex gap-2 items-start")}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className={cn("flex-1")}>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself"
                      {...field}
                      className={cn("resize-none")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <div className={cn("flex gap-2 items-start")}>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className={cn("flex-1")}>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className={cn("w-full")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="VENDOR">Vendor</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className={cn("flex-[2]")}>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="123-456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {form.watch("role") === Role.USER && (
          <>
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className={cn("flex-[2]")}>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className={cn("w-full")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {supportedCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="deliveryAddress"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="1234 Main St"
                        {...field}
                        className={cn("resize-none")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
        {form.watch("role") === Role.VENDOR && (
          <>
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className={cn("flex-[2]")}>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className={cn("w-full")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {supportedCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={cn("flex gap-2 items-start")}>
              <FormField
                control={form.control}
                name="pickupAddress"
                render={({ field }) => (
                  <FormItem className={cn("flex-1")}>
                    <FormLabel>Pickup Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="1234 Main St"
                        {...field}
                        className={cn("resize-none")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
        <div className={cn("space-x-4")}>
          <Button
            variant="default"
            size="lg"
            className={cn("w-full")}
            type="submit"
            disabled={createProfileMutation.isPending}
          >
            {createProfileMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Create Profile</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
