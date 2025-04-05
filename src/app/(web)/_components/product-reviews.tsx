"use client";

import type { MultipleResponseType, PublicReviewType } from "~/lib/types";

import * as React from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import {
  AlertCircleIcon,
  Loader2Icon,
  MessageSquare,
  StarIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { routes } from "~/lib/routes";
import { cn } from "~/lib/utils";
import { EmptyState } from "../../_components/empty-state";

const REVIEW_LIMIT = 5;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "size-4",
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-muted-foreground",
          )}
        />
      ))}
    </div>
  );
}

async function getReviewsPage({
  productId,
  limit,
  pageParam = 1,
}: {
  productId: string;
  limit: number;
  pageParam?: number;
}) {
  const url = routes.api.public.reviews.url(productId);
  const response = await axios.get<
    MultipleResponseType<{ reviews: PublicReviewType[] }>
  >(url, {
    params: {
      sort: "LATEST",
      limit,
      page: pageParam,
    },
  });
  return response.data;
}

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: Readonly<ProductReviewsProps>) {
  const {
    data: reviewsQuery,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["reviews", productId],
    queryFn: ({ pageParam }) =>
      getReviewsPage({ productId, limit: REVIEW_LIMIT, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.meta.page;
      const totalPages = lastPage.meta.pages;
      if (currentPage < totalPages) {
        return currentPage + 1;
      }
      return undefined;
    },
  });

  const allReviews = React.useMemo(
    () => reviewsQuery?.pages.flatMap((page) => page.data.reviews) ?? [],
    [reviewsQuery],
  );

  const totalReviews = reviewsQuery?.pages[0]?.meta?.total ?? 0;

  return (
    <div className={cn("mt-12 pt-8 border-t")}>
      <Card className={cn("border-none shadow-none")}>
        <CardHeader className={cn("px-0")}>
          <CardTitle className={cn("text-xl lg:text-2xl")}>
            Customer Reviews ({totalReviews})
          </CardTitle>
          {totalReviews > 0 && (
            <CardDescription>
              Showing {allReviews.length} of {totalReviews} reviews.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={cn("px-0 space-y-6")}>
          {isFetching && !isFetchingNextPage && allReviews.length === 0 && (
            <div className="flex justify-center items-center py-10">
              <Loader2Icon className="size-8 text-primary animate-spin" />
              <span className="ml-2 text-muted-foreground">
                Loading reviews...
              </span>
            </div>
          )}

          {isError && !isFetchingNextPage && (
            <div className="text-center py-10 px-4 border rounded-md bg-muted">
              <AlertCircleIcon className="size-10 text-destructive mx-auto mb-3" />
              <p className="text-destructive font-medium mb-1">
                Failed to load reviews
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {error instanceof Error
                  ? error.message
                  : "An unknown error occurred."}
              </p>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          )}

          {!isFetching && !isError && allReviews.length === 0 && (
            <EmptyState
              icon={MessageSquare}
              title="No Reviews Yet"
              description="Be the first to share your thoughts on this product."
              className="py-10 border rounded-md"
            />
          )}

          {allReviews.length > 0 && (
            <div className="space-y-6">
              {allReviews.map((review, index) => (
                <React.Fragment key={review.id}>
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback>RV</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            Verified Buyer
                          </span>
                          <StarRating rating={review.rating} />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(review.createdAt), "PP")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment || (
                          <span className="italic">No comment provided.</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {index < allReviews.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="pt-4 text-center">
            {hasNextPage && (
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Reviews"
                )}
              </Button>
            )}

            {!hasNextPage &&
              allReviews.length > 0 &&
              !isFetching &&
              !isError && (
                <p className="text-sm text-muted-foreground">
                  You've reached the end of the reviews.
                </p>
              )}

            {isError && isFetchingNextPage && (
              <div className="text-center py-4 px-4 border border-destructive/50 rounded-md bg-destructive/10">
                <p className="text-sm text-destructive mb-2">
                  Could not load more reviews. Please try again.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => fetchNextPage()}
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
