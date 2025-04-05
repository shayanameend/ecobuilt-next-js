"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { VendorProfileType } from "~/lib/types";
import { cn } from "~/lib/utils";

interface VendorConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentVendor: VendorProfileType;
  newVendor: VendorProfileType;
  onConfirm: () => void;
  onCancel: () => void;
}

export function VendorConfirmationDialog({
  isOpen,
  onOpenChange,
  currentVendor,
  newVendor,
  onConfirm,
  onCancel,
}: VendorConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Vendor?</DialogTitle>
          <DialogDescription>
            Your cart currently contains products from{" "}
            <strong>{currentVendor.name}</strong>. Adding this product from{" "}
            <strong>{newVendor.name}</strong> will remove all existing items
            from your cart.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            size="lg"
            className={cn("flex-1")}
            onClick={onCancel}
          >
            Keep Current Items
          </Button>
          <Button
            variant="default"
            size="lg"
            className={cn("flex-1")}
            onClick={onConfirm}
          >
            Replace with New Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
