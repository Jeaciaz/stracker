import { httpClient } from "@shared/lib/httpClient";
import { queryOptions } from "@tanstack/solid-query";
import { Clock, Effect } from "effect";

export const categoriesQueryOptions = queryOptions({
  queryKey: ["categories"],
  queryFn: () =>
    Effect.gen(function* () {
      yield* Clock.sleep(1000);
      return yield* httpClient.category.list();
    }).pipe(Effect.runPromise),
});
