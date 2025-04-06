"use client";

import { useState } from "react";

import Image from "next/image";

import {
  ClockIcon,
  ExternalLinkIcon,
  ShoppingBagIcon,
  StarIcon,
  TagIcon,
  XCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { routes } from "~/lib/routes";
import {
  type CategoryType,
  OrderStatus,
  type ProductType,
  type PublicOrderToProductType,
  type PublicOrderType,
  type PublicReviewType,
  type VendorProfileType,
} from "~/lib/types";
import { cn, formatDate, formatPrice } from "~/lib/utils";
import { AddReview } from "./add-review";

type OrderDetailProps = {
  order: PublicOrderType & {
    orderToProduct: (PublicOrderToProductType & {
      product: ProductType & {
        category: CategoryType;
        vendor: VendorProfileType;
      };
    })[];
    review?: PublicReviewType;
  };
  token: string | null;
  onReviewAdded?: () => void;
};

export function OrderDetail({ order, token, onReviewAdded }: OrderDetailProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case OrderStatus.APPROVED:
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case OrderStatus.PROCESSING:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case OrderStatus.IN_TRANSIT:
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case OrderStatus.REJECTED:
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  // Check if order can be cancelled
  const canCancel = [
    OrderStatus.PENDING,
    OrderStatus.APPROVED,
    OrderStatus.PROCESSING,
  ].includes(order.status as OrderStatus);

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
              <Badge
                className={cn("font-normal", getStatusColor(order.status))}
              >
                {order.status}
              </Badge>
            </div>
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-semibold">
                {formatPrice(order.totalPrice)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShoppingBagIcon className="size-4 text-primary" />
                <p className="text-sm font-medium">Order ID</p>
              </div>
              <p className="text-sm font-mono pl-6">{order.id}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ClockIcon className="size-4 text-primary" />
                <p className="text-sm font-medium">Order Date</p>
              </div>
              <p className="text-sm pl-6">{formatDate(order.createdAt)}</p>
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
                      {formatPrice(
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
                    {formatPrice(order.totalPrice)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Display existing review if available */}
        {order.status === OrderStatus.DELIVERED && order.review && (
          <>
            <Separator className="my-4" />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StarIcon className="size-4 text-primary" />
                <h3 className={cn("text-sm font-semibold", domine.className)}>
                  Your Review
                </h3>
              </div>
              <div className="p-4 bg-muted/50 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={cn(
                          "size-4",
                          i < order.review!.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground",
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(order.review.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {order.review.comment || (
                    <span className="italic">No comment provided.</span>
                  )}
                </p>
              </div>
            </div>
          </>
        )}

        <DialogFooter className="flex justify-between pt-4">
          <div>
            {order.status === OrderStatus.DELIVERED && !order.review && (
              <AddReview
                orderId={order.id}
                orderStatus={order.status as OrderStatus}
                token={token}
                onReviewAdded={onReviewAdded}
              />
            )}
          </div>
          <div>
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  // Close the current dialog
                  setIsOpen(false);

                  // Show a confirmation dialog
                  const confirmCancel = window.confirm(
                    "Are you sure you want to cancel this order? This action cannot be undone.",
                  );

                  if (confirmCancel) {
                    // Make the API call to cancel the order
                    fetch(routes.api.user.orders.url(order.id), {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({
                        status: OrderStatus.CANCELLED,
                      }),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        toast.success(
                          data.info?.message || "Order cancelled successfully",
                        );
                        // Refresh the page to show updated status
                        window.location.reload();
                      })
                      .catch((error) => {
                        toast.error(
                          "Failed to cancel order. Please try again.",
                        );
                        console.error("Error cancelling order:", error);
                      });
                  }
                }}
              >
                <XCircleIcon className="size-4 mr-2" />
                Cancel Order
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
