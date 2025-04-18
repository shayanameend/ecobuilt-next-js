"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { Loader2Icon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

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
import { useAuthContext } from "~/context/auth";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";

async function deleteCategory({
  token,
  id,
  isDeleted,
}: {
  token: string | null;
  id: string;
  isDeleted: boolean;
}) {
  const response = await axios.delete(
    `${routes.api.admin.categories.url(id)}?isDeleted=${isDeleted}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export function ToggleDeleteCategory({
  id,
  isDeleted,
}: {
  id: string;
  isDeleted: boolean;
}) {
  const queryClient = useQueryClient();

  const { token } = useAuthContext();

  const [isToggleDeleteCategoryOpen, setIsToggleDeleteCategoryOpen] =
    useState(false);

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      setIsToggleDeleteCategoryOpen(false);

      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
  });

  return (
    <Dialog
      open={isToggleDeleteCategoryOpen}
      onOpenChange={setIsToggleDeleteCategoryOpen}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          {isDeleted ? (
            <RotateCcwIcon className="text-green-500" />
          ) : (
            <Trash2Icon className="text-red-500" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            size="lg"
            className={cn("flex-1")}
            type="submit"
            onClick={() => setIsToggleDeleteCategoryOpen(false)}
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant={isDeleted ? "default" : "destructive"}
            size="lg"
            className={cn("flex-1")}
            type="submit"
            disabled={deleteCategoryMutation.isPending}
            onClick={() =>
              deleteCategoryMutation.mutate({
                token,
                id: id,
                isDeleted: !isDeleted,
              })
            }
          >
            {deleteCategoryMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>{isDeleted ? "Restore" : "Delete"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
