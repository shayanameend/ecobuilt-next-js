import {
  FilterIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";

import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
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
import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default function ProductsPage() {
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
              existing ones, and organize them by categories.
            </p>
          </div>
          <div>
            <Button variant="secondary" size="default">
              <PlusIcon />
              <span>New Product</span>
            </Button>
          </div>
        </div>
        <div className={cn("relative flex items-center justify-between gap-4")}>
          <SearchIcon
            className={cn(
              "absolute top-2.5 left-2.5 size-4 text-muted-foreground",
            )}
          />
          <Input placeholder="Search Products..." className={cn("pl-8")} />
          <Button variant="secondary" size="icon">
            <FilterIcon />
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
                <TableRow>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-10 rounded-md">
                      <AvatarImage
                        src="/products/iphone-12.jpg"
                        alt="iPhone 12"
                      />
                      <AvatarFallback className={cn("rounded-md")}>
                        IP
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">iPhone 12</span>
                      <span className="text-xs text-muted-foreground">
                        Apple
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>
                    <Badge variant="outline">Electronics</Badge>
                  </TableCell>
                  <TableCell>$799.99</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-10 rounded-md">
                      <AvatarImage
                        src="/products/macbook-pro.jpg"
                        alt="MacBook Pro"
                      />
                      <AvatarFallback className={cn("rounded-md")}>
                        MP
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">MacBook Pro</span>
                      <span className="text-xs text-muted-foreground">
                        Apple
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>8</TableCell>
                  <TableCell>
                    <Badge variant="outline">Electronics</Badge>
                  </TableCell>
                  <TableCell>$1299.99</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-10 rounded-md">
                      <AvatarImage
                        src="/products/iphone-12-mini.jpg"
                        alt="iPhone 12 Mini"
                      />
                      <AvatarFallback className={cn("rounded-md")}>
                        IM
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        iPhone 12 Mini
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Apple
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>
                    <Badge variant="outline">Electronics</Badge>
                  </TableCell>
                  <TableCell>$399.99</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-10 rounded-md">
                      <AvatarImage
                        src="/products/airpods-pro.jpg"
                        alt="AirPods Pro"
                      />
                      <AvatarFallback className={cn("rounded-md")}>
                        AP
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">AirPods Pro</span>
                      <span className="text-xs text-muted-foreground">
                        Apple
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>20</TableCell>
                  <TableCell>
                    <Badge variant="outline">Electronics</Badge>
                  </TableCell>
                  <TableCell>$199.99</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-10 rounded-md">
                      <AvatarImage src="/avatars/ipad-pro.png" alt="John Doe" />
                      <AvatarFallback className={cn("rounded-md")}>
                        IP
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">iPad Pro</span>
                      <span className="text-xs text-muted-foreground">
                        Apple
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>
                    <Badge variant="outline">Electronics</Badge>
                  </TableCell>
                  <TableCell>$999.99</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontalIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className={cn("flex items-center gap-8")}>
            <CardDescription>
              <p>Showing 5 of 20 products</p>
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
