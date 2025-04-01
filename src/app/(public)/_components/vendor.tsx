"use client";

import type { VendorProfileType } from "~/lib/types";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

interface VendorProps {
  vendor: VendorProfileType;
}

export function Vendor({ vendor }: Readonly<VendorProps>) {
  return (
    <Link href={routes.app.public.vendors.url(vendor.id)}>
      <Card className={cn("p-0 gap-0")}>
        <CardContent className={cn("p-0")}>
          <Image
            src={`${process.env.NEXT_PUBLIC_FILE_URL}/${vendor.pictureId}`}
            alt={vendor.name}
            width={180}
            height={180}
            sizes="(max-width: 640px) 120px, (max-width: 1024px) 150px, 180px"
            className={cn("h-48 w-full object-cover rounded-t-xl")}
          />
        </CardContent>
        <CardFooter className={cn("p-4 flex-col items-stretch gap-2")}>
          <div>
            <h3 className={cn("")}>{vendor.name}</h3>
          </div>
          <div className={cn("flex justify-between items-center")}>
            <p className={cn("")}>{vendor.description}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
