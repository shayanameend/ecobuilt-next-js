"use client";

import type { VendorProfileType } from "~/lib/types";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { domine } from "~/lib/fonts";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

interface VendorProps {
  vendor: VendorProfileType;
}

export function Vendor({ vendor }: Readonly<VendorProps>) {
  return (
    <Link href={routes.app.public.vendors.url(vendor.id)}>
      <Card className={cn("p-0 gap-0")}>
        <CardContent className={cn("py-5 px-10")}>
          <Image
            src={`${process.env.NEXT_PUBLIC_FILE_URL}/${vendor.pictureId}`}
            alt={vendor.name}
            width={64}
            height={64}
            className={cn("h-16 w-full object-contain rounded-t-xl")}
          />
        </CardContent>
        <CardFooter className={cn("p-4 flex-col items-stretch gap-2")}>
          <div>
            <h3 className={cn("text-2xl font-bold", domine.className)}>
              {vendor.name}
            </h3>
          </div>
          <div className={cn("flex justify-between items-center")}>
            <p className={cn("text-base")}>{vendor.description}</p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
