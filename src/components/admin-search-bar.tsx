"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdminSearchBar({ value, onChange }: AdminSearchBarProps) {
  return <div className="flex h-10 w-full max-w-md items-center gap-2 rounded-md border border-fluent-neutral-stroke-2 bg-white px-3 focus-within:border-fluent-brand-primary focus-within:ring-2 focus-within:ring-fluent-brand-primary/20 dark:border-[#525252] dark:bg-[#252525]">
    <Search className="h-4 w-4 shrink-0 text-fluent-text-secondary" aria-hidden="true" />
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      placeholder="Search bill ID or student"
      aria-label="Search orders by bill ID or student name"
      className="h-full min-w-0 flex-1 bg-transparent text-sm text-fluent-text-primary outline-none placeholder:text-fluent-text-secondary"
    />
    {value ? <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" aria-label="Clear search" onClick={() => onChange("")}>
      <X className="h-4 w-4" aria-hidden="true" />
    </Button> : null}
  </div>;
}
