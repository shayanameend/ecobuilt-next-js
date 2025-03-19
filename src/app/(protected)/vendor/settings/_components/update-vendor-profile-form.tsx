"use client";

import type { ChangeEvent } from "react";

import type { VendorProfileType } from "~/lib/types";

import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { CameraIcon, Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import zod from "zod";

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
import { supportedCities } from "~/lib/config";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

const UpdateVendorProfileFormSchema = zod.object({
  pictureId: zod
    .string()
    .min(36, {
      message: "Picture ID is invalid",
    })
    .optional(),
  picture: zod
    .any()
    .refine((file) => file !== undefined, {
      message: "Picture is required",
    })
    .optional(),
  name: zod
    .string({
      message: "Name must be a string",
    })
    .min(3, {
      message: "Name must be at least 3 characters",
    })
    .max(255, {
      message: "Name must be at most 255 characters",
    })
    .optional(),
  description: zod.string().optional(),
  phone: zod
    .string({
      message: "Phone must be a string",
    })
    .min(3, {
      message: "Phone must be at least 3 characters",
    })
    .max(255, {
      message: "Phone must be at most 255 characters",
    })
    .optional(),
  postalCode: zod.string().optional(),
  city: zod.string().optional(),
  pickupAddress: zod.string().optional(),
});

async function updateProfile({
  token,
  data,
}: {
  token: string | null;
  data: FormData;
}) {
  const response = await axios.put(routes.api.vendor.profile.url(), data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export function UpdateVendorProfileForm({
  profile,
}: { profile: VendorProfileType | undefined }) {
  const queryClient = useQueryClient();

  const { token } = useAuthContext();

  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    form.setValue("pictureId", undefined);
    form.setValue("picture", undefined);
    form.setValue("name", profile?.name);
    form.setValue("description", profile?.description);
    form.setValue("phone", profile?.phone);
    form.setValue("postalCode", profile?.postalCode);
    form.setValue("city", profile?.city);
    form.setValue("pickupAddress", profile?.pickupAddress);

    setProfileImage(
      `${process.env.NEXT_PUBLIC_FILE_URL}/${profile?.pictureId}`,
    );
  }, [profile]);

  const form = useForm<zod.infer<typeof UpdateVendorProfileFormSchema>>({
    resolver: zodResolver(UpdateVendorProfileFormSchema),
    defaultValues: {
      pictureId: undefined,
      picture: undefined,
      name: profile?.name ?? "",
      description: profile?.description ?? "",
      phone: profile?.phone ?? "",
      postalCode: profile?.postalCode ?? "",
      city: profile?.city ?? "",
      pickupAddress: profile?.pickupAddress ?? "",
    },
  });

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      form.setValue("pictureId", profile?.pictureId);
      form.setValue("picture", file);

      const reader = new FileReader();

      reader.onload = () => {
        setProfileImage(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
    onSettled: () => {
      setProfileImage(
        `${process.env.NEXT_PUBLIC_FILE_URL}/${profile?.pictureId}`,
      );

      form.reset();
    },
  });

  const onSubmit = (data: zod.infer<typeof UpdateVendorProfileFormSchema>) => {
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

    updateProfileMutation.mutate({
      token,
      data: formData,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-6")}>
        <div className={cn("flex flex-col gap-2 items-center justify-center")}>
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
                      ?.split(" ")
                      ?.map((part) => part.charAt(0).toUpperCase())
                      ?.join("") || "JD"
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
            render={() => (
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
        <div className={cn("space-x-4")}>
          <Button
            variant="default"
            size="lg"
            className={cn("w-full")}
            type="submit"
            disabled={updateProfileMutation.isPending}
          >
            {updateProfileMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Update Profile</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
