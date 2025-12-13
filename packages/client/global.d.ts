import type { QueryFilters } from "@tanstack/solid-query";

declare module "@tanstack/solid-query" {
  interface Register {
    mutationMeta: {
      invalidatesQueries: QueryFilters[];
    };
  }
}
