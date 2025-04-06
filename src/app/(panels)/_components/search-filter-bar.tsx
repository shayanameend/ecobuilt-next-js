import type { FormEvent, ReactNode } from "react";

import { SearchIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface SearchFilterBarProps {
  queryTerm: string;
  setQueryTerm: (value: string) => void;
  handleSearch: (e: FormEvent) => void;
  placeholder?: string;
  filterComponent?: ReactNode;
}

export function SearchFilterBar({
  queryTerm,
  setQueryTerm,
  handleSearch,
  placeholder = "Search...",
  filterComponent,
}: SearchFilterBarProps) {
  return (
    <div
      className={cn("flex-1 relative flex items-center justify-between gap-2")}
    >
      {filterComponent}
      <form
        onSubmit={handleSearch}
        className="flex-1 flex items-center relative"
      >
        <Input
          placeholder={placeholder}
          className={cn("pr-10")}
          value={queryTerm}
          onChange={(e) => setQueryTerm(e.target.value)}
        />
        <Button
          type="submit"
          variant="secondary"
          size="icon"
          className={cn("absolute right-0.5 size-8")}
        >
          <SearchIcon className="size-4" />
        </Button>
      </form>
    </div>
  );
}
