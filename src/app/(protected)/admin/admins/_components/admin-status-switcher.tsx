"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { CheckCircle2Icon, Loader2Icon, ShieldAlertIcon } from "lucide-react";
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
import { cn } from "~/lib/utils";

type AdminStatus = "PENDING" | "APPROVED" | "REJECTED";

async function updateAdminStatus({
  token,
  id,
  status,
}: {
  token: string | null;
  id: string;
  status: AdminStatus;
}) {
  const response = await axios.put(
    routes.api.superAdmin.admins.url(id),
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

export function AdminStatusSwitcher({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: AdminStatus;
}) {
  const queryClient = useQueryClient();
  const { token } = useAuthContext();

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<AdminStatus>(currentStatus);

  const handleDialogChange = (open: boolean) => {
    if (open) {
      setSelectedStatus(currentStatus);
    }
    setIsStatusDialogOpen(open);
  };

  const statusUpdateMutation = useMutation({
    mutationFn: updateAdminStatus,
    onSuccess: ({ info }) => {
      toast.success(info.message || "Admin status updated successfully");
      setIsStatusDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.info?.message || "Failed to update admin status",
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const getStatusVariant = () => {
    switch (currentStatus) {
      case "PENDING":
        return "default";
      case "REJECTED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const StatusIcon = () => {
    if (currentStatus === "APPROVED") {
      return <CheckCircle2Icon className="size-4 mr-1" />;
    }
    return <ShieldAlertIcon className="size-4 mr-1" />;
  };

  return (
    <Dialog open={isStatusDialogOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Badge
          variant={getStatusVariant()}
          className="cursor-pointer flex items-center hover:opacity-80 transition-opacity capitalize"
        >
          <StatusIcon />
          {currentStatus.toLowerCase()}
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Admin Status</DialogTitle>
          <DialogDescription>
            Change the admin's status. This will affect their access and
            permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Select
            value={selectedStatus}
            onValueChange={(value) => setSelectedStatus(value as AdminStatus)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
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
              statusUpdateMutation.isPending || selectedStatus === currentStatus
            }
            onClick={() =>
              statusUpdateMutation.mutate({
                token,
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
