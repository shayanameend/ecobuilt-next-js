import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { domine } from "~/lib/fonts";
import { cn } from "~/lib/utils";

export default function CategoriesPage() {
  return (
    <>
      <section className={cn("flex-1 space-y-8")}>
        <div className={cn("space-y-2")}>
          <h2
            className={cn("text-black/75 text-3xl font-bold", domine.className)}
          >
            Categories
          </h2>
          <p className={cn("text-muted-foreground text-base font-medium")}>
            Manage your product categories here. Organize your inventory
            efficiently, and suggest new categories.
          </p>
        </div>

        <div className={cn("relative flex items-center justify-between gap-6")}>
          <SearchIcon
            className={cn(
              "absolute top-2.5 left-2.5 size-4 text-muted-foreground",
            )}
          />
          <Input placeholder="Search Categories..." className={cn("pl-8")} />
          <Button variant="secondary" size="default">
            <PlusIcon />
            <span>New Category</span>
          </Button>
        </div>
        <div
          className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4")}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Flooring
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  12 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Lighting
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  8 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Furniture
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  18 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Appliances
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  5 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Flooring
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  12 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Lighting
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  8 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Furniture
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  18 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Appliances
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  5 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Flooring
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  12 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Lighting
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  8 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Furniture
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  18 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Appliances
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  5 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Flooring
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  12 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Lighting
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  8 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Furniture
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  18 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className={cn("text-2xl font-bold", domine.className)}>
                  Appliances
                </h3>
              </CardTitle>
              <CardDescription>
                <p
                  className={cn("text-muted-foreground text-base font-medium")}
                >
                  5 products in this category
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                variant="secondary"
                size="default"
                className={cn("w-full")}
              >
                <span>View</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </>
  );
}
