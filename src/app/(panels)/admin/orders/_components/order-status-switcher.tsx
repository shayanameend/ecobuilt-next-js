"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import {
  CheckCircle2Icon,
  ClockIcon,
  Loader2Icon,
  PackageIcon,
  ShieldAlertIcon,
  ShieldXIcon,
  TruckIcon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import type { OrderStatus } from "~/lib/types";
import { cn } from "~/lib/utils";

type OrderStatusType = keyof typeof OrderStatus;

async function updateOrderStatus({
  token,
  id,
  status,
}: {
  token: string | null;
  id: string;
  status: OrderStatusType;
}) {
  const response = await axios.put(
    routes.api.admin.orders.url(id),
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export function OrderStatusSwitcher({
  id,
  status,
  token,
}: {
  id: string;
  status: OrderStatusType;
  token: string | null;
}) {
  const queryClient = useQueryClient();
  const { token: authToken } = useAuthContext();
  const effectiveToken = token || authToken;

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusType>(status);

  const handleDialogChange = (open: boolean) => {
    if (open) {
      setSelectedStatus(status);
    }
    setIsStatusDialogOpen(open);
  };

  const statusUpdateMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: ({ info }) => {
      toast.success(info.message || "Order status updated successfully");
      setIsStatusDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.info?.message || "Failed to update order status",
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const getStatusVariant = () => {
    switch (status) {
      case "PENDING":
        return "default";
      case "REJECTED":
      case "CANCELLED":
        return "destructive";
      case "APPROVED":
      case "PROCESSING":
      case "IN_TRANSIT":
        return "secondary";
      case "DELIVERED":
        return "outline";
      default:
        return "outline";
    }
  };

  const StatusIcon = () => {
    switch (status) {
      case "PENDING":
        return <ClockIcon className="size-4 mr-1" />;
      case "REJECTED":
        return <ShieldXIcon className="size-4 mr-1" />;
      case "CANCELLED":
        return <XCircleIcon className="size-4 mr-1" />;
      case "APPROVED":
        return <CheckCircle2Icon className="size-4 mr-1" />;
      case "PROCESSING":
        return <PackageIcon className="size-4 mr-1" />;
      case "IN_TRANSIT":
        return <TruckIcon className="size-4 mr-1" />;
      case "DELIVERED":
        return <CheckCircle2Icon className="size-4 mr-1" />;
      default:
        return <ShieldAlertIcon className="size-4 mr-1" />;
    }
  };

  return (
    <Dialog open={isStatusDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Badge
          variant={getStatusVariant()}
          className="cursor-pointer flex items-center hover:opacity-80 transition-opacity capitalize"
        >
          <StatusIcon />
          {status.toLowerCase().replace("_", " ")}
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
          <DialogDescription>
            Change the order's status. This will affect the order processing
            workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select
            value={selectedStatus}
            onValueChange={(value) =>
              setSelectedStatus(value as OrderStatusType)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="lg"
            className={cn("flex-1")}
            onClick={() => setIsStatusDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="lg"
            className={cn("flex-1")}
            disabled={
              statusUpdateMutation.isPending || selectedStatus === status
            }
            onClick={() =>
              statusUpdateMutation.mutate({
                token: effectiveToken,
                id,
                status: selectedStatus,
              })
            }
          >
            {statusUpdateMutation.isPending && (
              <Loader2Icon className={cn("mr-2 h-4 w-4 animate-spin")} />
            )}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
