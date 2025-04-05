"use client";

import { useState } from "react";

import Image from "next/image";

import { format } from "date-fns";
import {
  CalendarIcon,
  ExternalLinkIcon,
  MapPinIcon,
  PhoneIcon,
  TagIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { domine } from "~/lib/fonts";
import type {
  CategoryType,
  OrderStatus,
  ProductType,
  PublicOrderToProductType,
  PublicOrderType,
  UserProfileType,
  VendorProfileType,
} from "~/lib/types";
import { cn } from "~/lib/utils";
import { OrderStatusSwitcher } from "./order-status-switcher";

type OrderDetailProps = {
  order: PublicOrderType & {
    orderToProduct: (PublicOrderToProductType & {
      product: ProductType & {
        category: CategoryType;
        vendor: VendorProfileType;
      };
    })[];
    user: UserProfileType;
  };
  token: string | null;
};

export function OrderDetail({ order, token }: OrderDetailProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <ExternalLinkIcon className="size-4" />
          <span className="sr-only">View Order Details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className={cn("text-xl", domine.className)}>
            Order Details
          </DialogTitle>
          <DialogDescription>
            Order #{order.id.slice(0, 8)} placed on{" "}
            {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Status and Summary */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <OrderStatusSwitcher
                id={order.id}
                status={order.status as keyof typeof OrderStatus}
                token={token}
              />
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-semibold">
                {formatCurrency(order.totalPrice)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_FILE_URL}/${order.user.pictureId}`}
                  alt={order.user.name}
                  className={cn("object-cover")}
                />
                <AvatarFallback>
                  {order.user.name
                    .split(" ")
                    .map((part) => part.charAt(0).toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.user.name}</p>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <PhoneIcon className="size-3" />
                  {order.user.phone}
                </div>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="flex items-center justify-end gap-1 text-muted-foreground">
                <CalendarIcon className="size-3.5" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center justify-end gap-1 text-muted-foreground mt-1">
                <MapPinIcon className="size-3.5" />
                <span>{order.user.city}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TagIcon className="size-4 text-primary" />
              <h3 className={cn("text-sm font-semibold", domine.className)}>
                Order Items ({order.orderToProduct.length})
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderToProduct.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-md border">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_FILE_URL}/${item.product.pictureIds[0]}`}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {item.product.name}
                          </p>
                          <div className="flex gap-1 mt-0.5">
                            <Badge
                              variant="secondary"
                              className="text-xs px-1 h-4"
                            >
                              {item.product.category.name}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(
                        (item.product.salePrice || item.product.price) *
                          item.quantity,
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-medium">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(order.totalPrice)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Delivery Address */}
          <div className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded">
            <span className="font-medium">Delivery Address:</span>{" "}
            {order.user.deliveryAddress}, {order.user.city},{" "}
            {order.user.postalCode}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
