import {
  PackageIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default function DashboardPage() {
  return (
    <>
      <section className={cn("flex-1 space-y-8")}>
        <div className={cn("space-y-2")}>
          <h2
            className={cn("text-black/75 text-3xl font-bold", domine.className)}
          >
            Dashboard
          </h2>
          <p className={"text-muted-foreground text-base font-medium"}>
            Welcome to the vendor dashboard. Here you can manage your content,
            monitor analytics, and configure system settings.
          </p>
        </div>
        <div
          className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4")}
        >
          <Card>
            <CardHeader className={cn("flex items-center justify-between")}>
              <CardTitle>
                <h3 className={cn("text-foreground/85 font-medium")}>
                  Total Revenue
                </h3>
              </CardTitle>
              <TrendingUpIcon className={cn("size-5 text-muted-foreground")} />
            </CardHeader>
            <CardContent>
              <h4 className={cn("text-2xl font-bold", domine.className)}>
                $45,231.89
              </h4>
              <p className={cn("text-muted-foreground text-base font-medium")}>
                +20.1% from last month
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
              <h4 className={cn("text-2xl font-bold", domine.className)}>
                +24
              </h4>
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
              <ShoppingCartIcon
                className={cn("size-5 text-muted-foreground")}
              />
            </CardHeader>
            <CardContent>
              <h4 className={cn("text-2xl font-bold", domine.className)}>
                +573
              </h4>
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
              <h4 className={cn("text-2xl font-bold", domine.className)}>
                +2350
              </h4>
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
              <CardTitle></CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card className={cn("col-span-3")}>
            <CardHeader>
              <CardTitle></CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
