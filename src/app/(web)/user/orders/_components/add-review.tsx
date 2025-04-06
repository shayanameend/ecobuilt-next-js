"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { StarIcon } from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { routes } from "~/lib/routes";
import { OrderStatus } from "~/lib/types";
import { cn } from "~/lib/utils";

// Form schema matching backend validation
const reviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

interface AddReviewProps {
  orderId: string;
  orderStatus: OrderStatus;
  token: string | null;
  onReviewAdded?: () => void;
}

export function AddReview({
  orderId,
  orderStatus,
  token,
  onReviewAdded,
}: AddReviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  // Only allow reviews for delivered orders
  const canReview = orderStatus === OrderStatus.DELIVERED;

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  async function onSubmit(data: ReviewFormValues) {
    if (!token) {
      toast.error("You must be logged in to leave a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = routes.api.user.reviews.url(orderId);
      await axios.post(
        url,
        {
          rating: data.rating,
          comment: data.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Review submitted successfully");
      setIsOpen(false);
      form.reset();
      setSelectedRating(null);

      // Call the callback if provided
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function StarRatingInput() {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => {
              form.setValue("rating", rating);
              setSelectedRating(rating);
            }}
            className="focus:outline-none"
          >
            <StarIcon
              className={cn(
                "size-8 transition-colors",
                selectedRating && rating <= selectedRating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground hover:text-yellow-400",
              )}
            />
          </button>
        ))}
      </div>
    );
  }

  if (!canReview) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Leave a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Your Order</DialogTitle>
          <DialogDescription>
            Share your experience with this order. Your feedback helps other
            customers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRatingInput />
                  </FormControl>
                  <FormDescription>
                    Select a rating from 1 to 5 stars
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts about this order..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting || !selectedRating}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
