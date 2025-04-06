import {
  PackageIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

import { AdminPageLayout } from "~/app/(panels)/_components/admin-page-layout";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

export default function DashboardPage() {
  return (
    <AdminPageLayout
      title="Dashboard"
      description="Welcome to the admin dashboard. Here you can manage your content, monitor analytics, and configure system settings."
    >
      <div
        className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4")}
      >
        <Card>
          <CardHeader className={cn("flex items-center justify-between")}>
            <CardTitle>
              <h3 className={cn("text-foreground/85 font-medium")}>
                Total Vendors
              </h3>
            </CardTitle>
            <TrendingUpIcon className={cn("size-5 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <h4 className={cn("text-2xl font-bold")}>+2350</h4>
            <p className={cn("text-muted-foreground text-base font-medium")}>
              +7% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={cn("flex items-center justify-between")}>
            <CardTitle>
              <h3 className={cn("text-foreground/85 font-medium")}>
                Total Products
              </h3>
            </CardTitle>
            <PackageIcon className={cn("size-5 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <h4 className={cn("text-2xl font-bold")}>+24</h4>
            <p className={cn("text-muted-foreground text-base font-medium")}>
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={cn("flex items-center justify-between")}>
            <CardTitle>
              <h3 className={cn("text-foreground/85 font-medium")}>
                Total Orders
              </h3>
            </CardTitle>
            <ShoppingCartIcon className={cn("size-5 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <h4 className={cn("text-2xl font-bold")}>+573</h4>
            <p className={cn("text-muted-foreground text-base font-medium")}>
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={cn("flex items-center justify-between")}>
            <CardTitle>
              <h3 className={cn("text-foreground/85 font-medium")}>
                Total Customers
              </h3>
            </CardTitle>
            <UsersIcon className={cn("size-5 text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <h4 className={cn("text-2xl font-bold")}>+2350</h4>
            <p className={cn("text-muted-foreground text-base font-medium")}>
              +7% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div
        className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-8")}
      >
        <Card className={cn("col-span-5")}>
          <CardHeader>
            <CardTitle>
              <h3 className={cn("text-2xl font-bold")}>Recent Orders</h3>
            </CardTitle>
            <CardDescription>
              <p className={cn("text-muted-foreground text-sm font-medium")}>
                You have 12 orders this month.
              </p>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>#1234</TableCell>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-8">
                      <AvatarImage src="/avatars/john.png" alt="John Doe" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-muted-foreground">
                        john.doe@example.com
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Completed</Badge>
                  </TableCell>
                  <TableCell>$123.45</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#1235</TableCell>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-8">
                      <AvatarImage src="/avatars/john.png" alt="John Doe" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-muted-foreground">
                        john.doe@example.com
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Completed</Badge>
                  </TableCell>
                  <TableCell>$234.56</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#1236</TableCell>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-8">
                      <AvatarImage src="/avatars/john.png" alt="John Doe" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-muted-foreground">
                        john.doe@example.com
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Completed</Badge>
                  </TableCell>
                  <TableCell>$345.67</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#1237</TableCell>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-8">
                      <AvatarImage src="/avatars/john.png" alt="John Doe" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-muted-foreground">
                        john.doe@example.com
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Completed</Badge>
                  </TableCell>
                  <TableCell>$456.78</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>#1238</TableCell>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-8">
                      <AvatarImage src="/avatars/john.png" alt="John Doe" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">John Doe</span>
                      <span className="text-xs text-muted-foreground">
                        john.doe@example.com
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Completed</Badge>
                  </TableCell>
                  <TableCell>$567.89</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className={cn("col-span-3")}>
          <CardHeader>
            <CardTitle>
              <h3 className={cn("text-2xl font-bold")}>Recent Products</h3>
            </CardTitle>
            <CardDescription>
              <p className={cn("text-muted-foreground text-sm font-medium")}>
                You added 5 products this month.
              </p>
            </CardDescription>
          </CardHeader>
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
                    <Avatar className="size-8">
                      <AvatarImage
                        src="/products/iphone-12.jpg"
                        alt="iPhone 12"
                      />
                      <AvatarFallback>IP</AvatarFallback>
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
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-8">
                      <AvatarImage
                        src="/products/macbook-pro.jpg"
                        alt="MacBook Pro"
                      />
                      <AvatarFallback>MP</AvatarFallback>
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
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-8">
                      <AvatarImage
                        src="/products/iphone-12-mini.jpg"
                        alt="iPhone 12 Mini"
                      />
                      <AvatarFallback>IM</AvatarFallback>
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
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-8">
                      <AvatarImage
                        src="/products/airpods-pro.jpg"
                        alt="AirPods Pro"
                      />
                      <AvatarFallback>AP</AvatarFallback>
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
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={cn("flex items-center gap-2")}>
                    <Avatar className="size-8">
                      <AvatarImage src="/avatars/ipad-pro.png" alt="John Doe" />
                      <AvatarFallback>IP</AvatarFallback>
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
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
}
