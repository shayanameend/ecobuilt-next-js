"use client";

import { useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios, { AxiosError } from "axios";
import { Loader2Icon, Trash2Icon } from "lucide-react";
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

async function deleteUser({
  token,
  id,
}: {
  token: string | null;
  id: string;
}) {
  const response = await axios.delete(routes.api.admin.users.url(id), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export function DeleteUser({
  id,
}: {
  id: string;
}) {
  const queryClient = useQueryClient();

  const { token } = useAuthContext();

  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: ({ info }) => {
      toast.success(info.message);

      setIsDeleteUserOpen(false);

      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.info.message);
      }
    },
  });

  return (
    <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className={cn("size-8")}>
          <Trash2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            size="lg"
            className={cn("flex-1")}
            type="submit"
            onClick={() => setIsDeleteUserOpen(false)}
          >
            <span>Cancel</span>
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className={cn("flex-1")}
            type="submit"
            disabled={deleteUserMutation.isPending}
            onClick={() => deleteUserMutation.mutate({ token, id: id })}
          >
            {deleteUserMutation.isPending && (
              <Loader2Icon className={cn("animate-spin")} />
            )}
            <span>Delete</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
