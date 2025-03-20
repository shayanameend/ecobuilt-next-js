"use client";

import type {
  MultipleResponseType,
  ProductType,
  PublicCategoryType,
  VendorProfileType,
} from "~/lib/types";

import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import {
  AlertCircleIcon,
  EditIcon,
  FilterIcon,
  Loader2Icon,
  MoreHorizontalIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useAuthContext } from "~/context/auth";
import { domine } from "~/lib/fonts";
import { routes } from "~/lib/routes";
import { cn, formatPrice } from "~/lib/utils";
import { NewProduct } from "./_components/new-product";

async function getProducts({
  token,
}: {
  token: string | null;
}) {
  const response = await axios.get(routes.api.vendor.products.url(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export default function ProductsPage() {
  const { token } = useAuthContext();

  const {
    data: productsQuery,
    isLoading: productsQueryIsLoading,
    isError: productsQueryIsError,
  } = useQuery<
    MultipleResponseType<{
      products: (ProductType & {
        category: PublicCategoryType;
        vendor: VendorProfileType;
      })[];
    }>
  >({
    queryKey: ["products"],
    queryFn: () => getProducts({ token }),
  });

  if (productsQueryIsLoading) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Loader2Icon className="size-8 text-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (productsQueryIsError || !productsQuery?.data?.products) {
    return (
      <section className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircleIcon className="size-12 text-destructive mx-auto mb-2" />
            <CardTitle>Error Loading Products</CardTitle>
            <CardDescription>
              We couldn't load your products information. Please try again
              later.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <>
      <section className={cn("flex-1 space-y-8")}>
        <div className={cn("flex items-center justify-between gap-6")}>
          <div className={cn("space-y-2")}>
            <h2
              className={cn(
                "text-black/75 text-3xl font-bold",
                domine.className,
              )}
            >
              Products
            </h2>
            <p className={cn("text-muted-foreground text-base font-medium")}>
              Manage your products inventory here. Add new products, update
              existing ones, and organize them.
            </p>
          </div>
          <div>
            <NewProduct />
          </div>
        </div>
        <div className={cn("relative flex items-center justify-between gap-2")}>
          <Button variant="secondary" size="icon">
            <FilterIcon />
          </Button>
          <Input placeholder="Search Products..." className={cn("pr-10")} />
          <Button
            variant="secondary"
            size="icon"
            className={cn("absolute right-0.5 size-8")}
          >
            <SearchIcon />
          </Button>
        </div>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsQuery.data.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className={cn("flex items-center gap-2")}>
                      <Avatar className="size-10 rounded-md">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_FILE_URL}/${product.pictureIds[0]}`}
                          alt={product.name}
                        />
                        <AvatarFallback className={cn("rounded-md")}>
                          {product.name
                            .split(" ")
                            .map((part) => part.charAt(0).toUpperCase())
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {product.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {product.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category.name}</Badge>
                    </TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuGroup>
                            <DropdownMenuItem>
                              <EditIcon />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2Icon />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className={cn("flex items-center gap-8")}>
            <CardDescription>
              <p>
                Showing{" "}
                {productsQuery.meta.limit < productsQuery.meta.total
                  ? productsQuery.meta.limit
                  : productsQuery.meta.total}{" "}
                of {productsQuery.meta.total} products
              </p>
            </CardDescription>
            <Pagination className={cn("flex-1 justify-end")}>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </section>
    </>
  );
}
